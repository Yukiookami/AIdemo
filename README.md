# AIdemo — AI 对话客户端

一个基于 Ollama 本地大模型的 AI 对话应用，前端使用 Vue 3 + Capacitor，后端使用 Koa2，支持打包为 iOS/Android 原生 App。

---

## 版本履历

### v0.5.0 — iOS 适配 + 布局重构 + Thinking 优化

- 📱 **iOS 安全区适配**：新增 `AIChatLayout.vue` 布局组件，使用 `position:fixed` + `top: env(safe-area-inset-top)` 精确处理刘海/Home 条，彻底解决高度超出和 footer 不显示的问题
- 🏗️ **布局重构**：将布局逻辑从 `index.vue` 中剥离，抽取为独立 `AIChatLayout.vue`，header/content/footer 三区域 flex 分配职责清晰
- 🧠 **Thinking 展示优化**：流式思考结束后折叠为「💭 已深度思考」，点击可展开查看完整推理过程，不再直接消失
- ✅ **开启模型 Thinking**：后端 Ollama 请求加入 `think: true`，`qwen3` 系列模型现在会正确输出思考过程
- 📐 **viewport 修正**：`index.html` 加入 `viewport-fit=cover`，`capacitor.config.ts` 设为 `contentInset: 'always'`
- 🏷️ **预设调整**：「中译日（商务）」调至第二位，图标改为 💼

### v0.4.0 — UI 全面接入 Vant + Iconify

- 🎨 引入 Vant 4 组件库，全面替换原生 HTML 元素
  - 模型选择框：原生 `<select>` → `van-dropdown-menu`
  - 清空按钮：原生 `<button>` → `van-button`
  - 预设标签：原生 `<button>` → 自定义 `<span>`（`touch-action: pan-x` 修复滑动）
  - 输入框：原生 `<textarea>` → `van-field`（内置 autosize）
  - 图片选择：自定义按钮 → `van-action-sheet` 弹出「拍照/相册」
- 🖼️ 引入 `@iconify/vue` + `@iconify-icons/mingcute` 离线图标集，替换 emoji 图标
- 💅 全局消除蓝色 focus 边框（`outline: none; -webkit-tap-highlight-color: transparent`）

### v0.3.0 — 图片识别全链路

- 📷 支持附图对话：拍照或从相册选图，base64 编码后随消息发送
- 🤖 后端透传 `images` 字段到 Ollama，支持多模态模型（如 `qwen3-vl:30b`）
- 🖼️ 用户气泡内展示已附图片缩略图，发送前可预览并逐张删除
- 🔧 新增 `useAIChatInput.ts` composable，抽离输入区所有逻辑

### v0.2.0 — 体验优化

- 🤔 AI 思考过程展示：流式输出期间显示固定高度滚动框，自动滚动到底部，思考结束后自动隐藏
- ✏️ 竖线光标替代圆圈光标，流式输出期间闪烁
- 🎯 预设提示词作为隐式 system prompt 注入，不展示在对话列表
- 🐾 新增「Shiro」默认人格，每次请求固定注入，性格活泼开朗、热爱写代码和做饭
- 📋 预设词抽取到独立 `presets.ts` 统一管理
- 🖱️ 预设词横向滚动防误触（`pointerdown/up` + 6px 阈值）

### v0.1.0 — 基础功能

- 💬 流式 AI 对话（SSE），逐字输出
- 🧠 完整历史记忆：每次请求携带全部对话历史
- 🤖 模型选择下拉，支持切换 Ollama 已安装模型，持久化到 localStorage
- 🗑️ 一键清空对话
- 📱 Vue 3 + Capacitor 8，可打包为 iOS/Android App

---

## 技术栈

### 前端 `vue-capacitor-app`

| 分类       | 依赖                                   | 版本        |
| ---------- | -------------------------------------- | ----------- |
| 框架       | Vue 3                                  | ^3.5.29     |
| 语言       | TypeScript                             | ~5.9.3      |
| 构建       | Vite                                   | ^7.x        |
| 路由       | Vue Router                             | ^5.0.3      |
| 状态管理   | Pinia                                  | ^3.0.4      |
| UI 组件库  | Vant                                   | ^4.9.22     |
| 图标       | @iconify/vue + @iconify-icons/mingcute | ^5 / ^1.2.9 |
| 样式       | sass-embedded (SCSS)                   | ^1.97.3     |
| 跨平台打包 | Capacitor                              | ^8.1.0      |

### 后端 `koa2-server`

| 分类       | 依赖           | 版本    |
| ---------- | -------------- | ------- |
| 框架       | Koa2           | ^3.1.2  |
| 路由       | @koa/router    | ^15.3.1 |
| 跨域       | @koa/cors      | ^5.0.0  |
| 请求体解析 | koa-bodyparser | ^4.4.1  |
| AI 接口    | ollama SDK     | ^0.6.3  |
| 开发热重载 | nodemon        | ^3.1.14 |

---

## 项目结构

