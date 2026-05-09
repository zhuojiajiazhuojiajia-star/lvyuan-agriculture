const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');
const { orderValidation } = require('../middleware/validation');

const generateOrderNo = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `LY${year}${month}${day}${random}`;
};

router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = { user: req.user._id };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: '获取订单失败', error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('items.product', 'name image unit');

    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: '获取订单详情失败', error: error.message });
  }
});

router.post('/', auth, orderValidation, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, remark, useCart = false } = req.body;

    let orderItems = [];
    let totalAmount = 0;

    if (useCart) {
      const cart = await Cart.findOne({ user: req.user._id })
        .populate('items.product');
      
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: '购物车为空' });
      }

      const selectedItems = cart.items.filter(item => item.selected);
      if (selectedItems.length === 0) {
        return res.status(400).json({ message: '请选择要购买的商品' });
      }

      for (const item of selectedItems) {
        if (item.product.stock < item.quantity) {
          return res.status(400).json({
            message: `${item.product.name} 库存不足`
          });
        }

        orderItems.push({
          product: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image
        });

        totalAmount += item.product.price * item.quantity;

        item.product.stock -= item.quantity;
        item.product.sales += item.quantity;
        await item.product.save();
      }

      cart.items = cart.items.filter(item => !item.selected);
      await cart.save();
    } else {
      for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({ message: '商品不存在' });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `${product.name} 库存不足`
          });
        }

        orderItems.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          image: product.image
        });

        totalAmount += product.price * item.quantity;

        product.stock -= item.quantity;
        product.sales += item.quantity;
        await product.save();
      }
    }

    const shippingFee = totalAmount >= 99 ? 0 : 10;
    const discount = req.user.isVip ? totalAmount * 0.05 : 0;
    const finalAmount = totalAmount + shippingFee - discount;

    const order = new Order({
      user: req.user._id,
      orderNo: generateOrderNo(),
      items: orderItems,
      totalAmount,
      shippingFee,
      discount,
      finalAmount,
      shippingAddress,
      paymentMethod,
      remark
    });

    await order.save();

    res.status(201).json({
      message: '订单创建成功',
      order: await Order.findById(order._id).populate('items.product', 'name image')
    });
  } catch (error) {
    res.status(500).json({ message: '创建订单失败', error: error.message });
  }
});

router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: '只能取消待付款订单' });
    }

    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        product.sales -= item.quantity;
        await product.save();
      }
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ message: '订单已取消', order });
  } catch (error) {
    res.status(500).json({ message: '取消订单失败', error: error.message });
  }
});

router.put('/:id/pay', auth, async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: '订单状态错误' });
    }

    order.status = 'paid';
    order.paymentMethod = paymentMethod || order.paymentMethod;
    await order.save();

    res.json({ message: '支付成功', order });
  } catch (error) {
    res.status(500).json({ message: '支付失败', error: error.message });
  }
});

router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('user', 'username email phone')
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: '获取订单失败', error: error.message });
  }
});

router.put('/admin/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }

    order.status = status;
    await order.save();

    res.json({ message: '订单状态已更新', order });
  } catch (error) {
    res.status(500).json({ message: '更新失败', error: error.message });
  }
});

module.exports = router;
