const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['月度订阅', '季度订阅', '年度订阅'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'cancelled', 'expired'],
    default: 'active'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  deliveryDay: {
    type: Number, // 每周配送日 1-7
    default: 1
  },
  preferences: {
    vegetables: { type: Boolean, default: true },
    fruits: { type: Boolean, default: true },
    grains: { type: Boolean, default: false },
    dairy: { type: Boolean, default: false }
  },
  familySize: {
    type: Number,
    default: 2 // 人数，用于计算配送量
  },
  deliveryAddress: {
    name: String,
    phone: String,
    province: String,
    city: String,
    district: String,
    detail: String
  },
  nextDeliveryDate: {
    type: Date
  },
  totalDeliveries: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 计算下次配送日期
subscriptionSchema.methods.calculateNextDelivery = function() {
  const today = new Date();
  const nextDate = new Date(today);
  const currentDay = today.getDay() || 7;
  const daysUntilDelivery = this.deliveryDay - currentDay;
  
  if (daysUntilDelivery <= 0) {
    nextDate.setDate(today.getDate() + daysUntilDelivery + 7);
  } else {
    nextDate.setDate(today.getDate() + daysUntilDelivery);
  }
  
  this.nextDeliveryDate = nextDate;
};

module.exports = mongoose.model('Subscription', subscriptionSchema);