```text
AIdemo/
├── vue-capacitor-app/          # 前端 Vue 3 应用
│   ├── src/
│   │   ├── views/AIChat/
│   │   │   ├── components/       # UI 子组件
│   │   │   │   ├── AIChatLayout.vue      # 布局容器（safe area / flex 分区）
│   │   │   │   ├── AIChatHeader.vue      # 顶部栏（模型选择 + 清空）
│   │   │   │   ├── AIChatMessages.vue    # 消息列表
│   │   │   │   ├── AIChatBubble.vue      # 单条消息气泡
│   │   │   │   ├── AIChatThinking.vue    # AI 思考过程展示（流式/折叠）
│   │   │   │   ├── AIChatPresets.vue     # 预设提示词标签
│   │   │   │   └── AIChatInput.vue       # 底部输入区
│   │   │   ├── composables/      # 逻辑层
│   │   │   │   ├── useAIChat.ts          # 核心对话状态逻辑
│   │   │   │   ├── useAIChatInput.ts     # 输入区逻辑
│   │   │   │   └── presets.ts            # 默认人格 + 预设提示词配置
│   │   │   ├── service/
│   │   │   │   └── aiService.ts          # HTTP/SSE 客户端
│   │   │   ├── types/
│   │   │   │   └── index.ts              # 共享 TypeScript 类型
│   │   │   └── index.vue                 # 页面入口
│   │   ├── App.vue
│   │   └── main.ts
│   ├── capacitor.config.ts
│   └── package.json
│
└── koa2-server/                # 后端 Koa2 服务
    ├── src/
    │   └── routes/
    │       └── ai.js               # AI 对话路由（SSE 流式输出）
    ├── index.js                    # 服务入口
    └── package.json
```

---

## 快速开始

### 前置条件

- Node.js 18+
- [Ollama](https://ollama.com) 已安装并运行，且已拉取至少一个模型
- 服务地址通过 `koa2-server/.env` 的 `OLLAMA_HOST` 配置

### 1. 启动后端

```bash
cd koa2-server
npm install
npm run dev
# 服务运行在 http://localhost:11435
```

> **`.env` 配置说明**（`koa2-server/.env`）：
>
> ```dotenv
> PORT=11435                              # 服务端口
> OLLAMA_HOST=http://localhost:11434      # Windows 本机 Ollama
> # OLLAMA_HOST=http://shiro-windows:11434  # 通过 Tailscale 远程访问
> ```

### 2. 启动前端（开发）

```bash
cd vue-capacitor-app
npm install
npm run dev
# 打开浏览器访问 http://localhost:5173
```

---

## 前端打包与部署

### 构建 Web 产物

```bash
cd vue-capacitor-app
npm run build
# 产物输出到 dist/
```

### 同步到 Capacitor 原生项目

```bash
# ⚠️ 必须先 build 生成 dist/，再执行 sync
npm run build
npx cap sync

# 或者用脚本（等同于上面两步合并）
npm run cap:sync  # 注意：此脚本仅执行 sync，需提前手动 build
```

### iOS 打包（需要 macOS + Xcode）

```bash
# 0. 首次使用需先初始化 iOS 原生项目（只需执行一次）
npx cap add ios

# 1. 构建并同步代码
npm run build
npx cap sync

# 或者用脚本（等同于上面两步合并）
npm run cap:sync  # 注意：此脚本仅执行 sync，需提前手动 build

# 2. 打开 Xcode
npm run cap:open:ios

# 3. 在 Xcode 中：
#    Product → Archive
#    归档完成后 → Distribute App → Development
#    导出 .ipa 文件

# 4. 使用 AltStore 或 Xcode 直接安装到真机
```

> 也可以手动打包 .ipa：
> `~/Library/Developer/Xcode/Archives/` 找到归档 → 显示包内容 →
> `Products/Applications/` → 新建 `Payload` 文件夹 → 将 `.app` 拖入 →
> 压缩为 `Payload.zip` → 改后缀为 `.ipa`

### Android 打包（需要 Android Studio）

```bash
# 1. 同步代码
npm run cap:sync

# 2. 打开 Android Studio
npm run cap:open:android

# 3. 在 Android Studio 中：
#    Build → Generate Signed Bundle / APK → APK
#    配置签名 → 生成 release APK
```

---

## 使用说明

### 模型切换

点击顶部模型下拉框，切换已在 Ollama 安装的模型：

- 文字对话：`qwen3:latest`、`qwen2.5:32b` 等
- 图片识别：需切换到 `qwen3-vl:30b`（或其他多模态模型）

### 预设提示词

底部标签栏提供翻译类快捷预设，点击激活后再次点击可取消。
激活的预设会作为隐式 system prompt 注入，不展示在对话气泡里。

### 附图对话

点击 📎 按钮，选择「拍照」或「从相册选择」，图片附加到下一条消息一起发送。

> ⚠️ 附图功能需使用支持多模态的模型，纯文字模型会忽略图片内容。

---

## 开发规范

- 所有函数使用箭头函数（`const fn = () => {}`），无 `function` 声明
- 复杂逻辑抽取到 `composables/` 目录
- 所有样式使用 `<style scoped lang="scss">`，支持嵌套语法
- 提示词配置统一在 `presets.ts` 管理，逻辑层不包含提示词字符串
