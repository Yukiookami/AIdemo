<!--
  @file AIChatHeader.vue
  @description 顶部标题栏组件
  展示当前模型名称，提供清空对话按钮
  使用 Vant DropdownMenu + teleport-to="body"，确保弹出层不受 fixed 层叠上下文影响
-->
<script setup lang="ts">
import { computed } from 'vue'
import { DropdownMenu, DropdownItem, Button as VanButton } from 'vant'

const props = defineProps<{ model: string; models: string[] }>()
const emit = defineEmits<{ 'update:model': [value: string]; clear: [] }>()

const modelOptions = computed(() => props.models.map((m) => ({ text: m, value: m })))

const selectedModel = computed({
  get: () => props.model,
  set: (val: string) => emit('update:model', val),
})
</script>

<template>
  <header class="header">
    <div class="title">
      <img src="/icon/AI_icon.png" alt="AI" class="header-icon" />
      <span class="name">Shiro AI Chat</span>
    </div>
    <div class="right">
      <DropdownMenu class="model-dropdown">
        <!-- teleport-to="body" 让弹出层挂到 body，不受 fixed 层叠上下文影响 -->
        <DropdownItem v-model="selectedModel" :options="modelOptions" teleport-to="body" />
      </DropdownMenu>
      <VanButton size="small" plain class="clear-btn" @click="emit('clear')">清空</VanButton>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;

  .title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 17px;
    font-weight: 600;
    color: #111827;

    .header-icon {
      $icon-size: 32px;
      width: $icon-size;
      height: $icon-size;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .right {
    display: flex;
    align-items: center;
    gap: 8px;

    .model-dropdown {
      min-width: 148px;
      max-width: 180px;

      :deep(.van-dropdown-menu__bar) {
        height: 32px;
        background: #f3f4f6;
        border-radius: 8px;
        box-shadow: none;
        border: 1px solid #e5e7eb;
      }
      :deep(.van-dropdown-menu__title) {
        font-size: 12px;
        color: #374151;
        padding: 0 24px 0 10px;
        overflow: visible;
        white-space: nowrap;
      }
      :deep(.van-dropdown-menu__title span) {
        display: inline-block;
        max-width: 110px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
      }
      :deep(.van-dropdown-menu__title::after) {
        border-color: transparent transparent #374151 #374151;
      }
    }

    .clear-btn {
      font-size: 13px;
      height: 32px;
      padding: 0 12px;
      border-radius: 8px;
      border-color: #e5e7eb;
      color: #6b7280;
    }
  }
}
</style>
