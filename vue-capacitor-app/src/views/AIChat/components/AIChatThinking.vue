<!--
  @file AIChatThinking.vue
  @description AI 思考过程展示组件

  行为逻辑：
  - streaming=true 时：展开显示滚动框，内容实时追加，自动滚到底部
  - streaming=false 且有 thinking 内容：折叠为单行，可点击展开/收起
-->
<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  /** 思考过程文本内容 */
  thinking: string
  /** 是否还在流式输出中 */
  streaming?: boolean
}>()

/** 滚动容器 ref */
const scrollRef = ref<HTMLElement | null>(null)

/** 折叠展开状态（仅在非流式时生效） */
const expanded = ref(false)

/** thinking 内容变化时自动滚到底部 */
watch(
  () => props.thinking,
  async () => {
    if (!props.streaming) return
    await nextTick()
    if (scrollRef.value) {
      scrollRef.value.scrollTop = scrollRef.value.scrollHeight
    }
  },
)
</script>

<template>
  <!-- 流式思考中：展开滚动框 -->
  <div v-if="props.streaming" class="thinking-box">
    <div class="thinking-status">
      <span class="thinking-dots"> <span></span><span></span><span></span> </span>
      <span class="thinking-label">思考中...</span>
    </div>
    <div ref="scrollRef" class="thinking-scroll">
      <span class="thinking-text">{{ thinking }}</span>
      <span class="thinking-cursor"></span>
    </div>
  </div>

  <!-- 思考完成：可折叠展示 -->
  <div v-else-if="props.thinking" class="thinking-done">
    <div class="thinking-done-header" @click="expanded = !expanded">
      <span class="thinking-done-icon">💭</span>
      <span class="thinking-done-label">已深度思考</span>
      <span class="thinking-done-arrow" :class="{ expanded }">›</span>
    </div>
    <div v-if="expanded" class="thinking-done-content">
      {{ thinking }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.thinking-box {
  width: 100%;
  margin-bottom: 8px;
  border-radius: 10px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  overflow: hidden;

  .thinking-status {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-bottom: 1px solid #e5e7eb;
    background: #f3f4f6;

    .thinking-label {
      font-size: 12px;
      color: #9ca3af;
      letter-spacing: 0.02em;
    }

    // 三个跳动的点
    .thinking-dots {
      display: flex;
      gap: 3px;
      align-items: center;

      span {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #d1d5db;
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

  .thinking-scroll {
    height: 96px; // 固定高度，约 4 行
    overflow-y: auto;
    padding: 8px 12px;

    // 隐藏滚动条（视觉更干净）
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }

    .thinking-text {
      font-size: 12.5px;
      color: #c4c8ce;
      line-height: 1.75;
      white-space: pre-wrap;
      word-break: break-word;
    }

    // 闪烁光标
    .thinking-cursor {
      display: inline-block;
      width: 1.5px;
      height: 13px;
      background: #d1d5db;
      margin-left: 1px;
      vertical-align: text-bottom;
      animation: cursor-blink 0.9s step-end infinite;
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

@keyframes cursor-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

// 思考完成后的折叠展示
.thinking-done {
  width: 100%;
  margin-bottom: 8px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  font-size: 12.5px;

  .thinking-done-header {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 12px;
    background: #f9fafb;
    cursor: pointer;
    user-select: none;

    &:active {
      background: #f3f4f6;
    }

    .thinking-done-icon {
      font-size: 13px;
    }

    .thinking-done-label {
      flex: 1;
      color: #9ca3af;
      font-size: 12px;
    }

    .thinking-done-arrow {
      color: #c4c8ce;
      font-size: 16px;
      line-height: 1;
      transition: transform 0.2s;
      transform: rotate(90deg);

      &.expanded {
        transform: rotate(270deg);
      }
    }
  }

  .thinking-done-content {
    padding: 8px 12px;
    background: #fff;
    color: #c4c8ce;
    line-height: 1.75;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 200px;
    overflow-y: auto;

    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
