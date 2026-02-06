<script setup lang="ts">
import { computed } from 'vue'
import { Button as VanButton } from 'vant'

/**
 * BaseButton 组件 Props
 */
export interface BaseButtonProps {
  /** 按钮类型 */
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'default'
  /** 按钮尺寸 */
  size?: 'large' | 'normal' | 'small' | 'mini'
  /** 是否为块级元素 */
  block?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示加载状态 */
  loading?: boolean
  /** 按钮图标 */
  icon?: string
  /** 自定义类名 */
  customClass?: string
}

const props = withDefaults(defineProps<BaseButtonProps>(), {
  type: 'default',
  size: 'normal',
  block: false,
  disabled: false,
  loading: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClass = computed(() => [
  'base-button',
  props.customClass,
])

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <VanButton
    :class="buttonClass"
    :type="type"
    :size="size"
    :block="block"
    :disabled="disabled"
    :loading="loading"
    :icon="icon"
    @click="handleClick"
  >
    <slot />
  </VanButton>
</template>

<style scoped>
.base-button {
  --van-button-border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.base-button:active:not(:disabled) {
  transform: scale(0.98);
}
</style>
