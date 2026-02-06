import { ref, watch } from 'vue'
import type { Ref } from 'vue'

/**
 * 防抖 composable
 * @example
 * const keyword = ref('')
 * const debouncedKeyword = useDebounce(keyword, 300)
 *
 * watch(debouncedKeyword, (val) => {
 *   // 搜索逻辑
 * })
 */
export function useDebounce<T>(value: Ref<T>, delay = 200): Ref<T> {
  const debouncedValue = ref<T>(value.value) as Ref<T>
  let timer: ReturnType<typeof setTimeout> | null = null

  watch(value, (newValue) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })

  return debouncedValue
}

/**
 * 防抖函数
 * @example
 * const debouncedSearch = useDebounceFn((keyword: string) => {
 *   console.log('搜索:', keyword)
 * }, 300)
 */
export function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  delay = 200,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
