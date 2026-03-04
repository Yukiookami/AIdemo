import Router from "@koa/router";
import ollama from "../config/ollama.js";

const router = new Router();

/**
 * GET /api/ai/models
 * 获取 Ollama 当前已拉取的模型列表
 * 返回格式: { code: 200, data: Model[] }
 */
router.get("/models", async (ctx) => {
  const { models } = await ollama.list();
  ctx.body = {
    code: 200,
    data: models,
  };
});

/**
 * POST /api/ai/chat
 * 普通对话（阵列式，等待完整响应）
 * Body: { model?: string, messages: [{role, content}] }
 * 返回格式: { code: 200, data: { model, message, done } }
 * 注意：该接口当前前端未使用，仅作备用
 */
router.post("/chat", async (ctx) => {
  const { model = "qwen2.5:32b", messages } = ctx.request.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "messages 不能为空" };
    return;
  }

  const response = await ollama.chat({ model, messages });

  ctx.body = {
    code: 200,
    data: {
      model: response.model,
      message: response.message,
      done: response.done,
    },
  };
});

/**
 * POST /api/ai/chat/stream
 * 流式对话（SSE 服务器推送事件）
 * Body: { model?: string, messages: [{role, content}] }
 *
 * 响应格式（每行一个 SSE 事件）:
 *   data: { content: string, thinking: string, done: boolean }
 *
 * - content: 当前 chunk 的文字内容
 * - thinking: 思考型模型的推理过程（普通模型该字段为空字符串）
 * - done: 为 true 时表示模型已完成输出
 */
router.post("/chat/stream", async (ctx) => {
  const { model = "qwen2.5:32b", messages } = ctx.request.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "messages 不能为空" };
    return;
  }

  // 设置 SSE 标准响应头
  // X-Accel-Buffering: no 用于关闭 Nginx 缓冲，确保内容实时推送到客户端
  ctx.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  ctx.status = 200;

  // 向 Ollama 发起流式对话请求
  // messages 中若包含 images 字段（base64 数组），Ollama 会自动传给多模态模型
  // think: true 启用 qwen3 等思考型模型的推理过程输出（thinking 字段）
  const stream = await ollama.chat({ model, messages, stream: true, think: true });

  // 逐 chunk 读取并向客户端写入 SSE 消息
  // thinking 字段：仅 qwen3 等思考型模型会带有内容，普通模型为空字符串
  for await (const chunk of stream) {
    const content = chunk.message?.content || "";
    const thinking = chunk.message?.thinking || "";
    ctx.res.write(
      `data: ${JSON.stringify({ content, thinking, done: chunk.done })}\n\n`,
    );
    // chunk.done=true 表示模型输出完毕，提前跳出循环
    if (chunk.done) break;
  }

  // 关闭 SSE 连接
  ctx.res.end();
});

/**
 * POST /api/ai/generate
 * 文本生成（非对话模式）
 * Body: { model: string, prompt: string }
 */
router.post("/generate", async (ctx) => {
  const { model = "qwen2.5:32b", prompt } = ctx.request.body;

  if (!prompt) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "prompt 不能为空" };
    return;
  }

  const response = await ollama.generate({ model, prompt });

  ctx.body = {
    code: 200,
    data: {
      model: response.model,
      response: response.response,
      done: response.done,
    },
  };
});

export default router;
