# 绿源农业电商平台

一个完整的有机农产品电商网站，包含前端展示和后端 API 服务。

## 功能特性

- 🌱 响应式前端页面（首页、产品、关于、案例、联系）
- 🔐 用户认证系统（注册、登录、JWT Token）
- 🛒 购物车功能（本地 + 云端同步）
- 📦 订单管理系统
- 💬 商品评论功能
- 👑 会员订阅服务
- 🌐 中英文双语支持
- 🌙 暗黑模式切换

## 技术栈

### 前端
- Vue 3 + Vue Router
- 纯 HTML/CSS/JS（无需构建工具）
- Font Awesome 图标
- 响应式设计

### 后端
- Node.js + Express
- MongoDB + Mongoose
- JWT 认证
- bcryptjs 密码加密

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/lvyuan-agriculture.git
cd lvyuan-agriculture
```

### 2. 使用 Docker 部署（推荐）

```bash
# 启动所有服务
docker-compose up -d

# 初始化数据库
docker-compose exec backend node seed.js

# 查看日志
docker-compose logs -f
```

### 3. 手动部署

#### 启动后端

```bash
cd backend
npm install
npm run dev
```

#### 启动前端

使用任意静态服务器，例如：

```bash
# 使用 Python
python -m http.server 8080

# 或使用 Node.js
npx serve .

# 或使用 VS Code Live Server 插件
```

## API 接口

| 接口 | 方法 | 描述 |
|------|------|------|
| /api/auth/register | POST | 用户注册 |
| /api/auth/login | POST | 用户登录 |
| /api/products | GET | 商品列表 |
| /api/cart | GET/POST | 购物车 |
| /api/orders | GET/POST | 订单管理 |

完整 API 文档见 [后端API说明.md](./后端API说明.md)

## 项目结构

```
.
├── backend/              # 后端项目
│   ├── models/          # 数据模型
│   ├── routes/          # API 路由
│   ├── middleware/      # 中间件
│   ├── server.js        # 入口文件
│   └── package.json
├── css/                 # 前端样式
├── js/                  # 前端脚本
│   ├── api.js          # API 服务
│   └── main.js         # 主逻辑
├── index.html          # 主页面
├── docker-compose.yml  # Docker 配置
└── nginx.conf          # Nginx 配置
```

## 默认账号

- 管理员: `admin@lvyuan.com` / `admin123`
- 测试用户: `test@example.com` / `test123`

## 部署到生产环境

### 使用 Vercel 部署前端

```bash
npm i -g vercel
vercel
```

### 使用 Render 部署后端

1. 在 Render 创建 Web Service
2. 连接 GitHub 仓库
3. 设置环境变量
4. 自动部署

### 使用自己的服务器

```bash
# 安装 PM2
npm install -g pm2

# 启动后端
pm2 start backend/server.js --name lvyuan-api

# 配置 Nginx
sudo cp nginx.conf /etc/nginx/sites-available/lvyuan
sudo ln -s /etc/nginx/sites-available/lvyuan /etc/nginx/sites-enabled/
sudo nginx -s reload
```

## 开发指南

### 添加新商品

编辑 `backend/seed.js`，在 `productsData` 数组中添加商品对象。

### 修改 API 地址

编辑 `js/api.js` 中的 `API_BASE_URL`：

```javascript
// 开发环境
const API_BASE_URL = 'http://localhost:3000/api';

// 生产环境
const API_BASE_URL = 'https://your-domain.com/api';
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
