const express = require('express');
const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/reviews
// @desc    获取用户评价列表
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const [reviews, total] = await Promise.all([
      Review.find({ user: req.user._id })
        .populate('product', 'name images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments({ user: req.user._id })
    ]);
    
    res.json({
      success: true,
      reviews,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: '获取评价失败', error: error.message });
  }
});

// @route   POST /api/reviews
// @desc    创建评价
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { productId, orderId, rating, content, images, isAnonymous } = req.body;
    
    // 检查订单是否存在且已完成
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
      status: '已完成'
    });
    
    if (!order) {
      return res.status(400).json({ message: '订单不存在或未完成' });
    }
    
    // 检查是否购买过该商品
    const hasProduct = order.items.some(item => 
      item.product.toString() === productId
    );
    
    if (!hasProduct) {
      return res.status(400).json({ message: '您未购买过该商品' });
    }
    
    // 检查是否已评价
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId,
      order: orderId
    });
    
    if (existingReview) {
      return res.status(400).json({ message: '您已评价过该订单的商品' });
    }
    
    // 创建评价
    const review = await Review.create({
      user: req.user._id,
      product: productId,
      order: orderId,
      rating,
      content,
      images,
      isAnonymous,
      isVerified: true
    });
    
    // 更新商品评分
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length
    });
    
    await review.populate('user', 'username avatar');
    
    res.status(201).json({
      success: true,
      message: '评价成功',
      review
    });
  } catch (error) {
    res.status(500).json({ message: '评价失败', error: error.message });
  }
});

// @route   PUT /api/reviews/:id
// @desc    修改评价
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { rating, content, images } = req.body;
    
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!review) {
      return res.status(404).json({ message: '评价不存在' });
    }
    
    // 只能修改24小时内的评价
    const hoursSinceCreated = (Date.now() - review.createdAt) / (1000 * 60 * 60);
    if (hoursSinceCreated > 24) {
      return res.status(400).json({ message: '评价已超过可修改时间' });
    }
    
    review.rating = rating || review.rating;
    review.content = content || review.content;
    review.images = images || review.images;
    await review.save();
    
    // 重新计算商品评分
    const reviews = await Review.find({ product: review.product });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await Product.findByIdAndUpdate(review.product, {
      rating: Math.round(avgRating * 10) / 10
    });
    
    res.json({ success: true, message: '评价已更新', review });
  } catch (error) {
    res.status(500).json({ message: '更新失败', error: error.message });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    删除评价
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!review) {
      return res.status(404).json({ message: '评价不存在' });
    }
    
    const productId = review.product;
    await review.deleteOne();
    
    // 重新计算商品评分
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 5;
    
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length
    });
    
    res.json({ success: true, message: '评价已删除' });
  } catch (error) {
    res.status(500).json({ message: '删除失败', error: error.message });
  }
});

// @route   POST /api/reviews/:id/like
// @desc    点赞评价
// @access  Public
router.post('/:id/like', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: '评价不存在' });
    }
    
    review.likes += 1;
    await review.save();
    
    res.json({ success: true, likes: review.likes });
  } catch (error) {
    res.status(500).json({ message: '点赞失败', error: error.message });
  }
});

module.exports = router;
