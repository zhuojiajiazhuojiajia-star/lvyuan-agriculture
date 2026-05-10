const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// 数据库连接
mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/lvyuan_farm')
  .then(() => console.log('✅ MongoDB 连接成功'))
  .catch(err => console.error('❌ MongoDB 连接失败:', err));

// 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/subscriptions', require('./routes/subscriptions'));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '绿源农业API服务正常运行' });
});

// 数据初始化
app.get('/api/init-data', async (req, res) => {
  try {
    const User = require('./models/User');
    const Product = require('./models/Product');
    const bcrypt = require('bcryptjs');
    
    // 检查是否已有数据
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      return res.json({ success: true, message: '数据库已有数据，跳过初始化' });
    }
    
    // 创建管理员用户
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: '管理员',
      email: 'admin@lvyuan.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    // 创建测试用户
    const testPassword = await bcrypt.hash('test123', 10);
    await User.create({
      name: '测试用户',
      email: 'test@example.com',
      password: testPassword,
      role: 'user'
    });
    
    // 创建商品数据
    const products = [
      {
        name: '有机西红柿',
        nameEn: 'Organic Tomatoes',
        category: 'vegetables',
        price: 12.8,
        unit: '500g',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
        description: '新鲜采摘的有机西红柿，自然成熟，口感酸甜',
        descriptionEn: 'Fresh organic tomatoes, naturally ripened',
        stock: 100,
        sales: 50,
        rating: 4.8,
        reviewCount: 20
      },
      {
        name: '有机黄瓜',
        nameEn: 'Organic Cucumbers',
        category: 'vegetables',
        price: 8.5,
        unit: '500g',
        image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400',
        description: '清脆爽口的有机黄瓜，绿色健康',
        descriptionEn: 'Crisp and refreshing organic cucumbers',
        stock: 80,
        sales: 30,
        rating: 4.6,
        reviewCount: 15
      },
      {
        name: '有机苹果',
        nameEn: 'Organic Apples',
        category: 'fruits',
        price: 28.0,
        unit: '1kg',
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
        description: '红富士有机苹果，脆甜多汁',
        descriptionEn: 'Red Fuji organic apples, crisp and juicy',
        stock: 60,
        sales: 40,
        rating: 4.9,
        reviewCount: 25
      },
      {
        name: '有机大米',
        nameEn: 'Organic Rice',
        category: 'grains',
        price: 68.0,
        unit: '5kg',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
        description: '东北五常有机大米，香糯可口',
        descriptionEn: 'Northeast Wuchang organic rice',
        stock: 50,
        sales: 20,
        rating: 4.7,
        reviewCount: 10
      },
      {
        name: '有机鸡蛋',
        nameEn: 'Organic Eggs',
        category: 'dairy',
        price: 35.0,
        unit: '30枚',
        image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400',
        description: '散养土鸡有机鸡蛋，营养丰富',
        descriptionEn: 'Free-range organic eggs',
        stock: 40,
        sales: 15,
        rating: 4.8,
        reviewCount: 12
      },
      {
        name: '有机胡萝卜',
        nameEn: 'Organic Carrots',
        category: 'vegetables',
        price: 6.8,
        unit: '500g',
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
        description: '新鲜有机胡萝卜，甜脆可口',
        descriptionEn: 'Fresh organic carrots, sweet and crisp',
        stock: 90,
        sales: 35,
        rating: 4.5,
        reviewCount: 18
      }
    ];
    
    await Product.insertMany(products);
    
    res.json({ success: true, message: '数据初始化完成', products: products.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器内部错误', error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在端口 ${PORT}`);
  console.log(`📍 API地址: http://localhost:${PORT}/api`);
});
