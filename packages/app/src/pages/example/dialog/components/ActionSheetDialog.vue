<script setup lang="ts">
import { BaseButton } from '@myorg/shared/components'

defineProps<{
  options?: string[]
  title?: string
}>()

const emit = defineEmits<{
  (e: 'confirm', value: string): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <div class="p-6 rounded-t-3xl bg-white w-full dark:bg-gray-800">
    <!-- 拖拽指示条 -->
    <div class="mx-auto mb-4 rounded-full bg-gray-300 h-1 w-12 dark:bg-gray-600" />

    <h3 class="text-lg text-gray-900 font-bold mb-4 dark:text-white">
      {{ title || '请选择' }}
    </h3>

    <div class="space-y-2">
      <BaseButton
        v-for="option in (options || ['选项一', '选项二', '选项三'])"
        :key="option"

        plain block
        @click="emit('confirm', option)"
      >
        {{ option }}
      </BaseButton>

      <BaseButton block type="default" @click="emit('cancel')">
        取消
      </BaseButton>
    </div>
  </div>
</template>
