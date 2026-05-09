# 绿源农业电商平台后端 API

## 项目简介

绿源农业电商平台后端服务，提供用户认证、商品管理、购物车、订单、评论、会员订阅等功能。

## 技术栈

- **Node.js** - 运行环境
- **Express** - Web框架
- **MongoDB** - 数据库
- **Mongoose** - ODM
- **JWT** - 身份认证
- **bcryptjs** - 密码加密

## 快速开始

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，配置 MongoDB 连接字符串和 JWT 密钥
```

### 3. 初始化数据

```bash
node seed.js
```

### 4. 启动服务器

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

服务器默认运行在 `http://localhost:3000`

## API 接口文档

### 认证接口

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/auth/register | 用户注册 |
| POST | /api/auth/login | 用户登录 |
| GET | /api/auth/me | 获取当前用户 |
| PUT | /api/auth/profile | 更新个人信息 |
| PUT | /api/auth/password | 修改密码 |

### 商品接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/products | 获取商品列表 |
| GET | /api/products/categories | 获取商品分类 |
| GET | /api/products/:id | 获取商品详情 |
| POST | /api/products | 创建商品（管理员） |
| PUT | /api/products/:id | 更新商品（管理员） |
| DELETE | /api/products/:id | 删除商品（管理员） |

### 购物车接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/cart | 获取购物车 |
| POST | /api/cart/add | 添加商品 |
| PUT | /api/cart/update/:productId | 更新商品数量 |
| DELETE | /api/cart/remove/:productId | 移除商品 |
| DELETE | /api/cart/clear | 清空购物车 |
| PUT | /api/cart/select-all | 全选/取消全选 |

### 订单接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/orders | 获取订单列表 |
| GET | /api/orders/:id | 获取订单详情 |
| POST | /api/orders | 创建订单 |
| PUT | /api/orders/:id/cancel | 取消订单 |
| PUT | /api/orders/:id/pay | 支付订单 |

### 评论接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/reviews/product/:productId | 获取商品评论 |
| POST | /api/reviews | 提交评论 |
| PUT | /api/reviews/:id/like | 点赞评论 |
| POST | /api/reviews/:id/reply | 回复评论（管理员） |

### 订阅接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/subscriptions | 获取当前订阅 |
| GET | /api/subscriptions/plans | 获取套餐列表 |
| POST | /api/subscriptions | 创建订阅 |
| PUT | /api/subscriptions/pause | 暂停订阅 |
| PUT | /api/subscriptions/resume | 恢复订阅 |
| PUT | /api/subscriptions/preferences | 更新偏好 |
| DELETE | /api/subscriptions | 取消订阅 |

## 默认账号

- **管理员**: admin@lvyuan.com / admin123
- **测试用户**: test@example.com / test123

## 项目结构

```
backend/
├── models/          # 数据模型
├── routes/          # API路由
├── middleware/      # 中间件
├── server.js        # 入口文件
├── seed.js          # 数据初始化
├── package.json
└── .env
```
