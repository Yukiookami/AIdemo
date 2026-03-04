/**
 * @file types/index.ts
 * @description AIChat 模块的公共类型定义
 * 包含消息角色、消息体、预设提示词等核心数据结构
 */

/** 消息角色：用户 / AI助手 / 系统 */
export type MessageRole = 'user' | 'assistant' | 'system'

/**
 * 单条聊天消息
 */
export interface ChatMessage {
  /** 消息唯一标识 */
  id: string
  /** 消息角色 */
  role: MessageRole
  /** 消息文本内容 */
  content: string
  /** 附带的图片列表，纯 base64 字符串（不含 data:image/...;base64, 前缀） */
  images?: string[]
  /** 思考过程（支持 thinking 的模型才会有） */
  thinking?: string
  /** 消息创建时间戳（ms） */
  createdAt: number
  /** assistant 消息是否还在流式输出中 */
  streaming?: boolean
}

/**
 * 预设提示词条目
 */
export interface PresetPrompt {
  /** 按钮显示文字（含 emoji） */
  label: string
  /** 点击后填入输入框的提示词内容 */
  prompt: string
}
