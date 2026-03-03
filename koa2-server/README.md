# koa2-server

基于 Koa2 的 Node.js RESTful API 服务端项目。

## 技术栈

- **Koa2** - 轻量级 Node.js Web 框架
- **@koa/router** - 路由管理
- **koa-bodyparser** - 请求体解析
- **koa-cors** - 跨域支持
- **koa-logger** - 请求日志
- **dotenv** - 环境变量管理
- **nodemon** - 开发热重载

## 项目结构

```
koa2-server/
├── src/
│   ├── app.js          # Koa 应用实例
│   └── routes/
│       └── api.js      # API 路由
├── index.js            # 入口文件
├── .env                # 环境变量
├── .gitignore
└── package.json
```

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式（热重载）
npm run dev

# 生产模式
npm start
```

## API 接口

| 方法 | 路径           | 说明         |
| ---- | -------------- | ------------ |
| GET  | /              | 服务状态     |
| GET  | /health        | 健康检查     |
| GET  | /api/users     | 获取用户列表 |
| GET  | /api/users/:id | 获取单个用户 |
| POST | /api/users     | 创建用户     |

## 环境变量

复制 `.env` 文件并根据需要修改：

```env
PORT=3000
NODE_ENV=development
```
