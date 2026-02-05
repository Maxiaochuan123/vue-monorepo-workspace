import { ref } from 'vue'

/**
 * 加载状态管理
 * @example
 * const { loading, startLoading, stopLoading, withLoading } = useLoading()
 * await withLoading(async () => {
 *   await fetchData()
 * })
 */
export function useLoading(initialValue = false) {
  const loading = ref(initialValue)

  const startLoading = () => {
    loading.value = true
  }

  const stopLoading = () => {
    loading.value = false
  }

  /**
   * 包装异步函数，自动管理加载状态
   */
  const withLoading = async <T>(fn: () => Promise<T>): Promise<T> => {
    startLoading()
    try {
      return await fn()
    } finally {
      stopLoading()
    }
  }

  return {
    loading,
    startLoading,
    stopLoading,
    withLoading,
  }
}
