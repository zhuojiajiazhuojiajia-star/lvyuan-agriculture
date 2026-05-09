#!/bin/bash

echo "========================================"
echo "  绿源农业 API 测试脚本"
echo "========================================"
echo ""

BASE_URL="http://localhost:3000/api"

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "1. 测试健康检查接口..."
response=$(curl -s "${BASE_URL}/health")
if echo "$response" | grep -q "ok"; then
    echo -e "${GREEN}✓ 健康检查通过${NC}"
    echo "  响应: $response"
else
    echo -e "${RED}✗ 健康检查失败${NC}"
fi
echo ""

echo "2. 测试获取商品列表..."
response=$(curl -s "${BASE_URL}/products")
if echo "$response" | grep -q "products"; then
    count=$(echo "$response" | grep -o '"products"' | wc -l)
    echo -e "${GREEN}✓ 商品列表获取成功${NC}"
    echo "  响应包含商品数据"
else
    echo -e "${RED}✗ 商品列表获取失败${NC}"
fi
echo ""

echo "3. 测试获取商品分类..."
response=$(curl -s "${BASE_URL}/products/categories")
if echo "$response" | grep -q "name"; then
    echo -e "${GREEN}✓ 商品分类获取成功${NC}"
    echo "  响应: $response"
else
    echo -e "${RED}✗ 商品分类获取失败${NC}"
fi
echo ""

echo "4. 测试用户注册..."
register_response=$(curl -s -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser'$(date +%s)'","email":"test'$(date +%s)'@example.com","password":"123456"}')
if echo "$register_response" | grep -q "token"; then
    echo -e "${GREEN}✓ 用户注册成功${NC}"
    token=$(echo "$register_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo "  Token获取成功"
else
    echo -e "${RED}✗ 用户注册失败${NC}"
    echo "  响应: $register_response"
fi
echo ""

echo "5. 测试用户登录..."
login_response=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}')
if echo "$login_response" | grep -q "token"; then
    echo -e "${GREEN}✓ 用户登录成功${NC}"
    token=$(echo "$login_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo "  Token: ${token:0:30}..."
else
    echo -e "${RED}✗ 用户登录失败${NC}"
    echo "  响应: $login_response"
fi
echo ""

echo "========================================"
echo "  API 测试完成"
echo "========================================"
