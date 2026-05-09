const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  selected: {
    type: Boolean,
    default: true
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 计算购物车总价
cartSchema.methods.calculateTotal = function() {
  return this.items.reduce((total, item) => {
    return item.selected ? total + (item.product.price * item.quantity) : total;
  }, 0);
};

// 获取商品数量
cartSchema.methods.getItemCount = function() {
  return this.items.reduce((count, item) => count + item.quantity, 0);
};

module.exports = mongoose.model('Cart', cartSchema);
