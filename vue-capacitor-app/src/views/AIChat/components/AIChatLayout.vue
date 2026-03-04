<!--
  @file AIChatLayout.vue
  @description AI 对话页布局容器
  负责全屏高度控制和 header / content / footer 三区域的 flex 布局
  - header slot：固定高度，不伸缩
  - default slot（content）：flex:1，占满剩余空间，内部可滚动
  - footer slot：固定高度，不伸缩
-->
<template>
  <div class="chat-layout">
    <div class="chat-layout__header">
      <slot name="header" />
    </div>

    <div class="chat-layout__content">
      <slot />
    </div>

    <div class="chat-layout__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.chat-layout {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: env(safe-area-inset-top);
  bottom: 0;
  left: 0;
  right: 0;
  background: #f9fafb;
  overflow: hidden;
}

.chat-layout__header,
.chat-layout__footer {
  flex-shrink: 0;
  width: 100%;
}

.chat-layout__content {
  flex: 1 1 0;
  min-height: 0;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
