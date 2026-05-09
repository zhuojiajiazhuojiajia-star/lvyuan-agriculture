const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Review = require('../models/Review');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    const query = { isOnSale: true };
    
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sortOption = {};
    sortOption[sort] = order === 'asc' ? 1 : -1;

    const products = await Product.find(query)
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: '获取商品失败', error: error.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = [
      { id: 'vegetables', name: '有机蔬菜', icon: '🥬' },
      { id: 'fruits', name: '有机水果', icon: '🍎' },
      { id: 'grains', name: '有机杂粮', icon: '🌾' },
      { id: 'eggs', name: '散养禽蛋', icon: '🥚' },
      { id: 'honey', name: '天然蜂蜜', icon: '🍯' },
      { id: 'other', name: '其他特产', icon: '🎁' }
    ];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: '获取分类失败', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: '商品不存在' });
    }

    const reviews = await Review.find({ product: req.params.id })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      product,
      reviews,
      reviewCount: await Review.countDocuments({ product: req.params.id }),
      averageRating: reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 5
    });
  } catch (error) {
    res.status(500).json({ message: '获取商品详情失败', error: error.message });
  }
});

router.post('/', adminAuth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: '商品创建成功', product });
  } catch (error) {
    res.status(500).json({ message: '创建商品失败', error: error.message });
  }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: '商品不存在' });
    }
    res.json({ message: '商品更新成功', product });
  } catch (error) {
    res.status(500).json({ message: '更新商品失败', error: error.message });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: '商品不存在' });
    }
    res.json({ message: '商品已删除' });
  } catch (error) {
    res.status(500).json({ message: '删除商品失败', error: error.message });
  }
});

module.exports = router;
