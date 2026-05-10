FROM node:18-alpine

WORKDIR /app

# 复制 backend 目录的文件
COPY backend/package*.json ./

# 安装依赖（只安装生产依赖）
RUN npm install --production

# 复制源代码
COPY backend/ .

# 暴露端口（Railway 通过 PORT 环境变量指定）
EXPOSE 3000

# 启动应用
CMD ["sh", "-c", "node server.js"]
