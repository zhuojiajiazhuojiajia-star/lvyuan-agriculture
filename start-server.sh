#!/bin/bash

# 绿源农业后端服务启动脚本

echo "========================================"
echo "  绿源农业 API 服务器启动脚本"
echo "========================================"
echo ""

# 检查 Node.js
echo "检查 Node.js..."
if ! command -v node &> /dev/null; then
    echo "错误: 未安装 Node.js，请先安装 Node.js 14+"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo "错误: Node.js 版本过低，需要 14+，当前版本: $(node --version)"
    exit 1
fi

echo "Node.js 版本: $(node --version) ✓"
echo ""

# 进入后端目录
cd "$(dirname "$0")/backend"

# 检查是否需要安装依赖
if [ ! -d "node_modules" ]; then
    echo "正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "错误: 依赖安装失败"
        exit 1
    fi
    echo "依赖安装完成 ✓"
else
    echo "依赖已安装 ✓"
fi

echo ""
echo "========================================"
echo "  启动选项"
echo "========================================"
echo "1. 启动开发服务器 (nodemon)"
echo "2. 启动生产服务器"
echo "3. 初始化数据库"
echo "4. 退出"
echo ""

read -p "请选择 [1-4]: " choice

case $choice in
    1)
        echo ""
        echo "启动开发服务器..."
        echo "API 地址: http://localhost:3000/api"
        echo "按 Ctrl+C 停止服务器"
        echo ""
        npm run dev
        ;;
    2)
        echo ""
        echo "启动生产服务器..."
        echo "API 地址: http://localhost:3000/api"
        echo "按 Ctrl+C 停止服务器"
        echo ""
        npm start
        ;;
    3)
        echo ""
        echo "初始化数据库..."
        node seed.js
        echo ""
        read -p "按回车键返回主菜单..."
        exec "$0"
        ;;
    4)
        echo "退出"
        exit 0
        ;;
    *)
        echo "无效选项"
        exec "$0"
        ;;
esac
