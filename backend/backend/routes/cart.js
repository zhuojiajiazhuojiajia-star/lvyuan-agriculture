const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');
const { cartValidation } = require('../middleware/validation');

router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price image stock unit');
    
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }

    res.json({
      items: cart.items,
      totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      totalAmount: cart.items.reduce((sum, item) => {
        return item.selected ? sum + (item.product.price * item.quantity) : sum;
      }, 0)
    });
  } catch (error) {
    res.status(500).json({ message: '获取购物车失败', error: error.message });
  }
});

router.post('/add', auth, cartValidation, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: '商品不存在' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: '商品库存不足' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate('items.product', 'name price image stock unit');

    res.json({
      message: '商品已添加到购物车',
      cart: {
        items: cart.items,
        totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (error) {
    res.status(500).json({ message: '添加失败', error: error.message });
  }
});

router.put('/update/:productId', auth, async (req, res) => {
  try {
    const { quantity, selected } = req.body;
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: '购物车为空' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: '商品不在购物车中' });
    }

    if (quantity !== undefined) {
      if (quantity < 1) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
    }

    if (selected !== undefined) {
      cart.items[itemIndex].selected = selected;
    }

    await cart.save();
    await cart.populate('items.product', 'name price image stock unit');

    res.json({
      message: '购物车已更新',
      cart: {
        items: cart.items,
        totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: cart.items.reduce((sum, item) => {
          return item.selected ? sum + (item.product.price * item.quantity) : sum;
        }, 0)
      }
    });
  } catch (error) {
    res.status(500).json({ message: '更新失败', error: error.message });
  }
});

router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: '购物车为空' });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate('items.product', 'name price image stock unit');

    res.json({
      message: '商品已移除',
      cart: {
        items: cart.items,
        totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (error) {
    res.status(500).json({ message: '移除失败', error: error.message });
  }
});

router.delete('/clear', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({ message: '购物车已清空' });
  } catch (error) {
    res.status(500).json({ message: '清空失败', error: error.message });
  }
});

router.put('/select-all', auth, async (req, res) => {
  try {
    const { selected } = req.body;
    
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: '购物车为空' });
    }

    cart.items.forEach(item => {
      item.selected = selected;
    });

    await cart.save();
    await cart.populate('items.product', 'name price image stock unit');

    res.json({
      message: selected ? '已全选' : '已取消全选',
      cart: {
        items: cart.items,
        totalAmount: cart.items.reduce((sum, item) => {
          return item.selected ? sum + (item.product.price * item.quantity) : sum;
        }, 0)
      }
    });
  } catch (error) {
    res.status(500).json({ message: '操作失败', error: error.message });
  }
});

module.exports = router;
