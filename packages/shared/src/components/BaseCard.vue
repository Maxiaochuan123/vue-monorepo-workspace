<script setup lang="ts">
import { computed } from 'vue'

/**
 * BaseCard 组件 Props
 */
export interface BaseCardProps {
  /** 卡片标题 */
  title?: string
  /** 卡片描述 */
  description?: string
  /** 是否显示边框 */
  bordered?: boolean
  /** 是否显示阴影 */
  shadow?: boolean | 'hover'
  /** 内边距大小 */
  padding?: 'none' | 'small' | 'medium' | 'large'
  /** 自定义类名 */
  customClass?: string
}

const props = withDefaults(defineProps<BaseCardProps>(), {
  bordered: true,
  shadow: 'hover',
  padding: 'medium',
})

const cardClass = computed(() => [
  'base-card',
  {
    'base-card--bordered': props.bordered,
    'base-card--shadow': props.shadow === true,
    'base-card--shadow-hover': props.shadow === 'hover',
    [`base-card--padding-${props.padding}`]: true,
  },
  props.customClass,
])
</script>

<template>
  <div :class="cardClass">
    <div v-if="title || $slots.header" class="base-card__header">
      <slot name="header">
        <h3 v-if="title" class="base-card__title">{{ title }}</h3>
        <p v-if="description" class="base-card__description">{{ description }}</p>
      </slot>
    </div>
    <div class="base-card__body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="base-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.base-card {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.base-card--bordered {
  border: 1px solid #ebeef5;
}

.base-card--shadow {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.base-card--shadow-hover:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.base-card--padding-none .base-card__body {
  padding: 0;
}

.base-card--padding-small .base-card__body {
  padding: 12px;
}

.base-card--padding-medium .base-card__body {
  padding: 16px;
}

.base-card--padding-large .base-card__body {
  padding: 24px;
}

.base-card__header {
  padding: 16px 16px 0;
}

.base-card__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.base-card__description {
  margin: 8px 0 0;
  font-size: 14px;
  color: #909399;
}

.base-card__footer {
  padding: 0 16px 16px;
  border-top: 1px solid #ebeef5;
  margin-top: 16px;
  padding-top: 16px;
}
</style>
