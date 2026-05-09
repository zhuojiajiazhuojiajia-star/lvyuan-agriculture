FROM node:18-alpine

WORKDIR /app

# 复制 backend 目录的文件
COPY backend/package*.json ./
RUN npm install

COPY backend/ .

EXPOSE 3000

CMD ["node", "server.js"]
