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
  category: {
    type: String,
    required: true,
    enum: ['vegetables', 'fruits', 'grains', 'eggs', 'honey', 'other']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    default: '500g'
  },
  stock: {
    type: Number,
    default: 100,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  images: [String],
  description: {
    type: String,
    default: ''
  },
  origin: {
    type: String,
    default: '绿源有机农场'
  },
  certification: {
    type: String,
    default: '中国有机认证'
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5
  },
  sales: {
    type: Number,
    default: 0
  },
  isOnSale: {
    type: Boolean,
    default: true
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
