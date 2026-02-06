import { ref, watch } from 'vue'
import type { Ref } from 'vue'

export interface UseStorageOptions<T> {
  /** 存储类型 */
  storage?: 'local' | 'session'
  /** 序列化函数 */
  serializer?: {
    read: (value: string) => T
    write: (value: T) => string
  }
}

/**
 * 响应式本地存储
 * @example
 * const token = useStorage<string>('token', '')
 * token.value = 'new-token' // 自动同步到 localStorage
 */
export function useStorage<T>(
  key: string,
  defaultValue: T,
  options: UseStorageOptions<T> = {},
): Ref<T> {
  const {
    storage = 'local',
    serializer = {
      read: JSON.parse,
      write: JSON.stringify,
    },
  } = options

  const storageApi = storage === 'local' ? localStorage : sessionStorage

  const readValue = (): T => {
    try {
      const item = storageApi.getItem(key)
      return item ? serializer.read(item) : defaultValue
    }
    catch {
      return defaultValue
    }
  }

  const data = ref<T>(readValue()) as Ref<T>

  watch(
    data,
    (newValue) => {
      try {
        if (newValue === null || newValue === undefined) {
          storageApi.removeItem(key)
        }
        else {
          storageApi.setItem(key, serializer.write(newValue))
        }
      }
      catch (e) {
        console.warn(`Failed to save to ${storage}Storage:`, e)
      }
    },
    { deep: true },
  )

  return data
}
