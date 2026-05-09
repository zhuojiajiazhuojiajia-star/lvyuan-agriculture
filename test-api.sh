#!/bin/bash

echo "========================================"
echo "  绿源农业 API 测试"
echo "========================================"

BASE_URL="http://localhost:3000/api"

echo ""
echo "1. 健康检查..."
curl -s "${BASE_URL}/health"
echo ""

echo "2. 获取商品列表..."
curl -s "${BASE_URL}/products" | head -c 200
echo ""

echo "3. 获取商品分类..."
curl -s "${BASE_URL}/products/categories"
echo ""

echo "4. 用户登录..."
curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
echo ""

echo ""
echo "测试完成！"
