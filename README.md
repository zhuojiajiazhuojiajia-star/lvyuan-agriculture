# 绿源农业电商平台

一个基于 Vue.js + Node.js + MongoDB 的有机农产品电商平台。

## 项目结构

```
├── index.html          # 主页面
├── css/style.css       # 样式文件
├── js/
│   ├── main.js         # Vue 主逻辑
│   └── api.js          # 后端 API 服务
├── backend/            # 后端项目
│   ├── server.js       # 服务器入口
│   ├── package.json    # 依赖配置
│   ├── models/         # 数据模型
│   ├── routes/         # API 路由
│   ├── middleware/     # 中间件
│   └── scripts/        # 数据库初始化
├── docker-compose.yml  # Docker 编排
├── nginx.conf          # Nginx 配置
└── render.yaml         # Render 部署配置
```

## 快速开始

### 本地开发

```bash
# 1. 安装后端依赖
cd backend && npm install

# 2. 启动后端
npm start

# 3. 打开 index.html 即可
```

### Docker 部署

```bash
docker-compose up -d
```

## 技术栈

- **前端**: Vue.js 3 + Vue Router
- **后端**: Node.js + Express
- **数据库**: MongoDB + Mongoose
- **认证**: JWT

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
