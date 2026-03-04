<!--
  @file AIChatLayout.vue
  @description AI 对话页布局容器
  使用 JS 动态注入的 --vh 变量 + -webkit-fill-available 修复 iOS 真机视口偏差。
  - header slot：sticky 顶部，固定高度
  - default slot（content）：剩余高度，内部可滚动
  - footer slot：sticky 底部，高度自适应
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

<style scoped>
.chat-layout {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f9fafb;
}

.chat-layout__header {
  flex-shrink: 0;
  width: 100%;
  /* 顶部安全区：让 header 背景延伸到刘海/动态岛后面 */
  padding-top: env(safe-area-inset-top);
  background: #fff;
  box-sizing: border-box;
}

.chat-layout__content {
  flex: 1 1 0;
  min-height: 0;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.chat-layout__footer {
  flex-shrink: 0;
  width: 100%;
  /* 底部安全区：确保 input 在 home indicator 上方可点击 */
  padding-bottom: env(safe-area-inset-bottom);
  background: #fff;
  box-sizing: border-box;
}
</style>
