# 绿源农业后端 API 说明

## 项目概述

后端服务为绿源农业电商平台提供完整的数据管理和用户服务，包括用户认证、购物车、订单管理、商品评论、会员订阅等功能。

## 技术栈

- **Node.js** + **Express** - Web 框架
- **MongoDB** + **Mongoose** - 数据库
- **JWT** - 身份认证
- **bcryptjs** - 密码加密

## 快速开始

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置环境变量

编辑 `backend/.env` 文件：

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/lvyuan_agriculture
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. 初始化数据库

```bash
cd backend
node seed.js
```

这会创建：
- 22 个示例商品
- 管理员账号: admin@lvyuan.com / admin123
- 测试用户: test@example.com / test123

### 4. 启动服务器

```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

服务器启动后，API 地址为 `http://localhost:3000/api`

## API 接口列表

### 认证接口

| 方法 | 路径 | 描述 | 需要登录 |
|------|------|------|----------|
| POST | /api/auth/register | 用户注册 | 否 |
| POST | /api/auth/login | 用户登录 | 否 |
| GET | /api/auth/me | 获取当前用户信息 | 是 |
| PUT | /api/auth/profile | 更新个人信息 | 是 |
| PUT | /api/auth/password | 修改密码 | 是 |

### 商品接口

| 方法 | 路径 | 描述 | 需要登录 |
|------|------|------|----------|
| GET | /api/products | 获取商品列表 | 否 |
| GET | /api/products/categories | 获取商品分类 | 否 |
| GET | /api/products/:id | 获取商品详情 | 否 |
| POST | /api/products | 创建商品 | 管理员 |
| PUT | /api/products/:id | 更新商品 | 管理员 |
| DELETE | /api/products/:id | 删除商品 | 管理员 |

### 购物车接口

| 方法 | 路径 | 描述 | 需要登录 |
|------|------|------|----------|
| GET | /api/cart | 获取购物车 | 是 |
| POST | /api/cart/add | 添加商品到购物车 | 是 |
| PUT | /api/cart/update/:productId | 更新商品数量 | 是 |
| DELETE | /api/cart/remove/:productId | 移除商品 | 是 |
| DELETE | /api/cart/clear | 清空购物车 | 是 |
| PUT | /api/cart/select-all | 全选/取消全选 | 是 |

### 订单接口

| 方法 | 路径 | 描述 | 需要登录 |
|------|------|------|----------|
| GET | /api/orders | 获取订单列表 | 是 |
| GET | /api/orders/:id | 获取订单详情 | 是 |
| POST | /api/orders | 创建订单 | 是 |
| PUT | /api/orders/:id/cancel | 取消订单 | 是 |
| PUT | /api/orders/:id/pay | 支付订单 | 是 |

### 评论接口

| 方法 | 路径 | 描述 | 需要登录 |
|------|------|------|----------|
| GET | /api/reviews/product/:productId | 获取商品评论 | 否 |
| POST | /api/reviews | 提交评论 | 是 |
| PUT | /api/reviews/:id/like | 点赞评论 | 是 |

### 会员订阅接口

| 方法 | 路径 | 描述 | 需要登录 |
|------|------|------|----------|
| GET | /api/subscriptions | 获取当前订阅 | 是 |
| GET | /api/subscriptions/plans | 获取套餐列表 | 否 |
| POST | /api/subscriptions | 创建订阅 | 是 |
| PUT | /api/subscriptions/pause | 暂停订阅 | 是 |
| PUT | /api/subscriptions/resume | 恢复订阅 | 是 |
| DELETE | /api/subscriptions | 取消订阅 | 是 |

## 前端集成

前端已通过 `js/api.js` 封装了所有 API 调用：

```javascript
// 登录
await api.login({ email: 'user@example.com', password: '123456' });

// 获取商品列表
const products = await api.getProducts({ category: 'vegetables' });

// 添加到购物车
await api.addToCart(productId, 1);

// 创建订单
const order = await api.createOrder({
  items: [...],
  shippingAddress: {...},
  useCart: true
});
```

## 默认账号

测试时可以使用以下账号：

- **管理员**: admin@lvyuan.com / admin123
- **测试用户**: test@example.com / test123

## 项目结构

```
backend/
├── models/          # 数据模型
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   ├── Order.js
│   ├── Review.js
│   └── Subscription.js
├── routes/          # API 路由
│   ├── auth.js
│   ├── products.js
│   ├── cart.js
│   ├── orders.js
│   ├── reviews.js
│   └── subscriptions.js
├── middleware/      # 中间件
│   ├── auth.js      # JWT 认证
│   └── validation.js # 请求验证
├── server.js        # 入口文件
├── seed.js          # 数据初始化
└── package.json
```

## 注意事项

1. 确保 MongoDB 服务已启动
2. 生产环境请修改 JWT_SECRET 为强密钥
3. 默认 CORS 允许 localhost:8080，生产环境需要修改
