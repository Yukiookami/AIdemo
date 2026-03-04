<script setup lang="ts">
import { RouterView } from 'vue-router'
import MainLayout from './components/layout/mainLayout.vue'
</script>

<template>
  <MainLayout>
    <RouterView />
  </MainLayout>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  /* 禁止双击缩放，保留单指滚动 */
  touch-action: manipulation;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>
