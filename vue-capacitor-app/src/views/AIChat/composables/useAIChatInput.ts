/**
 * @file composables/useAIChatInput.ts
 * @description AIChatInput 组件的逻辑层
 *
 * 责任范围：
 *   - textarea 自动撑高（最多 3 行）
 *   - 键盘快捷键处理（Enter 发送）
 *   - 图片文件读取转 base64
 *   - 拍照 / 相册 两个 file input 的触发逻辑
 */

import { ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'

/**
 * 将 FileList 中的所有图片逐一读取为纯 base64 字符串
 * Ollama 接受不含 data URI 前缀的纯 base64
 *
 * @param files - 用户选择的文件列表
 * @param onBase64 - 每张图片读取完成后的回调，传入纯 base64 字符串
 */
export const readFilesAsBase64 = (files: FileList, onBase64: (base64: string) => void): void => {
  for (const file of files) {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      // 去掉 "data:image/jpeg;base64," 前缀，只留纯 base64
      const base64 = result.split(',')[1]
      if (base64) onBase64(base64)
    }
    reader.readAsDataURL(file)
  }
}

/**
 * AIChatInput 组件逻辑 composable
 *
 * @param emit - 组件的 emit 函数，用于触发 send / add-image 事件
 */
export const useAIChatInput = (emit: (event: 'send' | 'add-image', ...args: unknown[]) => void) => {
  /** van-field 组件实例引用（van-field 已通过 autosize 属性自动处理高度） */
  const textareaRef = ref<ComponentPublicInstance | null>(null)
  /** 隐藏的拍照 input（iOS 直接调起相机，不进相册） */
  const cameraInputRef = ref<HTMLInputElement | null>(null)
  /** 隐藏的相册选图 input（支持多选） */
  const galleryInputRef = ref<HTMLInputElement | null>(null)

  /**
   * 高度自适应由 van-field 的 autosize 属性处理，此函数保留为空实现
   * 保持接口兼容，外部调用不出错
   */
  const autoResize = (): void => {
    /* van-field autosize 已自动处理 */
  }

  /** 重置高度：van-field 自动处理，此处为空实现 */
  const resetHeight = (): void => {
    /* van-field autosize 已自动处理 */
  }

  /** 点击发送按钮 */
  const onSendClick = (): void => {
    emit('send')
    resetHeight()
  }

  /**
   * 键盘事件：Enter 发送，Shift+Enter 换行
   */
  const onKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      emit('send')
      resetHeight()
    }
  }

  /** 打开相机（iOS 直接调起系统相机，不显示相册） */
  const openCamera = (): void => {
    cameraInputRef.value?.click()
  }

  /** 打开相册选图（支持多选） */
  const openGallery = (): void => {
    galleryInputRef.value?.click()
  }

  /**
   * file input change 事件处理器
   * 将选中的图片全部读取为 base64 后逐一触发 add-image 事件
   */
  const onFileChange = (e: Event): void => {
    const input = e.target as HTMLInputElement
    const files = input.files
    if (files && files.length > 0) {
      readFilesAsBase64(files, (base64) => emit('add-image', base64))
    }
    // 清空 value，允许用户重复选择同一张图片
    input.value = ''
  }

  return {
    textareaRef,
    cameraInputRef,
    galleryInputRef,
    autoResize,
    onSendClick,
    onKeydown,
    openCamera,
    openGallery,
    onFileChange,
  }
}
