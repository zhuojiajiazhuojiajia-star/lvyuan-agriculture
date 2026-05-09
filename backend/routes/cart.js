const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/cart
// @desc    获取购物车
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name nameEn price images stock');
    
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    
    // 过滤掉已下架商品
    cart.items = cart.items.filter(item => item.product && item.product.stock > 0);
    await cart.save();
    
    const total = cart.items.reduce((sum, item) => {
      return item.selected ? sum + (item.product.price * item.quantity) : sum;
    }, 0);
    
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    res.json({
      success: true,
      cart: cart.items,
      total,
      itemCount
    });
  } catch (error) {
    res.status(500).json({ message: '获取购物车失败', error: error.message });
  }
});

// @route   POST /api/cart
// @desc    添加商品到购物车
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    // 检查商品
    const product = await Product.findById(productId);
    if (!product || product.stock < quantity) {
      return res.status(400).json({ message: '商品库存不足或不存在' });
    }
    
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }
    
    // 检查商品是否已在购物车
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (itemIndex > -1) {
      // 更新数量
      cart.items[itemIndex].quantity += quantity;
    } else {
      // 添加新商品
      cart.items.push({ product: productId, quantity });
    }
    
    cart.updatedAt = Date.now();
    await cart.save();
    
    // 重新填充商品信息
    await cart.populate('items.product', 'name nameEn price images');
    
    res.json({
      success: true,
      message: '已添加到购物车',
      cart: cart.items
    });
  } catch (error) {
    res.status(500).json({ message: '添加失败', error: error.message });
  }
});

// @route   PUT /api/cart/:itemId
// @desc    更新购物车商品数量
// @access  Private
router.put('/:itemId', protect, async (req, res) => {
  try {
    const { quantity, selected } = req.body;
    
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: '购物车不存在' });
    }
    
    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: '商品不存在' });
    }
    
    if (quantity !== undefined) {
      item.quantity = quantity;
    }
    if (selected !== undefined) {
      item.selected = selected;
    }
    
    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate('items.product', 'name nameEn price images');
    
    const total = cart.items.reduce((sum, item) => {
      return item.selected ? sum + (item.product.price * item.quantity) : sum;
    }, 0);
    
    res.json({
      success: true,
      message: '更新成功',
      cart: cart.items,
      total
    });
  } catch (error) {
    res.status(500).json({ message: '更新失败', error: error.message });
  }
});

// @route   DELETE /api/cart/:itemId
// @desc    删除购物车商品
// @access  Private
router.delete('/:itemId', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: '购物车不存在' });
    }
    
    cart.items = cart.items.filter(
      item => item._id.toString() !== req.params.itemId
    );
    
    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate('items.product', 'name nameEn price images');
    
    const total = cart.items.reduce((sum, item) => {
      return item.selected ? sum + (item.product.price * item.quantity) : sum;
    }, 0);
    
    res.json({
      success: true,
      message: '删除成功',
      cart: cart.items,
      total
    });
  } catch (error) {
    res.status(500).json({ message: '删除失败', error: error.message });
  }
});

// @route   DELETE /api/cart
// @desc    清空购物车
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.updatedAt = Date.now();
      await cart.save();
    }
    
    res.json({ success: true, message: '购物车已清空' });
  } catch (error) {
    res.status(500).json({ message: '清空失败', error: error.message });
  }
});

module.exports = router;
