const express = require('express');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// 订阅价格配置
const SUBSCRIPTION_PRICES = {
  '月度订阅': 299,
  '季度订阅': 799,
  '年度订阅': 2699
};

// @route   GET /api/subscriptions
// @desc    获取用户订阅信息
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ 
      user: req.user._id,
      status: { $in: ['active', 'paused'] }
    });
    
    if (!subscription) {
      return res.json({ 
        success: true, 
        hasSubscription: false,
        message: '暂无有效订阅'
      });
    }
    
    res.json({
      success: true,
      hasSubscription: true,
      subscription
    });
  } catch (error) {
    res.status(500).json({ message: '获取订阅信息失败', error: error.message });
  }
});

// @route   POST /api/subscriptions
// @desc    创建订阅
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { type, deliveryDay, preferences, familySize, deliveryAddress } = req.body;
    
    // 检查是否已有有效订阅
    const existingSub = await Subscription.findOne({
      user: req.user._id,
      status: { $in: ['active', 'paused'] }
    });
    
    if (existingSub) {
      return res.status(400).json({ message: '您已有有效订阅，请先取消后再创建新订阅' });
    }
    
    // 计算订阅期限
    const startDate = new Date();
    const endDate = new Date();
    
    switch (type) {
      case '月度订阅':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case '季度订阅':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case '年度订阅':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      default:
        return res.status(400).json({ message: '无效的订阅类型' });
    }
    
    const subscription = await Subscription.create({
      user: req.user._id,
      type,
      startDate,
      endDate,
      price: SUBSCRIPTION_PRICES[type],
      deliveryDay: deliveryDay || 1,
      preferences,
      familySize: familySize || 2,
      deliveryAddress
    });
    
    // 计算下次配送日期
    subscription.calculateNextDelivery();
    await subscription.save();
    
    // 更新用户订阅状态
    await User.findByIdAndUpdate(req.user._id, {
      isSubscribed: true,
      subscriptionType: type,
      subscriptionExpiry: endDate
    });
    
    res.status(201).json({
      success: true,
      message: '订阅创建成功',
      subscription
    });
  } catch (error) {
    res.status(500).json({ message: '创建订阅失败', error: error.message });
  }
});

// @route   PUT /api/subscriptions
// @desc    修改订阅设置
// @access  Private
router.put('/', protect, async (req, res) => {
  try {
    const { deliveryDay, preferences, familySize, deliveryAddress } = req.body;
    
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: { $in: ['active', 'paused'] }
    });
    
    if (!subscription) {
      return res.status(404).json({ message: '没有找到有效订阅' });
    }
    
    if (deliveryDay) subscription.deliveryDay = deliveryDay;
    if (preferences) subscription.preferences = preferences;
    if (familySize) subscription.familySize = familySize;
    if (deliveryAddress) subscription.deliveryAddress = deliveryAddress;
    
    subscription.updatedAt = Date.now();
    await subscription.save();
    
    res.json({
      success: true,
      message: '订阅设置已更新',
      subscription
    });
  } catch (error) {
    res.status(500).json({ message: '更新失败', error: error.message });
  }
});

// @route   PUT /api/subscriptions/pause
// @desc    暂停订阅
// @access  Private
router.put('/pause', protect, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: 'active'
    });
    
    if (!subscription) {
      return res.status(404).json({ message: '没有找到有效订阅' });
    }
    
    subscription.status = 'paused';
    await subscription.save();
    
    res.json({ success: true, message: '订阅已暂停', subscription });
  } catch (error) {
    res.status(500).json({ message: '暂停失败', error: error.message });
  }
});

// @route   PUT /api/subscriptions/resume
// @desc    恢复订阅
// @access  Private
router.put('/resume', protect, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: 'paused'
    });
    
    if (!subscription) {
      return res.status(404).json({ message: '没有找到暂停的订阅' });
    }
    
    subscription.status = 'active';
    subscription.calculateNextDelivery();
    await subscription.save();
    
    res.json({ success: true, message: '订阅已恢复', subscription });
  } catch (error) {
    res.status(500).json({ message: '恢复失败', error: error.message });
  }
});

// @route   DELETE /api/subscriptions
// @desc    取消订阅
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: { $in: ['active', 'paused'] }
    });
    
    if (!subscription) {
      return res.status(404).json({ message: '没有找到有效订阅' });
    }
    
    subscription.status = 'cancelled';
    await subscription.save();
    
    // 更新用户订阅状态
    await User.findByIdAndUpdate(req.user._id, {
      isSubscribed: false,
      subscriptionType: '',
      subscriptionExpiry: null
    });
    
    res.json({ success: true, message: '订阅已取消' });
  } catch (error) {
    res.status(500).json({ message: '取消失败', error: error.message });
  }
});

// @route   GET /api/subscriptions/plans
// @desc    获取订阅方案
// @access  Public
router.get('/plans', (req, res) => {
  const plans = [
    {
      type: '月度订阅',
      price: 299,
      originalPrice: 360,
      period: '每月',
      deliveries: 4,
      features: ['每周新鲜配送', '有机蔬菜+水果', '免费配送', '会员专属折扣']
    },
    {
      type: '季度订阅',
      price: 799,
      originalPrice: 1080,
      period: '每季度',
      deliveries: 12,
      features: ['每周新鲜配送', '有机蔬菜+水果', '免费配送', '会员专属折扣', '赠送有机杂粮']
    },
    {
      type: '年度订阅',
      price: 2699,
      originalPrice: 4320,
      period: '每年',
      deliveries: 48,
      features: ['每周新鲜配送', '有机蔬菜+水果', '免费配送', '会员专属折扣', '赠送有机杂粮', '专属客服', '优先配送']
    }
  ];
  
  res.json({ success: true, plans });
});

module.exports = router;
