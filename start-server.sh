#!/bin/bash

echo "========================================"
echo "  绿源农业后端服务启动"
echo "========================================"

cd backend

if [ ! -d "node_modules" ]; then
    echo "正在安装依赖..."
    npm install
fi

echo "正在启动服务器..."
node server.js
