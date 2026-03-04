# Shiro AI Chat

基于 Vue 3 + Capacitor 8 构建的 iOS AI 对话应用，通过 Koa2 后端连接本地 Ollama 服务，支持多模型切换、流式输出、深度思考、Markdown 渲染等功能。

---

## 技术栈

| 层级          | 技术                              |
| ------------- | --------------------------------- |
| 前端框架      | Vue 3 + TypeScript + Vite         |
| 移动端封装    | Capacitor 8（iOS）                |
| UI 组件库     | Vant 4                            |
| 图标          | Iconify（MingCute）               |
| Markdown 渲染 | marked + highlight.js + DOMPurify |
| 后端          | Koa2 + @koa/router                |
| AI 引擎       | Ollama SDK（远程连接）            |

---

## 项目结构

```text
vue-capacitor-app/
├── src/
│   ├── views/AIChat/
│   │   ├── components/
│   │   │   ├── AIChatBubble.vue       # 消息气泡（含 Markdown 渲染）
│   │   │   ├── AIChatHeader.vue       # 顶部栏（模型选择 + 清空）
│   │   │   ├── AIChatInput.vue        # 输入框（附图、深度思考开关、停止按钮）
│   │   │   ├── AIChatLayout.vue       # 布局容器（iOS safe-area 处理）
│   │   │   ├── AIChatMessages.vue     # 消息列表
│   │   │   ├── AIChatPresets.vue      # 预设标签栏
│   │   │   └── AIChatThinking.vue     # 思考过程展示（流式/折叠）
│   │   ├── composables/
│   │   │   ├── presets.ts             # 预设 prompt 配置
│   │   │   ├── useAIChat.ts           # 核心状态逻辑
│   │   │   ├── useAIChatInput.ts      # 输入框交互逻辑
│   │   │   └── useMarkdown.ts         # Markdown 渲染工具
│   │   ├── service/
│   │   │   └── aiService.ts           # API 请求封装（SSE 流式）
│   │   └── types/index.ts
│   └── utils/viewport.ts              # iOS viewport 高度修正
│
koa2-server/
├── src/
│   ├── config/ollama.js               # Ollama 客户端配置
│   └── routes/ai.js                   # AI 接口路由
└── index.js
```

---

## 本地运行

### 启动后端

```sh
cd koa2-server
npm install
npm run dev
```

### 启动前端（Web 预览）

```sh
cd vue-capacitor-app
npm install
npm run dev
```

### 构建并运行到 iOS

```sh
npm run build
npm run cap:sync
npm run cap:run:ios
```

---

## 环境变量

在 `vue-capacitor-app` 根目录创建 `.env.local`：

```env
VITE_API_BASE=http://your-server:3000
```

后端 Ollama 地址在 `koa2-server/src/config/ollama.js` 中配置：

```js
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://your-ollama-host:11434'
```

---

## Changelog

### v0.7.0

### Markdown 渲染

- assistant 消息支持完整 Markdown 渲染（段落、标题、列表、引用、表格、代码块）
- 代码块使用 highlight.js 语法高亮（GitHub 主题）
- DOMPurify 清洗 HTML，防止 XSS

### 深度思考开关

- 输入框上方新增"深度思考"胶囊 toggle，默认开启，可手动关闭
- 激活预设时自动强制禁用深度思考（防止翻译类场景无限推理）
- 后端不再使用固定白名单：先尝试传 `think` 参数，若模型不支持则自动降级重试
- `think: false` 时同步在用户消息末尾注入 `/no_think` token，双重保障关闭 qwen3 思考

### 停止生成

- 发送按钮在 AI 生成中变为红色停止按钮（■ 图标）
- 点击立即中断 SSE 流，已输出内容保留
- 基于 `AbortController` + `fetch signal` 实现，前端彻底断开连接

### 思考展示修复

- 关闭深度思考时，即使 Ollama 返回空白 thinking 字段也不再显示"已深度思考"
- `thinking` 内容判断加入 `.trim()`，过滤空白字符误触发

---

### v0.6.0

### 输入区可点击修复

- 根因：Vant DropdownMenu 在 Capacitor fixed 布局上下文中创建的遮罩层遮挡了输入框
- 修复：`<DropdownItem>` 添加 `teleport-to="body"`，弹出层挂载到 body 脱离层叠上下文
- 移除 `capacitor.config.ts` 中的 `contentInset: 'always'`（与手动 safe-area padding 双重计算）

### 翻译预设无限思考修复

- 有预设激活时：只注入预设 system prompt，不注入 Shiro 人设（二者冲突导致模型无限推理）
- 传 `think: false` 给后端，避免翻译场景开启深度思考

### 禁用双击缩放

- viewport meta 加入 `user-scalable=no, maximum-scale=1.0`
- 全局 `touch-action: manipulation`；滚动区域单独恢复 `pan-x` / `pan-y`

---

### v0.5.0

### 应用重命名

- App 名称改为 **Shiro AI Chat**（修改位置：`capacitor.config.ts`、`index.html`、`AIChatHeader.vue`、`ios/App/App/Info.plist`）
- `Info.plist` 添加相机、麦克风、相册权限声明

---

### v0.4.0

### iOS 布局修复

- 采用 `position: fixed; top:0; bottom:0` 方案替代 `-webkit-fill-available` 多层嵌套
- `.chat-layout__header` 加 `padding-top: env(safe-area-inset-top)`
- `.chat-layout__footer` 加 `padding-bottom: env(safe-area-inset-bottom)`
- 引入 `viewport.ts`：动态计算 `--vh` CSS 变量修正 iOS 100vh 问题

---

### v0.3.0

### 图片发送

- 输入框左侧附图按钮，支持拍照（`capture`）和从相册多选
- 图片转 base64 后随消息发送，多模态模型自动处理

---

### v0.2.0

### 思考过程展示

- 流式输出时实时展示思考内容（滚动框）
- 输出完成后折叠为"💭 已深度思考"，点击可展开查看完整推理

### 预设词

- 底部横向滚动预设标签，点击激活/取消
- 支持翻译类场景（日译中、中译日通用/商务、技术文档）

---

### v0.1.0

- Vue 3 + Capacitor 8 项目初始化
- Koa2 后端接入 Ollama，支持流式 SSE 对话
- 基础聊天界面：消息列表、输入框、模型切换下拉
