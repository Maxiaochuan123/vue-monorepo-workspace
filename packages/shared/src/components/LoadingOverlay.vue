<script setup lang="ts">
import { Loading as VanLoading, Overlay as VanOverlay } from 'vant'

interface LoadingOverlayProps {
  /** 是否显示 */
  show: boolean
  /** 加载文本 */
  text?: string
  /** 是否全屏 */
  fullscreen?: boolean
  /** 背景透明度 */
  opacity?: number
}

withDefaults(defineProps<LoadingOverlayProps>(), {
  text: '加载中...',
  fullscreen: false,
  opacity: 0.7,
})
</script>

<template>
  <VanOverlay
    :show="show"
    :custom-style="{
      backgroundColor: `rgba(255, 255, 255, ${opacity})`,
      position: fullscreen ? 'fixed' : 'absolute',
    }"
    :z-index="1000"
  >
    <div class="loading-overlay__content">
      <VanLoading type="spinner" color="#1989fa" size="36px" />
      <span v-if="text" class="loading-overlay__text">{{ text }}</span>
    </div>
  </VanOverlay>
</template>

<style scoped>
.loading-overlay__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
}

.loading-overlay__text {
  font-size: 14px;
  color: #606266;
}
</style>
