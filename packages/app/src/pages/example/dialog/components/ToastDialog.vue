<script setup lang="ts">
defineProps<{
  message?: string
  type?: 'info' | 'success' | 'warning' | 'error'
}>()
</script>

<template>
  <div
    class="px-6 py-4 rounded-xl shadow-lg"
    :class="{
      'bg-gray-800 text-white': type === 'info' || !type,
      'bg-green-500 text-white': type === 'success',
      'bg-orange-500 text-white': type === 'warning',
      'bg-red-500 text-white': type === 'error',
    }"
  >
    <div class="flex gap-3 items-center">
      <div
        class="text-xl"
        :class="{
          'i-carbon-information': type === 'info' || !type,
          'i-carbon-checkmark-filled': type === 'success',
          'i-carbon-warning': type === 'warning',
          'i-carbon-close-filled': type === 'error',
        }"
      />
      <span class="text-sm font-medium">
        {{ message || '这是一条提示消息' }}
      </span>
    </div>
  </div>
</template>
