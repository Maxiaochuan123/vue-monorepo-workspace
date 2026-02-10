<script setup lang="ts">
import { BaseButton } from '@myorg/shared/components'

const props = defineProps<{
  title?: string
}>()
const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'close'): void
  (e: 'customAction', data: string): void
}>()
// 使用 defineModel 简化双向绑定
const nickname = defineModel<string>('nickname', { default: '' })
const email = defineModel<string>('email', { default: '' })

function handleCustomAction() {
  emit('customAction', 'clicked-help')
}
</script>

<template>
  <div class="animate-slide-up mx-auto p-6 rounded-xl bg-white w-80 shadow-xl dark:bg-gray-800">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-lg text-gray-900 font-bold dark:text-white">
        {{ props.title || '修改信息' }}
      </h3>
      <button
        class="text-xs text-blue-500 hover:underline"
        @click="handleCustomAction"
      >
        帮助?
      </button>
    </div>

    <div class="mb-4 space-y-3">
      <div>
        <label class="text-xs text-gray-500 mb-1 block dark:text-gray-400">昵称</label>
        <input
          v-model="nickname"
          class="px-3 py-2 outline-none border border-gray-200 rounded-lg bg-gray-50 w-full transition-colors dark:text-white dark:border-gray-600 focus:border-indigo-500 dark:bg-gray-700"
          placeholder="请输入昵称..."
        >
      </div>
      <div>
        <label class="text-xs text-gray-500 mb-1 block dark:text-gray-400">邮箱</label>
        <input
          v-model="email"
          type="email"
          class="px-3 py-2 outline-none border border-gray-200 rounded-lg bg-gray-50 w-full transition-colors dark:text-white dark:border-gray-600 focus:border-indigo-500 dark:bg-gray-700"
          placeholder="请输入邮箱..."
        >
      </div>
    </div>

    <div class="flex gap-2 justify-end">
      <BaseButton size="small" @click="emit('close')">
        放弃
      </BaseButton>
      <BaseButton size="small" type="primary" @click="emit('confirm')">
        保存
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
