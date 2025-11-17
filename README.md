# TodoList API

这是一个为HarmonyOS TodoList应用提供的免费云端API服务。

## 🚀 功能特性

- ✅ 完整的RESTful API接口
- ✅ 支持CORS跨域访问
- ✅ 数据过滤和查询
- ✅ 错误处理和状态码返回
- ✅ 自动部署和全球CDN加速

## 📡 API端点

### 获取待办列表
GET /api/todos
GET /api/todos?status=0 # 未完成任务
GET /api/todos?priority=1 # 重要任务
GET /api/todos?category=0 # 特定分类
GET /api/todos?id=1 # 根据ID查询
### 创建新任务
POST /api/todos
Content-Type: application/json
{
"title": "任务标题",
"content": "任务描述",
"status": 0,
"priority": 1,
"category": 0
}
### 更新任务
PUT /api/todos?id=1
Content-Type: application/json
{
"title": "更新后的标题",
"status": 1
}
### 删除任务
DELETE /api/todos?id=1
## 🌐 部署地址

**主域名**: https://todo-list-api-9mmr.vercel.app

**测试端点**:
- https://todo-list-api-9mmr.vercel.app/api/todos
- https://todo-list-api-9mmr.vercel.app/todos

## 🔧 技术栈

- **运行时**: Node.js
- **部署平台**: Vercel
- **API风格**: RESTful
- **数据格式**: JSON

## 🚀 快速开始

1. 配置HarmonyOS应用使用上述API地址
2. 开始使用云端同步功能

---

*为HarmonyOS学习项目提供支持*
