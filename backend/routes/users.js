const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    获取用户资料
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: '获取资料失败', error: error.message });
  }
});

// @route   PUT /api/users/profile
// @desc    更新用户资料
// @access  Private
router.put('/profile', protect, [
  body('username').optional().trim().isLength({ min: 3, max: 20 }),
  body('phone').optional().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { username, phone, avatar } = req.body;
    
    const updateData = {};
    if (username) updateData.username = username;
    if (phone) updateData.phone = phone;
    if (avatar) updateData.avatar = avatar;
    updateData.updatedAt = Date.now();
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-password');
    
    res.json({ success: true, message: '资料更新成功', user });
  } catch (error) {
    res.status(500).json({ message: '更新失败', error: error.message });
  }
});

// @route   PUT /api/users/address
// @desc    更新收货地址
// @access  Private
router.put('/address', protect, async (req, res) => {
  try {
    const { province, city, district, detail, zipCode } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        address: { province, city, district, detail, zipCode },
        updatedAt: Date.now()
      },
      { new: true }
    ).select('-password');
    
    res.json({ success: true, message: '地址更新成功', address: user.address });
  } catch (error) {
    res.status(500).json({ message: '地址更新失败', error: error.message });
  }
});

// @route   POST /api/users/favorites/:productId
// @desc    添加收藏
// @access  Private
router.post('/favorites/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user.favorites.includes(req.params.productId)) {
      return res.status(400).json({ message: '商品已在收藏夹中' });
    }
    
    user.favorites.push(req.params.productId);
    await user.save();
    
    res.json({ success: true, message: '收藏成功' });
  } catch (error) {
    res.status(500).json({ message: '收藏失败', error: error.message });
  }
});

// @route   DELETE /api/users/favorites/:productId
// @desc    取消收藏
// @access  Private
router.delete('/favorites/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    user.favorites = user.favorites.filter(
      id => id.toString() !== req.params.productId
    );
    await user.save();
    
    res.json({ success: true, message: '取消收藏成功' });
  } catch (error) {
    res.status(500).json({ message: '取消收藏失败', error: error.message });
  }
});

// @route   GET /api/users/favorites
// @desc    获取收藏列表
// @access  Private
router.get('/favorites', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites', 'name nameEn price originalPrice images rating');
    
    res.json({ success: true, favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: '获取收藏失败', error: error.message });
  }
});

module.exports = router;
