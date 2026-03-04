/**
 * @file composables/useAIChat.ts
 * @description AIChat 模块的核心状态逻辑层（Composition API）
 *
 * 责任范围：
 *   - 维护展示用的消息列表（messages）
 *   - 管理输入框文本、加载状态、当前模型
 *   - 封装流式对话、预设词加载、清空对话等操作
 *   - 永久化模型选择到 localStorage
 */

import { ref, onMounted, watch } from 'vue'
import { chatStream, fetchModels } from '../service/aiService'
import type { ChatMessage } from '../types/index'
import { PRESETS, DEFAULT_SYSTEM_PROMPT } from './presets'

/** 第一次使用的默认模型（无 localStorage 记录时） */
const DEFAULT_MODEL = 'qwen3:latest'
/** localStorage 存储键名 */
const MODEL_STORAGE_KEY = 'ai_chat_last_model'

/**
 * AIChat 页面的组合式函数
 * 提供消息管理、流式对话、预设词等完整逻辑
 *
 * @returns 页面所需的响应式状态与操作方法
 */
export const useAIChat = () => {
  /** 界面展示的全部聊天消息（user + assistant，按时间顺序排列） */
  const messages = ref<ChatMessage[]>([])
  /** 输入框绑定值 */
  const inputText = ref('')
  /** 是否正在等待 AI 回复（防止重复提交） */
  const isLoading = ref(false)
  /** 当前选中的模型名，初始化时从 localStorage 读取 */
  const currentModel = ref(localStorage.getItem(MODEL_STORAGE_KEY) || DEFAULT_MODEL)
  /** Ollama 可用模型列表，初始化时将当前模型功能先设为备用 */
  const models = ref<string[]>([currentModel.value])
  /**
   * 当前激活的预设 system prompt
   * - null 表示无预设
   * - 发送时作为隐式的 { role: 'system' } 消息插入请求头部，不展示在界面消息列表里
   */
  const activePreset = ref<string | null>(null)

  /**
   * 用户尚未发送的待附图片列表（纯 base64 字符串，不含 data URI 前缀）
   * 发送后自动清空
   */
  const pendingImages = ref<string[]>([])

  /**
   * 监听模型切换，实时将最新选择写入 localStorage
   * 这样应用关闭后重新打开仍能记住上次使用的模型
   */
  watch(currentModel, (val) => {
    localStorage.setItem(MODEL_STORAGE_KEY, val)
  })

  /**
   * 组件挂载时拉取 Ollama 当前可用模型列表
   * - 拉取成功则更新 models
   * - 如果上次保存的模型不在列表里（模型已删除），自动切换到第一个可用模型
   * - 拉取失败时静默处理，保持默认模型不中断使用
   */
  onMounted(async () => {
    try {
      const list = await fetchModels()
      if (list.length > 0) {
        models.value = list
        // 如果上次保存的模型不在列表中，切换到第一个可用模型
        if (!list.includes(currentModel.value)) {
          currentModel.value = list[0]!
          localStorage.setItem(MODEL_STORAGE_KEY, currentModel.value)
        }
      }
    } catch {
      // 加载失败时保持默认模型，不中断使用
    }
  })

  const presets = PRESETS

  /**
   * 生成消息唯一 ID
   * 格式：时间戳-随机串
   *
   * @returns 唯一字符串 ID
   */
  const genId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

  /**
   * 发送消息并触发流式 AI 回复
   *
   * 流程：
   *   1. 取内容 → 清空输入框 → 加入 user 消息
   *   2. 向列表尾部插入空的 assistant 占位消息（streaming: true）
   *   3. 拼装请求消息数组（system + 全部历史）发送给后端
   *   4. 流式回调里逐块将 content / thinking 追加到占位消息
   *   5. done=true 时将 streaming 置为 false，界面封闭流式状态
   *
   * @param text - 可选，直接传入消息内容（用于预设词直接发送等场景）
   */
  const sendMessage = async (text?: string): Promise<void> => {
    const content = (text ?? inputText.value).trim()
    if (!content || isLoading.value) return

    inputText.value = ''
    isLoading.value = true

    // ---- 消息列表操作 ----

    // 将用户输入内容添加到展示列表
    // 若有待附加图片，一并存入消息（界面展示 + 发给模型）
    const imageSnapshot = pendingImages.value.length ? [...pendingImages.value] : undefined
    pendingImages.value = [] // 先清空，防止重复发送
    messages.value.push({
      id: genId(),
      role: 'user',
      content,
      images: imageSnapshot,
      createdAt: Date.now(),
    })

    // 插入一条空的 assistant 占位消息，streaming=true 表示正在接收内容
    // 它会在流式回调里被逐步填充
    messages.value.push({
      id: genId(),
      role: 'assistant',
      content: '',
      createdAt: Date.now(),
      streaming: true,
    })

    // 记录占位消息的数组下标
    // 必须通过下标直接修改，而不是保存对象引用
    // （Vue 响应式代理需要通过 messages.value[i] 才能触发视图更新）
    const assistantIndex = messages.value.length - 1

    try {
      // ---- 拼装发送给后端的消息数组 ----
      const requestMessages: { role: string; content: string }[] = []

      // 固定注入默认 Shiro system prompt（始终生效）
      requestMessages.push({ role: 'system', content: DEFAULT_SYSTEM_PROMPT })

      // 如果用户还额外激活了某个预设（翻译等任务型），追加在后面叠加生效
      if (activePreset.value) {
        requestMessages.push({ role: 'system', content: activePreset.value })
      }

      // 将界面展示的全部历史消息一并发出（过滤掉还在流式中的占位条）
      // 这就是 AI 有记忆的原因：每次都把完整历史传给模型
      // images 字段（若有）也同步传出，供多模态模型理解图片
      requestMessages.push(
        ...messages.value
          .filter((m) => !m.streaming)
          .map(({ role, content, images }) => ({ role, content, ...(images ? { images } : {}) })),
      )
      // 发起流式请求
      // 回调参数：chunk=当前内容片段  done=是否完成  thinking=思考文字（思考型模型才有）
      await chatStream(
        requestMessages as Parameters<typeof chatStream>[0],
        (chunk, done, thinking) => {
          // 每个 chunk 追加到占位消息的 content
          messages.value[assistantIndex]!.content += chunk
          // 思考文字同样逐片段追加
          if (thinking)
            messages.value[assistantIndex]!.thinking =
              (messages.value[assistantIndex]!.thinking ?? '') + thinking
          // 模型返回 done=true 表示本次回复结束，清除 streaming 标志
          if (done) messages.value[assistantIndex]!.streaming = false
        },
        currentModel.value,
      )
    } catch (err) {
      // 网络错误、超时等异常情况：将错误信息展示在占位消息里
      messages.value[assistantIndex]!.content = `请求失败：${(err as Error).message}`
      messages.value[assistantIndex]!.streaming = false
    } finally {
      // 无论成功还是失败，都解除加载状态
      isLoading.value = false
    }
  }

  /**
   * 切换预设 system prompt 的激活状态
   * - 点击未激活项：激活它
   * - 再次点击已激活项：取消激活（切换效果）
   *
   * @param prompt - 预设的提示词内容
   */
  const usePreset = (prompt: string): void => {
    activePreset.value = activePreset.value === prompt ? null : prompt
  }

  /**
   * 清空当前所有对话消息并重置预设
   * - 响应界面清空按鈕
   * - 同时取消已激活的预设，避免新对话被上一次的预设影响
   */
  const clearMessages = (): void => {
    messages.value = []
    activePreset.value = null
  }

  return {
    messages,
    inputText,
    isLoading,
    currentModel,
    models,
    presets,
    activePreset,
    pendingImages,
    sendMessage,
    usePreset,
    clearMessages,
  }
}
