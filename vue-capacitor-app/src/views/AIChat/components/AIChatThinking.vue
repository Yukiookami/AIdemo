<!--
  @file AIChatThinking.vue
  @description AI 思考过程展示组件

  行为逻辑：
  - 仅在 streaming=true（思考阶段）时显示
  - 显示一个固定高度的遗月框，内容区浅灰色文字不断流式追加
  - 每次 thinking prop 变化时自动滚到底部，确保最新内容始终可见
  - streaming 变为 false 后整个组件由父组件 v-if 控制隐藏，正文气泡开始显示
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
  <!-- 思考中：显示滚动框；思考完成后整体隐藏 -->
  <div v-if="props.streaming" class="thinking-box">
    <!-- 顶部状态栏 -->
    <div class="thinking-status">
      <span class="thinking-dots"> <span></span><span></span><span></span> </span>
      <span class="thinking-label">思考中...</span>
    </div>
    <!-- 固定高度滚动文字区 -->
    <div ref="scrollRef" class="thinking-scroll">
      <span class="thinking-text">{{ thinking }}</span>
      <span class="thinking-cursor"></span>
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
</style>
