<!--
  @file AIChatBubble.vue
  @description 单条消息气泡组件
  根据 role 区分左右布局：user 消息居右（蓝色），assistant 消息居左（灰色）
  流式输出中显示闪烁光标动画
-->
<script setup lang="ts">
import type { ChatMessage } from '../types/index'
import AIChatThinking from './AIChatThinking.vue'

defineProps<{ message: ChatMessage }>()
</script>

<template>
  <!-- 气泡容器：根据 role 动态切换居左/居右 -->
  <div class="bubble-wrapper" :class="message.role">
    <!-- AI 头像：仅 assistant 消息左侧显示 -->
    <div v-if="message.role === 'assistant'" class="avatar ai-avatar">
      <img src="/icon/AI_icon.png" alt="AI" class="avatar-img" />
    </div>

    <!-- assistant 消息右侧：思考过程 + 气泡 -->
    <div v-if="message.role === 'assistant'" class="assistant-body">
      <!-- 有 thinking 内容时显示：流式中展开，完成后可折叠 -->
      <AIChatThinking
        v-if="message.streaming || message.thinking"
        :thinking="message.thinking ?? ''"
        :streaming="message.streaming"
      />
      <!-- 气泡主体 -->
      <div class="bubble">
        <span class="content">{{ message.content }}</span>
        <span v-if="message.streaming" class="cursor"></span>
      </div>
    </div>

    <!-- user 气泡 -->
    <div v-else class="bubble">
      <!-- 若消息附带图片，展示缩略图 -->
      <div v-if="message.images?.length" class="bubble-images">
        <img
          v-for="(img, idx) in message.images"
          :key="idx"
          :src="`data:image/jpeg;base64,${img}`"
          class="bubble-img"
        />
      </div>
      <span class="content">{{ message.content }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bubble-wrapper {
  display: flex;
  align-items: flex-end;
  margin-bottom: 16px;
  gap: 8px;

  &.user {
    justify-content: flex-end;

    .bubble {
      background: #2563eb;
      color: #fff;
      border-bottom-right-radius: 4px;
    }
  }

  &.assistant {
    justify-content: flex-start;

    .assistant-body {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
      min-width: 0;
    }

    .bubble {
      background: #f3f4f6;
      color: #1f2937;
      border-bottom-left-radius: 4px;
      max-width: 100%;
    }
  }

  // 头像通用样式
  .avatar {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    &.ai-avatar {
      background: transparent;
      box-shadow: none;
    }

    .avatar-img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .bubble {
    // user 气泡限宽，assistant 气泡通过 .assistant-body 控制
    max-width: 72%;
    padding: 10px 14px;
    border-radius: 16px;
    font-size: 15px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;

    .cursor {
      display: inline-block;
      width: 2px;
      height: 1em;
      background: currentColor;
      opacity: 0.6;
      margin-left: 2px;
      vertical-align: text-bottom;
      animation: blink 0.8s step-end infinite;
    }

    // user 气泡内的图片区域
    .bubble-images {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 6px;

      .bubble-img {
        max-width: 160px;
        max-height: 160px;
        border-radius: 8px;
        object-fit: cover;
        display: block;
      }
    }
  }
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
