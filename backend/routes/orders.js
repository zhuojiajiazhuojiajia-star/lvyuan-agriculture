const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/orders
// @desc    获取用户订单列表
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = { user: req.user._id };
    if (status) query.status = status;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('items.product', 'name images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: '获取订单失败', error: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    获取订单详情
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('items.product', 'name images');
    
    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: '获取订单详情失败', error: error.message });
  }
});

// @route   POST /api/orders
// @desc    创建订单
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, remark } = req.body;
    
    // 获取购物车
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: '购物车为空' });
    }
    
    // 只处理选中的商品
    const selectedItems = cart.items.filter(item => item.selected);
    if (selectedItems.length === 0) {
      return res.status(400).json({ message: '请选择要购买的商品' });
    }
    
    // 检查库存
    for (const item of selectedItems) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `${item.product.name} 库存不足，仅剩 ${item.product.stock} 件` 
        });
      }
    }
    
    // 计算金额
    const totalAmount = selectedItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    
    // 会员折扣
    const user = await User.findById(req.user._id);
    let discountAmount = 0;
    if (user.memberLevel === '钻石会员') discountAmount = totalAmount * 0.1;
    else if (user.memberLevel === '金卡会员') discountAmount = totalAmount * 0.08;
    else if (user.memberLevel === '银卡会员') discountAmount = totalAmount * 0.05;
    
    // 运费（满99免邮）
    const shippingFee = totalAmount >= 99 ? 0 : 10;
    
    const finalAmount = totalAmount - discountAmount + shippingFee;
    
    // 创建订单
    const orderItems = selectedItems.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images[0]
    }));
    
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      discountAmount,
      shippingFee,
      finalAmount,
      paymentMethod: paymentMethod || '微信支付',
      shippingAddress,
      remark
    });
    
    // 减少库存
    for (const item of selectedItems) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity, sales: item.quantity }
      });
    }
    
    // 清空购物车中已购买的商品
    cart.items = cart.items.filter(item => !item.selected);
    await cart.save();
    
    // 增加会员积分（1元=1积分）
    user.memberPoints += Math.floor(finalAmount);
    user.updateMemberLevel();
    await user.save();
    
    res.status(201).json({
      success: true,
      message: '订单创建成功',
      order: await Order.findById(order._id).populate('items.product', 'name images')
    });
  } catch (error) {
    res.status(500).json({ message: '创建订单失败', error: error.message });
  }
});

// @route   PUT /api/orders/:id/pay
// @desc    模拟支付
// @access  Private
router.put('/:id/pay', protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }
    
    if (order.status !== '待付款') {
      return res.status(400).json({ message: '订单状态不正确' });
    }
    
    order.status = '已付款';
    order.paidAt = new Date();
    await order.save();
    
    res.json({ success: true, message: '支付成功', order });
  } catch (error) {
    res.status(500).json({ message: '支付失败', error: error.message });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    取消订单
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }
    
    if (order.status !== '待付款' && order.status !== '已付款') {
      return res.status(400).json({ message: '订单无法取消' });
    }
    
    // 恢复库存
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, sales: -item.quantity }
      });
    }
    
    order.status = '已取消';
    await order.save();
    
    res.json({ success: true, message: '订单已取消', order });
  } catch (error) {
    res.status(500).json({ message: '取消失败', error: error.message });
  }
});

module.exports = router;
