const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const axios = require('axios');

const router = express.Router();

// 生成JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_key_here', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route   POST /api/auth/register
// @desc    用户注册
// @access  Public
router.post('/register', [
  body('username').trim().isLength({ min: 3, max: 20 }).withMessage('用户名3-20个字符'),
  body('email').isEmail().withMessage('请输入有效的邮箱'),
  body('password').isLength({ min: 6 }).withMessage('密码至少6个字符'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: '验证失败', errors: errors.array() });
    }
    
    const { username, email, password, phone } = req.body;
    
    // 检查用户是否已存在
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: '用户名或邮箱已存在' });
    }
    
    // 创建用户
    const user = await User.create({
      username,
      email,
      password,
      phone
    });
    
    // 生成token
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      message: '注册成功',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        memberLevel: user.memberLevel,
        memberPoints: user.memberPoints
      }
    });
  } catch (error) {
    res.status(500).json({ message: '注册失败', error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    用户登录
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: '请输入用户名和密码' });
    }
    
    // 查找用户
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });
    
    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    
    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    
    // 生成token
    const token = generateToken(user._id);
    
    res.json({
      success: true,
      message: '登录成功',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        memberLevel: user.memberLevel,
        memberPoints: user.memberPoints,
        isSubscribed: user.isSubscribed,
        subscriptionType: user.subscriptionType
      }
    });
  } catch (error) {
    res.status(500).json({ message: '登录失败', error: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    获取当前用户信息
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('favorites', 'name price images');
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ message: '获取用户信息失败', error: error.message });
  }
});

// @route   PUT /api/auth/password
// @desc    修改密码
// @access  Private
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id);
    
    // 验证当前密码
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: '当前密码错误' });
    }
    
    // 更新密码
    user.password = newPassword;
    await user.save();
    
    res.json({ success: true, message: '密码修改成功' });
  } catch (error) {
    res.status(500).json({ message: '密码修改失败', error: error.message });
  }
});

// @route   GET /api/auth/github
// @desc    GitHub 登录 - 跳转到 GitHub 授权页面
// @access  Public
router.get('/github', (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const frontendUrl = process.env.FRONTEND_URL || 'https://effulgent-pie-2853b3.netlify.app';
  const redirectUri = encodeURIComponent(process.env.GITHUB_CALLBACK_URL || 'https://lvyuan-backend-production-4f2d.up.railway.app/api/auth/github/callback');
  const scope = 'read:user user:email';
  
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  res.redirect(githubAuthUrl);
});

// @route   GET /api/auth/github/callback
// @desc    GitHub 登录回调
// @access  Public
router.get('/github/callback', async (req, res) => {
  const { code } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || 'https://effulgent-pie-2853b3.netlify.app';
  
  try {
    // 用 code 换取 access_token
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    }, {
      headers: { Accept: 'application/json' }
    });
    
    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      return res.redirect(`${frontendUrl}/login?error=github_auth_failed`);
    }
    
    // 获取 GitHub 用户信息
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    const githubUser = userResponse.data;
    
    // 获取邮箱
    const emailResponse = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const primaryEmail = emailResponse.data.find(e => e.primary)?.email || githubUser.email || `${githubUser.id}@github.com`;
    
    // 查找或创建用户
    let user = await User.findOne({ githubId: githubUser.id });
    
    if (!user) {
      // 检查邮箱是否已注册
      user = await User.findOne({ email: primaryEmail });
      if (user) {
        // 关联 GitHub 账号
        user.githubId = githubUser.id;
        user.avatar = user.avatar || githubUser.avatar_url;
        await user.save();
      } else {
        // 创建新用户
        user = await User.create({
          name: githubUser.name || githubUser.login,
          username: githubUser.login,
          email: primaryEmail,
          password: 'github_' + githubUser.id + '_oauth',
          avatar: githubUser.avatar_url,
          githubId: githubUser.id
        });
      }
    }
    
    // 生成 JWT
    const token = generateToken(user._id);
    
    // 重定向到前端，带上 token
    res.redirect(`${frontendUrl}/login?token=${token}&github=true`);
  } catch (error) {
    console.error('GitHub 登录失败:', error.message);
    res.redirect(`${frontendUrl}/login?error=github_login_failed`);
  }
});

module.exports = router;
