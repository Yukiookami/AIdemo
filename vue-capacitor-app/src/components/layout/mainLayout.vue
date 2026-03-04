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
  right: 0;
  bottom: 0;
}
</style>
