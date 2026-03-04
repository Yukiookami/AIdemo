/**
 * @file service/aiService.ts
 * @description AIChat 模块的 API 请求封装
 * 负责与后端 Koa2 服务通信，包含流式对话和模型列表两个接口
 */

import type { ChatMessage } from '../types/index'

/** 后端服务基础地址，通过环境变量配置 */
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

/**
 * 发起流式对话请求（SSE）
 * 通过 ReadableStream 逐 chunk 读取服务器推送的内容，实现打字机效果
 *
 * @param messages - 对话历史消息列表（仅传 role、content、images）
 * @param onChunk - 每收到一个文本片段时的回调，thinking 为思考过程，done 为 true 表示本次回答结束
 * @param model - 指定使用的模型名称，不传则由后端使用默认模型
 * @param think - 是否开启深度思考
 * @param signal - AbortSignal，传入后可随时中断请求
 * @throws 当 HTTP 响应状态非 2xx 时抛出错误；abort 时静默退出
 */
export const chatStream = async (
  messages: Pick<ChatMessage, 'role' | 'content' | 'images'>[],
  onChunk: (content: string, done: boolean, thinking?: string) => void,
  model?: string,
  think?: boolean,
  signal?: AbortSignal,
): Promise<void> => {
  const response = await fetch(`${API_BASE}/api/ai/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, think }),
    signal,
  })

  if (!response.ok) {
    throw new Error(`请求失败: ${response.status}`)
  }

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  // 用于拼接跨 chunk 的不完整 SSE 行
  let buffer = ''

  // abort 时主动取消 reader
  signal?.addEventListener('abort', () => { reader.cancel().catch(() => {}) })

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (signal?.aborted) break

    // 将二进制流解码为字符串并追加到缓冲区
    buffer += decoder.decode(value, { stream: true })
    // 按换行拆分，最后一段可能不完整，保留到下次
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      // SSE 格式：每行以 "data: " 开头
      if (!line.startsWith('data: ')) continue
      try {
        const data = JSON.parse(line.slice(6))
        onChunk(data.content, data.done, data.thinking || '')
      } catch {
        // 忽略格式异常的行，不中断流
      }
    }
  }
}

/**
 * 获取 Ollama 可用模型列表
 *
 * @returns 模型名称字符串数组，如 ['qwen2.5:32b']
 */
export const fetchModels = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE}/api/ai/models`)
  const json = await response.json()
  return (json.data as { name: string }[]).map((m) => m.name)
}
