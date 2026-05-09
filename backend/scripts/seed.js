const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

// 示例商品数据
const productsData = [
  {
    name: '有机西红柿',
    nameEn: 'Organic Tomato',
    description: '自然成熟，沙瓤多汁，酸甜可口',
    descriptionEn: 'Naturally ripened, juicy and sweet-sour',
    price: 12.8,
    originalPrice: 16.0,
    category: 'vegetable',
    images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80'],
    stock: 100,
    tags: ['有机认证', '当季新鲜'],
    origin: '山东寿光',
    isOrganic: true
  },
  {
    name: '有机黄瓜',
    nameEn: 'Organic Cucumber',
    description: '清脆爽口，水分充足',
    descriptionEn: 'Crisp and refreshing, full of moisture',
    price: 8.9,
    originalPrice: 12.0,
    category: 'vegetable',
    images: ['https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&q=80'],
    stock: 150,
    tags: ['有机认证', '新鲜采摘'],
    origin: '河北廊坊',
    isOrganic: true
  },
  {
    name: '有机胡萝卜',
    nameEn: 'Organic Carrot',
    description: '色泽鲜艳，营养丰富',
    descriptionEn: 'Bright color, rich in nutrition',
    price: 6.5,
    originalPrice: 9.0,
    category: 'vegetable',
    images: ['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80'],
    stock: 200,
    tags: ['有机认证', '富含胡萝卜素'],
    origin: '内蒙古',
    isOrganic: true
  },
  {
    name: '有机苹果',
    nameEn: 'Organic Apple',
    description: '红富士品种，脆甜多汁',
    descriptionEn: 'Red Fuji variety, crisp and juicy',
    price: 18.9,
    originalPrice: 25.0,
    category: 'fruit',
    images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80'],
    stock: 80,
    tags: ['有机认证', '产地直发'],
    origin: '山东烟台',
    isOrganic: true
  },
  {
    name: '有机草莓',
    nameEn: 'Organic Strawberry',
    description: '香甜可口，色泽红润',
    descriptionEn: 'Sweet and delicious, bright red color',
    price: 35.0,
    originalPrice: 45.0,
    category: 'fruit',
    images: ['https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80'],
    stock: 50,
    tags: ['有机认证', '温室种植'],
    origin: '辽宁丹东',
    isOrganic: true
  },
  {
    name: '有机大米',
    nameEn: 'Organic Rice',
    description: '东北五常大米，粒粒饱满',
    descriptionEn: 'Northeast Wuchang rice, plump grains',
    price: 28.0,
    originalPrice: 35.0,
    category: 'grain',
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80'],
    stock: 300,
    tags: ['有机认证', '新米上市'],
    origin: '黑龙江五常',
    isOrganic: true
  },
  {
    name: '有机鸡蛋',
    nameEn: 'Organic Eggs',
    description: '散养土鸡，蛋黄饱满',
    descriptionEn: 'Free-range hens, rich golden yolks',
    price: 29.9,
    originalPrice: 38.0,
    category: 'dairy',
    images: ['https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400&q=80'],
    stock: 100,
    tags: ['有机认证', '新鲜直供'],
    origin: '北京郊区',
    isOrganic: true
  }
];

async function seedDatabase() {
  try {
    // 连接数据库
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lvyuan_farm');
    console.log('✅ 数据库连接成功');
    
    // 清空现有商品数据
    await Product.deleteMany({});
    console.log('🗑️  已清空现有商品数据');
    
    // 插入新数据
    await Product.insertMany(productsData);
    console.log(`✅ 成功插入 ${productsData.length} 个商品`);
    
    console.log('\n🎉 数据初始化完成！');
    process.exit(0);
  } catch (error) {
    console.error('❌ 数据初始化失败:', error);
    process.exit(1);
  }
}

seedDatabase();
