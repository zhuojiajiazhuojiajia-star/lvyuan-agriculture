const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL;

const products = [
  {
    name: '有机西红柿',
    nameEn: 'Organic Tomatoes',
    category: 'vegetables',
    price: 12.8,
    unit: '500g',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
    description: '新鲜采摘的有机西红柿，自然成熟，口感酸甜',
    descriptionEn: 'Fresh organic tomatoes, naturally ripened, sweet and sour taste',
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
    descriptionEn: 'Crisp and refreshing organic cucumbers, green and healthy',
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
    descriptionEn: 'Red Fuji organic apples, crisp, sweet and juicy',
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
    descriptionEn: 'Northeast Wuchang organic rice, fragrant and delicious',
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
    descriptionEn: 'Free-range organic eggs, rich in nutrition',
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

async function initData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('数据库连接成功');

    // 检查是否已有数据
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      console.log('数据库已有数据，跳过初始化');
      process.exit(0);
    }

    // 创建管理员用户
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      name: '管理员',
      email: 'admin@lvyuan.com',
      password: hashedPassword,
      role: 'admin'
    });
    await admin.save();
    console.log('管理员用户创建成功');

    // 创建测试用户
    const testPassword = await bcrypt.hash('test123', 10);
    const testUser = new User({
      name: '测试用户',
      email: 'test@example.com',
      password: testPassword,
      role: 'user'
    });
    await testUser.save();
    console.log('测试用户创建成功');

    // 创建商品
    await Product.insertMany(products);
    console.log(`${products.length} 个商品创建成功`);

    console.log('数据初始化完成！');
    process.exit(0);
  } catch (error) {
    console.error('初始化失败:', error.message);
    process.exit(1);
  }
}

initData();
