<!--
  @file AIChat/index.vue
  @description AI 对话页面入口组件
  负责组装各子组件，自身不包含业务逻辑，所有状态和操作均来自 useAIChat composable
-->
<script setup lang="ts">
import { useAIChat } from './composables/useAIChat'
import AIChatLayout from './components/AIChatLayout.vue'
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
  <AIChatLayout>
    <!-- 顶部栏 -->
    <template #header>
      <AIChatHeader :models="models" v-model:model="currentModel" @clear="clearMessages" />
    </template>

    <!-- 消息列表（占满剩余空间） -->
    <AIChatMessages :messages="messages" />

    <!-- 底部：预设 + 输入框 -->
    <template #footer>
      <AIChatPresets :presets="presets" :active-preset="activePreset" @select="usePreset" />
      <AIChatInput
        v-model="inputText"
        :is-loading="isLoading"
        :pending-images="pendingImages"
        @send="sendMessage()"
        @add-image="(b64) => pendingImages.push(b64)"
        @remove-image="(idx) => pendingImages.splice(idx, 1)"
      />
    </template>
  </AIChatLayout>
</template>

