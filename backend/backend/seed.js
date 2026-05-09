const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');

const productsData = [
  {
    name: '有机西红柿',
    nameEn: 'Organic Tomato',
    category: 'vegetables',
    price: 12.9,
    unit: '500g',
    stock: 100,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80',
      'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80'
    ],
    description: '自然成熟，酸甜可口，富含维生素C',
    origin: '绿源有机农场',
    certification: '中国有机认证',
    tags: ['热销', '时令']
  },
  {
    name: '有机胡萝卜',
    nameEn: 'Organic Carrot',
    category: 'vegetables',
    price: 8.9,
    unit: '500g',
    stock: 150,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80',
      'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=400&q=80'
    ],
    description: '脆甜多汁，营养丰富',
    origin: '绿源有机农场',
    certification: '中国有机认证',
    tags: ['营养']
  },
  {
    name: '有机黄瓜',
    nameEn: 'Organic Cucumber',
    category: 'vegetables',
    price: 9.9,
    unit: '500g',
    stock: 120,
    image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&q=80',
      'https://images.unsplash.com/photo-1604977046803-36ae5d978e9c?w=400&q=80'
    ],
    description: '清脆爽口，补水佳品',
    origin: '绿源有机农场',
    certification: '中国有机认证',
    tags: ['清爽']
  },
  {
    name: '有机菠菜',
    nameEn: 'Organic Spinach',
    category: 'vegetables',
    price: 11.9,
    unit: '300g',
    stock: 80,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80'
    ],
    description: '绿叶蔬菜之王，富含铁质',
    origin: '绿源有机农场',
    certification: '中国有机认证',
    tags: ['营养']
  },
  {
    name: '有机西兰花',
    nameEn: 'Organic Broccoli',
    category: 'vegetables',
    price: 15.9,
    unit: '300g',
    stock: 90,
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80',
      'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400&q=80'
    ],
    description: '抗癌蔬菜，营养丰富',
    origin: '绿源有机农场',
    certification: '中国有机认证',
    tags: ['健康']
  },
  {
    name: '有机茄子',
    nameEn: 'Organic Eggplant',
    category: 'vegetables',
    price: 10.9,
    unit: '500g',
    stock: 100,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80',
      'https://images.unsplash.com/photo-1605197378520-99aa61e4b1b2?w=400&q=80'
    ],
    description: '肉质细嫩，口感绵软',
    origin: '绿源有机农场',
    certification: '中国有机认证',
    tags: ['家常']
  },
  {
    name: '有机土豆',
    nameEn: 'Organic Potato',
    category: 'vegetables',
    price: 7.9,
    unit: '1kg',
    stock: 200,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82ber40f?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1518977676601-b53f82ber40f?w=400&q=80',
      'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=400&q=80'
    ],
    description: '淀粉含量高，口感粉糯',
    origin: '绿源有机农场',
    certification: '中国有机认证',
    tags: ['主食']
  },
  {
    name: '有机青椒',
    nameEn: 'Organic Green Pepper',
    category: 'vegetables',
    price: 9.9,
    unit: '300g',
    stock: 110,
    image: 'https://images.unsplash.com/photo-1563565375-f3fdf5d66970?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1563565375-f3fdf5d66970?w=400&q=80',
      'https://images.unsplash.com/photo-1601648767798-9433b4c497ac?w=400&q=80'
    ],
    description: '微辣爽口，维生素丰富',
    origin: '绿源有机农场',
    certification: '中国有机认证',
    tags: ['调味']
  },
  {
    name: '有机苹果',
    nameEn: 'Organic Apple',
    category: 'fruits',
    price: 19.9,
    unit: '500g',
    stock: 150,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80',
      'https://images.unsplash.com/photo-1584306670957-acf935f5033c?w=400&q=80'
    ],
    description: '脆甜多汁，果香浓郁',
    origin: '绿源有机果园',
    certification: '中国有机认证',
    tags: ['热销', '时令']
  },
  {
    name: '有机香蕉',
    nameEn: 'Organic Banana',
    category: 'fruits',
    price: 15.9,
    unit: '500g',
    stock: 120,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80',
      'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&q=80'
    ],
    description: '软糯香甜，富含钾元素',
    origin: '绿源有机果园',
    certification: '中国有机认证',
    tags: ['能量']
  },
  {
    name: '有机橙子',
    nameEn: 'Organic Orange',
    category: 'fruits',
    price: 18.9,
    unit: '500g',
    stock: 100,
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&q=80',
      'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&q=80'
    ],
    description: '维C之王，酸甜可口',
    origin: '绿源有机果园',
    certification: '中国有机认证',
    tags: ['维C']
  },
  {
    name: '有机葡萄',
    nameEn: 'Organic Grape',
    category: 'fruits',
    price: 29.9,
    unit: '500g',
    stock: 80,
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&q=80',
      'https://images.unsplash.com/photo-1596363505729-4190a9506133?w=400&q=80'
    ],
    description: '粒粒饱满，甜而不腻',
    origin: '绿源有机果园',
    certification: '中国有机认证',
    tags: ['精品']
  },
  {
    name: '有机草莓',
    nameEn: 'Organic Strawberry',
    category: 'fruits',
    price: 35.9,
    unit: '300g',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80',
      'https://images.unsplash.com/photo-1587393855524-087f83d95bc9?w=400&q=80'
    ],
    description: '鲜红诱人，香甜可口',
    origin: '绿源有机果园',
    certification: '中国有机认证',
    tags: ['人气', '限量']
  },
  {
    name: '有机西瓜',
    nameEn: 'Organic Watermelon',
    category: 'fruits',
    price: 39.9,
    unit: '个(约4kg)',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80',
      'https://images.unsplash.com/photo-1563114923-6bab240d81b9?w=400&q=80'
    ],
    description: '汁多味甜，消暑解渴',
    origin: '绿源有机果园',
    certification: '中国有机认证',
    tags: ['夏季限定']
  },
  {
    name: '有机彩椒',
    nameEn: 'Organic Bell Pepper',
    category: 'vegetables',
    price: 16.9,
    unit: '300g',
    stock: 90,
    image: 'https://images.unsplash.com/photo-1563565375-f3fdf5d66970?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1563565375-f3fdf5d66970?w=400&q=80',
      'https://images.unsplash.com/photo-1601648767798-9433b4c497ac?w=400&q=80'
    ],
    description: '色彩缤纷，营养丰富',
    origin: '绿源有机农场',
    certification: '中国有机认证',
    tags: ['颜值']
  },
  {
    name: '有机红薯',
    nameEn: 'Organic Sweet Potato',
    category: 'vegetables',
    price: 12.9,
    unit: '1kg',
    stock: 180,
    image: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=400&q=80',
      'https://images.unsplash.com/photo-1604495776662-1ceef4348f42?w=400&q=80'
    ],
    description: '香甜软糯，膳食纤维丰富',
    origin: '绿源有机农场',
    certification: '中国有机认证',
    tags: ['健康']
  },
  {
    name: '有机猕猴桃',
    nameEn: 'Organic Kiwi',
    category: 'fruits',
    price: 25.9,
    unit: '500g',
    stock: 100,
    image: 'https://images.unsplash.com/photo-1616684000067-36952fde56ec?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1616684000067-36952fde56ec?w=400&q=80',
      'https://images.unsplash.com/photo-1587393855524-087f83d95bc9?w=400&q=80',
      'https://images.unsplash.com/photo-1606757389667-45c2024f9fa4?w=400&q=80'
    ],
    description: '维C含量超高，酸甜适中',
    origin: '绿源有机果园',
    certification: '中国有机认证',
    tags: ['维C', '进口品种']
  },
  {
    name: '有机樱桃',
    nameEn: 'Organic Cherry',
    category: 'fruits',
    price: 68.9,
    unit: '500g',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=400&q=80',
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80',
      'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&q=80'
    ],
    description: '颗颗饱满，甜脆多汁',
    origin: '绿源有机果园',
    certification: '中国有机认证',
    tags: ['精品', '限量']
  },
  {
    name: '有机小米',
    nameEn: 'Organic Millet',
    category: 'grains',
    price: 22.9,
    unit: '1kg',
    stock: 150,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
      'https://images.unsplash.com/photo-1627735483792-233bf632619b?w=400&q=80',
      'https://images.unsplash.com/photo-1502747220144-846486e80891?w=400&q=80'
    ],
    description: '金黄饱满，养胃佳品',
    origin: '绿源有机农场',
    certification: '中国有机认证',
    tags: ['养生']
  },
  {
    name: '有机黄豆',
    nameEn: 'Organic Soybeans',
    category: 'grains',
    price: 18.9,
    unit: '1kg',
    stock: 200,
    image: 'https://images.unsplash.com/photo-1627735483792-233bf632619b?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1627735483792-233bf632619b?w=400&q=80',
      'https://images.unsplash.com/photo-1502747220144-846486e80891?w=400&q=80',
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80'
    ],
    description: '蛋白质丰富，可打豆浆',
    origin: '绿源有机农场',
    certification: '中国有机认证',
    tags: ['蛋白']
  },
  {
    name: '有机土鸡蛋',
    nameEn: 'Organic Free-range Eggs',
    category: 'eggs',
    price: 29.9,
    unit: '10枚',
    stock: 100,
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80',
      'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=400&q=80',
      'https://images.unsplash.com/photo-1569288063643-5d29ad64df09?w=400&q=80'
    ],
    description: '散养土鸡，蛋黄饱满',
    origin: '绿源生态养殖基地',
    certification: '中国有机认证',
    tags: ['热销', '营养']
  },
  {
    name: '有机蜂蜜',
    nameEn: 'Organic Honey',
    category: 'honey',
    price: 89.9,
    unit: '500g',
    stock: 80,
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&q=80',
      'https://images.unsplash.com/photo-1633893215271-f7e1fca081ad?w=400&q=80',
      'https://images.unsplash.com/photo-1606757389667-45c2024f9fa4?w=400&q=80'
    ],
    description: '纯天然蜂蜜，无添加',
    origin: '绿源蜂场',
    certification: '中国有机认证',
    tags: ['养生', '送礼']
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('数据库连接成功');

    await Product.deleteMany({});
    console.log('已清空商品数据');

    await Product.insertMany(productsData);
    console.log(`已插入 ${productsData.length} 个商品`);

    await User.deleteMany({ email: { $in: ['admin@lvyuan.com', 'test@example.com'] } });
    
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      username: 'admin',
      email: 'admin@lvyuan.com',
      password: adminPassword,
      phone: '13800138000',
      role: 'admin'
    });
    await admin.save();
    console.log('管理员账号已创建: admin@lvyuan.com / admin123');

    const testPassword = await bcrypt.hash('test123', 10);
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: testPassword,
      phone: '13800138001',
      role: 'user'
    });
    await testUser.save();
    console.log('测试用户已创建: test@example.com / test123');

    console.log('数据初始化完成！');
    process.exit(0);
  } catch (error) {
    console.error('数据初始化失败:', error);
    process.exit(1);
  }
}

seedDatabase();
