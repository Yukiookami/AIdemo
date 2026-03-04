<!--
  @file AIChatPresets.vue
  @description 预设提示词快捷按钮组件
  水平滚动展示预设列表，点击后向父组件抛出 select 事件并传入提示词内容
-->
<script setup lang="ts">
import { ref } from 'vue'
import type { PresetPrompt } from '../types/index'

defineProps<{
  presets: PresetPrompt[]
  /** 当前激活的 prompt，用于高亮对应标签 */
  activePreset?: string | null
}>()
/** 向父组件抛出选中的提示词内容 */
const emit = defineEmits<{ select: [prompt: string] }>()

/** 按下时记录的 X 坐标，用于区分点击和拖动 */
const pointerStartX = ref(0)
/** 拖动判定阈值（px），超过此距离视为滑动，不触发选中 */
const DRAG_THRESHOLD = 6

const onPointerDown = (e: PointerEvent): void => {
  pointerStartX.value = e.clientX
}

const onPointerUp = (e: PointerEvent, prompt: string): void => {
  if (Math.abs(e.clientX - pointerStartX.value) > DRAG_THRESHOLD) return
  emit('select', prompt)
}
</script>

<template>
  <!-- 预设词水平滚动条，touch-action 限定为横向，避免 tag 内部拦截手势 -->
  <div class="presets">
    <span
      v-for="item in presets"
      :key="item.label"
      class="preset-tag"
      :class="{ active: activePreset === item.prompt }"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp($event, item.prompt)"
    >
      {{ item.label }}
    </span>
  </div>
</template>

<style scoped lang="scss">
.presets {
  display: flex;
  gap: 8px;
  padding: 8px 16px;
  overflow-x: auto;
  scrollbar-width: none;
  // 明确声明横向滚动，覆盖全局的 manipulation
  touch-action: pan-x;

  &::-webkit-scrollbar {
    display: none;
  }

  .preset-tag {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    padding: 0 12px;
    height: 30px;
    border-radius: 999px;
    border: 1px solid #e5e7eb;
    background: #fff;
    color: #374151;
    font-size: 13px;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    // 子元素也允许横向滑动穿透
    touch-action: pan-x;
    -webkit-tap-highlight-color: transparent;
    transition:
      background 0.15s,
      color 0.15s,
      border-color 0.15s;

    &.active {
      background: #eff6ff;
      color: #2563eb;
      border-color: #2563eb;
    }
  }
}
</style>
