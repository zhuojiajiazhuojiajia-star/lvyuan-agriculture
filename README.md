# 绿源农业电商平台

一个基于 Vue.js + Node.js + Express 的有机农产品电商平台。

## 项目结构

```
├── index.html           # 主页面
├── css/style.css        # 样式文件
├── js/
│   ├── main.js          # Vue 主逻辑
│   └── api.js           # 后端 API 服务
├── images/              # 图片资源
│   ├── hero-bg.jpg      # 首页背景图
│   └── logo.jpg         # Logo 图片
├── backend/             # 后端项目
│   ├── server.js        # 服务器入口
│   ├── package.json     # 依赖配置
│   ├── models/          # 数据模型
│   ├── routes/          # API 路由
│   ├── middleware/      # 中间件
│   └── scripts/         # 数据库初始化
└── README.md
```

## 技术栈

- **前端**: Vue.js 3 + Vue Router
- **后端**: Node.js + Express
- **数据库**: MongoDB（部署时由云平台自动提供）
- **认证**: JWT

## 部署方式

| 服务 | 平台 | 说明 |
|------|------|------|
| **前端** | Netlify | 国内可访问 |
| **后端** | Railway | 含 MongoDB 数据库 |

### 前端部署（Netlify）

1. 打开 https://app.netlify.com
2. 用 GitHub 登录
3. 导入 `lvyuan-agriculture` 仓库
4. Build command 留空，Publish directory 填 `.`
5. 点击 Deploy

### 后端部署（Railway）

1. 打开 https://railway.app
2. 用 GitHub 登录
3. 创建新项目，选择 GitHub 仓库
4. 添加 MongoDB 数据库
5. 配置环境变量

## 环境变量

后端需要以下环境变量：

| 变量名 | 说明 |
|--------|------|
| `MONGODB_URI` | MongoDB 连接字符串（Railway 自动注入） |
| `JWT_SECRET` | JWT 密钥 |
| `NODE_ENV` | 生产环境设为 `production` |

## 功能特性

- 🌿 有机农产品展示与分类
- 👤 用户注册登录（JWT 认证）
- 🛒 购物车管理
- 📦 订单系统
- ⭐ 商品评论
- 👑 会员订阅套餐
- 🌐 中英文切换
- 📱 响应式设计

## 本地开发

```bash
# 1. 安装后端依赖
cd backend && npm install

# 2. 启动后端
npm start

# 3. 打开 index.html 即可访问
```
