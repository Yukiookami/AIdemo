<!--
  @file AIChatMessages.vue
  @description 消息列表组件
  展示所有对话气泡，messages 变化时自动滚动到底部
  列表为空时显示引导文字
-->
<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { ChatMessage } from '../types/index'
import AIChatBubble from './AIChatBubble.vue'

const props = defineProps<{
  messages: ChatMessage[]
}>()

/** 滚动容器的 DOM 引用 */
const scrollContainer = ref<HTMLElement | null>(null)

/**
 * 监听 messages 变化，每次有新内容时自动滚动到底部
 * deep: true 确保消息内部内容（流式 chunk）变化时也能触发
 */
watch(
  () => props.messages,
  async () => {
    await nextTick()
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
    }
  },
  { deep: true },
)
</script>

<template>
  <!-- 消息滚动容器，内部自动滚动到最新消息 -->
  <div class="messages" ref="scrollContainer">
    <!-- 无消息时的占位提示 -->
    <div v-if="messages.length === 0" class="empty">
      <p>开始一段新的对话吧 ✨</p>
    </div>
    <!-- 逐条渲染气泡，使用 id 作为 key -->
    <AIChatBubble v-for="msg in messages" :key="msg.id" :message="msg" />
  </div>
</template>

<style scoped lang="scss">
.messages {
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;
  /* 覆盖全局 manipulation，恢复纵向滚动 */
  touch-action: pan-y;
  padding: 16px;
  display: flex;
  flex-direction: column;

  .empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    font-size: 15px;
  }
}
</style>
