<!--
  @file AIChatInput.vue
  @description 底部输入区组件
  - 📎 按钮点击后弹出 Vant ActionSheet，让用户选择「拍照」或「从相册选择」
  - 两个隐藏 file input 分别对应拍照（capture）和相册（multiple）
  - 图标使用 Iconify，消除原生 focus 蓝框
  - 输入框使用 van-field（autosize），图标按钮/发送按钮使用 van-button
  - 复杂逻辑抽取到 composables/useAIChatInput.ts
-->
<script setup lang="ts">
import { ref } from 'vue'
import { ActionSheet, Button as VanButton, Field as VanField } from 'vant'
import { Icon } from '@iconify/vue'
import attachmentLine from '@iconify-icons/mingcute/attachment-line'
import sendPlaneFill from '@iconify-icons/mingcute/send-plane-fill'
import closeCircleFill from '@iconify-icons/mingcute/close-circle-fill'
import { useAIChatInput } from '../composables/useAIChatInput'

defineProps<{
  modelValue: string
  isLoading: boolean
  pendingImages: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  send: []
  'add-image': [base64: string]
  'remove-image': [index: number]
}>()

const {
  textareaRef,
  cameraInputRef,
  galleryInputRef,
  onSendClick,
  onKeydown,
  openCamera,
  openGallery,
  onFileChange,
} = useAIChatInput(emit as Parameters<typeof useAIChatInput>[0])

/** ActionSheet 显示状态 */
const showActionSheet = ref(false)

/** ActionSheet 选项 */
const actions = [
  { name: '拍照', subname: '直接调起相机', value: 'camera' },
  { name: '从相册选择', subname: '支持多张', value: 'gallery' },
]

const onActionSelect = (action: { value: string }) => {
  showActionSheet.value = false
  if (action.value === 'camera') openCamera()
  else openGallery()
}
</script>

<template>
  <div class="input-wrapper">
    <!-- 图片预览横向滚动行 -->
    <div v-if="pendingImages.length" class="image-preview-row">
      <div v-for="(img, idx) in pendingImages" :key="idx" class="preview-item">
        <img :src="`data:image/jpeg;base64,${img}`" class="preview-thumb" />
        <VanButton class="remove-btn" icon-prefix="" round @click="emit('remove-image', idx)">
          <Icon :icon="closeCircleFill" width="18" />
        </VanButton>
      </div>
    </div>

    <!-- 输入行 -->
    <div class="input-area">
      <!-- 隐藏 file inputs -->
      <input
        ref="cameraInputRef"
        type="file"
        accept="image/*"
        capture="environment"
        style="display: none"
        @change="onFileChange"
      />
      <input
        ref="galleryInputRef"
        type="file"
        accept="image/*"
        multiple
        style="display: none"
        @change="onFileChange"
      />

      <!-- 附图按钮（van-button icon 模式） -->
      <VanButton class="icon-btn" round :disabled="isLoading" @click="showActionSheet = true">
        <Icon :icon="attachmentLine" width="22" />
      </VanButton>

      <!-- 输入框（van-field autosize，最多 3 行） -->
      <VanField
        ref="textareaRef"
        class="input-field"
        type="textarea"
        :model-value="modelValue"
        placeholder="输入消息…"
        :autosize="{ minHeight: 22, maxHeight: 72 }"
        :disabled="isLoading"
        rows="1"
        @update:model-value="(val: string) => emit('update:modelValue', val)"
        @keydown="onKeydown"
      />

      <!-- 发送按钮（van-button） -->
      <VanButton
        class="send-btn"
        round
        :disabled="(!modelValue.trim() && !pendingImages.length) || isLoading"
        @click="onSendClick"
      >
        <span v-if="isLoading" class="loading-dots"><i /><i /><i /></span>
        <Icon v-else :icon="sendPlaneFill" width="20" />
      </VanButton>
    </div>

    <!-- Vant ActionSheet：拍照 / 相册 -->
    <ActionSheet
      v-model:show="showActionSheet"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="onActionSelect"
    />
  </div>
</template>

<style scoped lang="scss">
.input-wrapper {
  background: #fff;
  border-top: 1px solid #f0f0f0;

  .image-preview-row {
    display: flex;
    gap: 8px;
    padding: 10px 16px 0;
    overflow-x: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }

    .preview-item {
      position: relative;
      flex-shrink: 0;

      .preview-thumb {
        width: 64px;
        height: 64px;
        object-fit: cover;
        border-radius: 10px;
        border: 1px solid #e5e7eb;
        display: block;
      }

      // 覆盖 van-button 样式，纯透明删除角标
      .remove-btn {
        position: absolute;
        top: -6px;
        right: -6px;
        width: 20px !important;
        height: 20px !important;
        min-width: unset !important;
        padding: 0 !important;
        border: none !important;
        background: transparent !important;
        color: #1f2937;
        box-shadow: none !important;

        :deep(.van-button__content) {
          padding: 0;
          line-height: 1;
        }
      }
    }
  }

  .input-area {
    display: flex;
    align-items: flex-end;
    gap: 6px;
    padding: 10px 12px 10px;

    // 附图 icon 按钮
    .icon-btn {
      flex-shrink: 0;
      width: 40px !important;
      height: 40px !important;
      padding: 0 !important;
      border: none !important;
      background: transparent !important;
      color: #6b7280;
      box-shadow: none !important;

      &:not(:disabled):active {
        background: #f3f4f6 !important;
      }

      :deep(.van-button__content) {
        padding: 0;
        line-height: 1;
      }
    }

    // van-field 输入框样式覆盖
    .input-field {
      flex: 1;
      padding: 0 !important;

      :deep(.van-field__body) {
        border: 1.5px solid #e5e7eb;
        border-radius: 20px;
        padding: 9px 14px;
        background: #f9fafb;
        transition:
          border-color 0.15s,
          background 0.15s;
      }

      :deep(.van-field__control) {
        font-size: 15px;
        line-height: 1.5;
        color: #111827;
        caret-color: #2563eb;
        // 隐藏原始滚动条
        overflow-y: hidden;

        &:disabled {
          color: #9ca3af;
          -webkit-text-fill-color: #9ca3af;
        }
      }

      // 聚焦时边框变蓝
      &:deep(.van-field__body:focus-within) {
        border-color: #2563eb;
        background: #fff;
      }
    }

    // 发送按钮
    .send-btn {
      flex-shrink: 0;
      width: 40px !important;
      height: 40px !important;
      padding: 0 !important;
      background: #2563eb !important;
      border: none !important;
      color: #fff;

      &:not(:disabled):active {
        transform: scale(0.92);
      }

      &:disabled {
        background: #bfdbfe !important;
        opacity: 1 !important;
      }

      :deep(.van-button__content) {
        padding: 0;
        line-height: 1;
      }

      // 三点加载动画
      .loading-dots {
        display: flex;
        gap: 3px;
        align-items: center;

        i {
          display: block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #fff;
          animation: dot-bounce 1.2s ease-in-out infinite;

          &:nth-child(2) {
            animation-delay: 0.2s;
          }
          &:nth-child(3) {
            animation-delay: 0.4s;
          }
        }
      }
    }
  }
}

@keyframes dot-bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  40% {
    transform: translateY(-4px);
    opacity: 1;
  }
}
</style>
