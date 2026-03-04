<!--
  @file AIChatHeader.vue
  @description 顶部标题栏组件
  展示当前模型名称，提供清空对话按钮
  使用 Vant DropdownMenu 替换原生 select，van-button 替换原生 button
-->
<script setup lang="ts">
import { computed } from 'vue'
import { DropdownMenu, DropdownItem, Button as VanButton } from 'vant'

const props = defineProps<{ model: string; models: string[] }>()
const emit = defineEmits<{ 'update:model': [value: string]; clear: [] }>()

/** 将 models 数组转为 Vant DropdownItem 所需的 options 格式 */
const modelOptions = computed(() => props.models.map((m) => ({ text: m, value: m })))

/** 双向绑定当前选中模型（DropdownItem 需要可写的 ref/computed） */
const selectedModel = computed({
  get: () => props.model,
  set: (val: string) => emit('update:model', val),
})
</script>

<template>
  <!-- 顶部栏：左侧标题，右侧模型下拉 + 清空按钮 -->
  <header class="header">
    <!-- 左侧：图标 + 标题文字 -->
    <div class="title">
      <img src="/icon/AI_icon.png" alt="AI" class="header-icon" />
      <span class="name">AI Shiro Demo</span>
    </div>
    <!-- 右侧：Vant 下拉菜单 + Vant 清空按钮 -->
    <div class="right">
      <!-- Vant DropdownMenu：点击展开模型列表 -->
      <DropdownMenu class="model-dropdown">
        <DropdownItem v-model="selectedModel" :options="modelOptions" />
      </DropdownMenu>
      <!-- Vant 清空按钮 -->
      <VanButton size="small" plain class="clear-btn" @click="emit('clear')"> 清空 </VanButton>
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

    // 覆盖 Vant DropdownMenu 默认样式，使其紧凑
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
      // title 本身不截断，让箭头伪元素可以正常显示
      :deep(.van-dropdown-menu__title) {
        font-size: 12px;
        color: #374151;
        padding: 0 24px 0 10px;
        overflow: visible;
        white-space: nowrap;
      }
      // 文字内容用单独的 span 截断（Vant 内部会渲染 span）
      :deep(.van-dropdown-menu__title span) {
        display: inline-block;
        max-width: 110px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
      }
      // 只改箭头颜色，位置/形状交给 Vant 原始样式处理
      :deep(.van-dropdown-menu__title::after) {
        border-color: transparent transparent #374151 #374151;
      }
    }

    // 覆盖 Vant Button 默认样式
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
