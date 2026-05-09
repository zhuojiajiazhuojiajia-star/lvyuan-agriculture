# 绿源农业电商平台

一个基于 Vue.js + Node.js + Express 的有机农产品电商平台。

## 项目结构

```
├── index.html           # 主页面
├── css/style.css        # 样式文件
├── js/
│   ├── main.js          # Vue 主逻辑
│   └── api.js           # 后端 API 服务
├── backend/             # 后端项目
│   ├── server.js        # 服务器入口
│   ├── package.json     # 依赖配置
│   ├── models/          # 数据模型
│   ├── routes/          # API 路由
│   ├── middleware/      # 中间件
│   └── scripts/         # 数据库初始化
├── render.yaml          # Render 部署配置
├── docker-compose.yml   # Docker 编排
└── nginx.conf           # Nginx 配置
```

## 技术栈

- **前端**: Vue.js 3 + Vue Router
- **后端**: Node.js + Express
- **数据库**: MongoDB（部署时由云平台自动提供）
- **认证**: JWT
- **部署**: Vercel（前端）+ Render/Railway（后端）

## 快速开始

### 本地开发

```bash
# 1. 安装后端依赖
cd backend && npm install

# 2. 配置数据库连接
# 编辑 backend/.env 文件，填入数据库连接字符串

# 3. 启动后端
npm start

# 4. 打开 index.html 即可访问
```

### 一键部署（推荐）

前端部署到 Vercel，后端部署到 Render/Railway，数据库由平台自动创建，无需手动安装。

## API 接口

| 模块 | 接口 | 说明 |
|------|------|------|
| 认证 | POST /api/auth/register | 注册 |
| 认证 | POST /api/auth/login | 登录 |
| 商品 | GET /api/products | 商品列表 |
| 购物车 | GET /api/cart | 购物车 |
| 订单 | POST /api/orders | 创建订单 |
| 评论 | POST /api/reviews | 发表评论 |
| 订阅 | GET /api/subscriptions/plans | 套餐列表 |

## 功能特性

- 🌿 有机农产品展示与分类
- 👤 用户注册登录（JWT 认证）
- 🛒 购物车管理
- 📦 订单系统
- ⭐ 商品评论
- 👑 会员订阅套餐
- 🌐 中英文切换
- 📱 响应式设计
