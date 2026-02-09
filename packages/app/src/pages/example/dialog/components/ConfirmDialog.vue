<script setup lang="ts">
import { BaseButton } from '@myorg/shared/components'

defineProps<{
  title?: string
  message?: string
}>()

const emit = defineEmits<{
  (e: 'confirm', result: boolean): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <div class="mx-auto p-6 rounded-xl bg-white w-72 shadow-xl animate-fade-in dark:bg-gray-800">
    <h3 class="text-lg text-gray-900 font-bold mb-2 dark:text-white">
      {{ title || '提示' }}
    </h3>
    <p class="text-gray-600 mb-6 dark:text-gray-400">
      {{ message || '确定要执行操作吗？' }}
    </p>
    <div class="flex gap-2 justify-end">
      <BaseButton size="small" plain @click="emit('cancel')">
        取消
      </BaseButton>
      <BaseButton size="small" type="primary" @click="emit('confirm', true)">
        确定
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
