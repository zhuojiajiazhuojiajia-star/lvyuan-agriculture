const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');
const { reviewValidation } = require('../middleware/validation');

router.get('/product/:productId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Review.countDocuments({ product: req.params.productId });
    
    const stats = await Review.aggregate([
      { $match: { product: new require('mongoose').Types.ObjectId(req.params.productId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          rating5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
          rating4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          rating3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          rating2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          rating1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } }
        }
      }
    ]);

    res.json({
      reviews,
      stats: stats[0] || {
        averageRating: 5,
        totalReviews: 0,
        rating5: 0, rating4: 0, rating3: 0, rating2: 0, rating1: 0
      },
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: '获取评论失败', error: error.message });
  }
});

router.post('/', auth, reviewValidation, async (req, res) => {
  try {
    const { productId, orderId, rating, content, images, isAnonymous } = req.body;

    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId
    });

    if (existingReview) {
      return res.status(400).json({ message: '您已经评价过该商品' });
    }

    if (orderId) {
      const order = await Order.findOne({
        _id: orderId,
        user: req.user._id,
        status: 'delivered'
      });

      if (!order) {
        return res.status(400).json({ message: '订单不存在或未送达' });
      }

      const hasProduct = order.items.some(item => 
        item.product.toString() === productId
      );

      if (!hasProduct) {
        return res.status(400).json({ message: '该订单不包含此商品' });
      }
    }

    const review = new Review({
      user: req.user._id,
      product: productId,
      order: orderId,
      rating,
      content,
      images: images || [],
      isAnonymous: isAnonymous || false
    });

    await review.save();
    await review.populate('user', 'username avatar');

    const productReviews = await Review.find({ product: productId });
    const averageRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
    
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(averageRating * 10) / 10
    });

    res.status(201).json({
      message: '评价提交成功',
      review
    });
  } catch (error) {
    res.status(500).json({ message: '提交评价失败', error: error.message });
  }
});

router.put('/:id/like', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: '评论不存在' });
    }

    review.likes += 1;
    await review.save();

    res.json({ message: '点赞成功', likes: review.likes });
  } catch (error) {
    res.status(500).json({ message: '点赞失败', error: error.message });
  }
});

router.post('/:id/reply', adminAuth, async (req, res) => {
  try {
    const { content } = req.body;
    
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: '评论不存在' });
    }

    review.reply = {
      content,
      createdAt: new Date()
    };
    await review.save();

    res.json({ message: '回复成功', review });
  } catch (error) {
    res.status(500).json({ message: '回复失败', error: error.message });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: '评论不存在' });
    }

    const productReviews = await Review.find({ product: review.product });
    const averageRating = productReviews.length > 0
      ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
      : 5;
    
    await Product.findByIdAndUpdate(review.product, {
      rating: Math.round(averageRating * 10) / 10
    });

    res.json({ message: '评论已删除' });
  } catch (error) {
    res.status(500).json({ message: '删除评论失败', error: error.message });
  }
});

module.exports = router;
