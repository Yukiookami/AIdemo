<!--
  @file AIChat/index.vue
  @description AI 对话页面入口组件
  负责组装各子组件，自身不包含业务逻辑，所有状态和操作均来自 useAIChat composable
-->
<script setup lang="ts">
import { useAIChat } from './composables/useAIChat'
import AIChatHeader from './components/AIChatHeader.vue'
import AIChatMessages from './components/AIChatMessages.vue'
import AIChatPresets from './components/AIChatPresets.vue'
import AIChatInput from './components/AIChatInput.vue'

const {
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
} = useAIChat()
</script>

<template>
  <!-- 页面最外层容器：全屏垂直布局 -->
  <div class="chat-page">
    <!-- 顶部栏：模型名称 + 清空按钮 -->
    <AIChatHeader :models="models" v-model:model="currentModel" @clear="clearMessages" />

    <!-- 消息列表区：占满剩余空间，内部可滚动 -->
    <AIChatMessages :messages="messages" />

    <!-- 预设提示词快捷按钮区 -->
    <AIChatPresets :presets="presets" :active-preset="activePreset" @select="usePreset" />

    <!-- 底部输入区：消息输入框 + 图片按钮 + 发送按钮 -->
    <AIChatInput
      v-model="inputText"
      :is-loading="isLoading"
      :pending-images="pendingImages"
      @send="sendMessage()"
      @add-image="(b64) => pendingImages.push(b64)"
      @remove-image="(idx) => pendingImages.splice(idx, 1)"
    />
  </div>
</template>

<style scoped lang="scss">
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f9fafb;
  overflow: hidden;
}
</style>
