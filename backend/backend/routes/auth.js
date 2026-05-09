const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../middleware/validation');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

router.post('/register', registerValidation, async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email ? '该邮箱已被注册' : '该用户名已被使用'
      });
    }

    const user = new User({
      username,
      email,
      password,
      phone
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: '注册成功',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        isVip: user.isVip
      }
    });
  } catch (error) {
    res.status(500).json({ message: '注册失败', error: error.message });
  }
});

router.post('/login', loginValidation, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    const token = generateToken(user._id);

    res.json({
      message: '登录成功',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        isVip: user.isVip,
        vipExpireDate: user.vipExpireDate,
        address: user.address
      }
    });
  } catch (error) {
    res.status(500).json({ message: '登录失败', error: error.message });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        phone: req.user.phone,
        avatar: req.user.avatar,
        role: req.user.role,
        isVip: req.user.isVip,
        vipExpireDate: req.user.vipExpireDate,
        address: req.user.address
      }
    });
  } catch (error) {
    res.status(500).json({ message: '获取用户信息失败', error: error.message });
  }
});

router.put('/profile', auth, async (req, res) => {
  try {
    const { username, phone, avatar, address } = req.body;
    
    const updateData = {};
    if (username) updateData.username = username;
    if (phone) updateData.phone = phone;
    if (avatar) updateData.avatar = avatar;
    if (address) updateData.address = address;
    updateData.updatedAt = Date.now();

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-password');

    res.json({
      message: '个人信息更新成功',
      user
    });
  } catch (error) {
    res.status(500).json({ message: '更新失败', error: error.message });
  }
});

router.put('/password', auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(oldPassword);
    
    if (!isMatch) {
      return res.status(400).json({ message: '原密码错误' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: '密码修改成功' });
  } catch (error) {
    res.status(500).json({ message: '密码修改失败', error: error.message });
  }
});

module.exports = router;
