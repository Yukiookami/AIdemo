<template>
  <div>
    <div class="header-sec">
      <slot name="header"></slot>
    </div>

    <div class="content-sec">
      <slot></slot>
    </div>

    <div class="footer-sec">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
