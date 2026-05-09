const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  image: {
    type: String
  }
});

const orderSchema = new mongoose.Schema({
  orderNo: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  shippingFee: {
    type: Number,
    default: 0
  },
  finalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['待付款', '已付款', '已发货', '已送达', '已完成', '已取消'],
    default: '待付款'
  },
  paymentMethod: {
    type: String,
    enum: ['微信支付', '支付宝', '银行卡'],
    default: '微信支付'
  },
  shippingAddress: {
    name: String,
    phone: String,
    province: String,
    city: String,
    district: String,
    detail: String
  },
  remark: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  paidAt: {
    type: Date
  },
  shippedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  }
});

// 生成订单号
orderSchema.pre('save', async function(next) {
  if (!this.orderNo) {
    const date = new Date();
    const prefix = 'LY' + date.getFullYear() + String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    this.orderNo = prefix + random;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
