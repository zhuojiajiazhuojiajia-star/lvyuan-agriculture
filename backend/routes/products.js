const express = require('express');
const Product = require('../models/Product');
const { optional } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/products
// @desc    获取商品列表（支持筛选、排序、分页）
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      minPrice, 
      maxPrice, 
      sort = 'createdAt', 
      order = 'desc',
      page = 1, 
      limit = 12,
      search,
      isOrganic
    } = req.query;
    
    // 构建查询条件
    const query = { isActive: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (isOrganic === 'true') {
      query.isOrganic = true;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // 排序
    const sortOption = {};
    sortOption[sort] = order === 'asc' ? 1 : -1;
    
    // 分页
    const skip = (Number(page) - 1) * Number(limit);
    
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: '获取商品失败', error: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    获取商品详情
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: '商品不存在' });
    }
    
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: '获取商品详情失败', error: error.message });
  }
});

// @route   GET /api/products/:id/reviews
// @desc    获取商品评价
// @access  Public
router.get('/:id/reviews', async (req, res) => {
  try {
    const Review = require('../models/Review');
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [reviews, total] = await Promise.all([
      Review.find({ product: req.params.id })
        .populate('user', 'username avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments({ product: req.params.id })
    ]);
    
    // 计算评分分布
    const ratingStats = await Review.aggregate([
      { $match: { product: new require('mongoose').Types.ObjectId(req.params.id) } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);
    
    res.json({
      success: true,
      reviews,
      ratingStats,
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

// @route   GET /api/products/categories/count
// @desc    获取各分类商品数量
// @access  Public
router.get('/categories/count', async (req, res) => {
  try {
    const categoryCount = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    const categoryMap = {
      vegetable: '有机蔬菜',
      fruit: '有机水果',
      grain: '有机杂粮',
      dairy: '有机蛋奶',
      meat: '有机肉类',
      other: '其他'
    };
    
    const result = categoryCount.map(item => ({
      category: item._id,
      name: categoryMap[item._id] || item._id,
      count: item.count
    }));
    
    res.json({ success: true, categories: result });
  } catch (error) {
    res.status(500).json({ message: '获取分类统计失败', error: error.message });
  }
});

module.exports = router;
