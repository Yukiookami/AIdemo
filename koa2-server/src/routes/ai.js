import Router from "@koa/router";
import ollama from "../config/ollama.js";

const router = new Router();

/**
 * GET /api/ai/models
 * 获取 Ollama 可用模型列表
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
 * 普通对话（等待完整响应）
 * Body: { model: string, messages: [{role, content}] }
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
 * 流式对话（SSE）
 * Body: { model: string, messages: [{role, content}] }
 */
router.post("/chat/stream", async (ctx) => {
  const { model = "qwen2.5:32b", messages } = ctx.request.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "messages 不能为空" };
    return;
  }

  // 设置 SSE 响应头
  ctx.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  ctx.status = 200;

  const stream = await ollama.chat({ model, messages, stream: true });

  // 逐 chunk 写入
  for await (const chunk of stream) {
    const content = chunk.message?.content || "";
    ctx.res.write(`data: ${JSON.stringify({ content, done: chunk.done })}\n\n`);
    if (chunk.done) break;
  }

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
