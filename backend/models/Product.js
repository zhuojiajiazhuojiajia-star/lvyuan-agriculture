const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  nameEn: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  descriptionEn: {
    type: String
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['vegetable', 'fruit', 'grain', 'dairy', 'meat', 'other']
  },
  images: [{
    type: String
  }],
  stock: {
    type: Number,
    default: 100,
    min: 0
  },
  sales: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 5,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String
  }],
  isOrganic: {
    type: Boolean,
    default: true
  },
  origin: {
    type: String
  },
  specifications: [{
    key: String,
    value: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 索引
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

module.exports = mongoose.model('Product', productSchema);
