const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: ''
  },
  address: {
    province: String,
    city: String,
    district: String,
    detail: String,
    zipCode: String
  },
  memberLevel: {
    type: String,
    enum: ['普通会员', '银卡会员', '金卡会员', '钻石会员'],
    default: '普通会员'
  },
  memberPoints: {
    type: Number,
    default: 0
  },
  isSubscribed: {
    type: Boolean,
    default: false
  },
  subscriptionType: {
    type: String,
    enum: ['', '月度订阅', '季度订阅', '年度订阅'],
    default: ''
  },
  subscriptionExpiry: {
    type: Date
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 密码加密
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 密码验证
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 更新积分和会员等级
userSchema.methods.updateMemberLevel = function() {
  if (this.memberPoints >= 10000) {
    this.memberLevel = '钻石会员';
  } else if (this.memberPoints >= 5000) {
    this.memberLevel = '金卡会员';
  } else if (this.memberPoints >= 1000) {
    this.memberLevel = '银卡会员';
  }
};

module.exports = mongoose.model('User', userSchema);
