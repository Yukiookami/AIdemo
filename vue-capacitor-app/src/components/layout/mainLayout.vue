<template>
  <div class="layout-root">
    <slot></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.layout-root {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
}
</style>
