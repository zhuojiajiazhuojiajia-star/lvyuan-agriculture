const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const planPrices = {
  monthly: { amount: 299, name: '月度会员' },
  quarterly: { amount: 799, name: '季度会员' },
  yearly: { amount: 2699, name: '年度会员' }
};

router.get('/', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: { $in: ['active', 'paused'] }
    });

    if (!subscription) {
      return res.json({ subscription: null });
    }

    res.json({ subscription });
  } catch (error) {
    res.status(500).json({ message: '获取订阅信息失败', error: error.message });
  }
});

router.get('/plans', async (req, res) => {
  try {
    const plans = [
      {
        id: 'monthly',
        name: '月度会员',
        price: 299,
        unit: '月',
        description: '适合初次体验',
        features: [
          '每月4次配送',
          '全场商品9.5折',
          '免运费',
          '专属客服',
          '优先发货'
        ]
      },
      {
        id: 'quarterly',
        name: '季度会员',
        price: 799,
        unit: '季',
        originalPrice: 897,
        description: '最受欢迎',
        popular: true,
        features: [
          '每月4次配送',
          '全场商品9折',
          '免运费',
          '专属客服',
          '优先发货',
          '赠送有机鸡蛋一盒'
        ]
      },
      {
        id: 'yearly',
        name: '年度会员',
        price: 2699,
        unit: '年',
        originalPrice: 3588,
        description: '最划算',
        features: [
          '每月4次配送',
          '全场商品8.5折',
          '免运费',
          '专属客服',
          '优先发货',
          '赠送有机鸡蛋两盒',
          '专属农场参观机会'
        ]
      }
    ];

    res.json({ plans });
  } catch (error) {
    res.status(500).json({ message: '获取套餐信息失败', error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { plan, deliveryDay, preferences } = req.body;

    if (!planPrices[plan]) {
      return res.status(400).json({ message: '无效的套餐类型' });
    }

    const existingSubscription = await Subscription.findOne({
      user: req.user._id,
      status: { $in: ['active', 'paused'] }
    });

    if (existingSubscription) {
      return res.status(400).json({ message: '您已有有效订阅' });
    }

    const startDate = new Date();
    const endDate = new Date();
    
    switch (plan) {
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'quarterly':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case 'yearly':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }

    const subscription = new Subscription({
      user: req.user._id,
      plan,
      startDate,
      endDate,
      deliveryDay: deliveryDay || 1,
      preferences: preferences || {},
      amount: planPrices[plan].amount
    });

    await subscription.save();

    await User.findByIdAndUpdate(req.user._id, {
      isVip: true,
      vipExpireDate: endDate
    });

    res.status(201).json({
      message: '订阅成功',
      subscription
    });
  } catch (error) {
    res.status(500).json({ message: '订阅失败', error: error.message });
  }
});

router.put('/pause', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: 'active'
    });

    if (!subscription) {
      return res.status(404).json({ message: '没有有效的订阅' });
    }

    subscription.status = 'paused';
    await subscription.save();

    res.json({ message: '订阅已暂停', subscription });
  } catch (error) {
    res.status(500).json({ message: '操作失败', error: error.message });
  }
});

router.put('/resume', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: 'paused'
    });

    if (!subscription) {
      return res.status(404).json({ message: '没有暂停的订阅' });
    }

    subscription.status = 'active';
    await subscription.save();

    res.json({ message: '订阅已恢复', subscription });
  } catch (error) {
    res.status(500).json({ message: '操作失败', error: error.message });
  }
});

router.put('/preferences', auth, async (req, res) => {
  try {
    const { categories, excludeItems, familySize } = req.body;

    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: { $in: ['active', 'paused'] }
    });

    if (!subscription) {
      return res.status(404).json({ message: '没有有效的订阅' });
    }

    if (categories) subscription.preferences.categories = categories;
    if (excludeItems) subscription.preferences.excludeItems = excludeItems;
    if (familySize) subscription.preferences.familySize = familySize;

    await subscription.save();

    res.json({ message: '偏好设置已更新', subscription });
  } catch (error) {
    res.status(500).json({ message: '更新失败', error: error.message });
  }
});

router.put('/delivery-day', auth, async (req, res) => {
  try {
    const { deliveryDay } = req.body;

    if (deliveryDay < 1 || deliveryDay > 28) {
      return res.status(400).json({ message: '配送日期必须在1-28之间' });
    }

    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: { $in: ['active', 'paused'] }
    });

    if (!subscription) {
      return res.status(404).json({ message: '没有有效的订阅' });
    }

    subscription.deliveryDay = deliveryDay;
    await subscription.save();

    res.json({ message: '配送日期已更新', subscription });
  } catch (error) {
    res.status(500).json({ message: '更新失败', error: error.message });
  }
});

router.delete('/', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: { $in: ['active', 'paused'] }
    });

    if (!subscription) {
      return res.status(404).json({ message: '没有有效的订阅' });
    }

    subscription.status = 'cancelled';
    await subscription.save();

    await User.findByIdAndUpdate(req.user._id, {
      isVip: false,
      vipExpireDate: null
    });

    res.json({ message: '订阅已取消' });
  } catch (error) {
    res.status(500).json({ message: '取消失败', error: error.message });
  }
});

router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const subscriptions = await Subscription.find(query)
      .populate('user', 'username email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Subscription.countDocuments(query);

    res.json({
      subscriptions,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: '获取订阅列表失败', error: error.message });
  }
});

module.exports = router;
