import { ref, shallowRef } from 'vue'
import { useLoading } from './useLoading'

export interface UseRequestOptions<T> {
  /** 初始数据 */
  initialData?: T
  /** 是否立即执行 */
  immediate?: boolean
  /** 成功回调 */
  onSuccess?: (data: T) => void
  /** 失败回调 */
  onError?: (error: Error) => void
}

/**
 * 请求管理 composable
 * @example
 * const { data, loading, error, run, refresh } = useRequest(fetchUserList, {
 *   immediate: true,
 *   onSuccess: (data) => console.log('获取成功', data)
 * })
 */
export function useRequest<T, P extends unknown[] = unknown[]>(
  requestFn: (...args: P) => Promise<T>,
  options: UseRequestOptions<T> = {}
) {
  const { initialData, immediate = false, onSuccess, onError } = options

  const data = shallowRef<T | undefined>(initialData)
  const error = ref<Error | null>(null)
  const { loading, withLoading } = useLoading()

  const run = async (...args: P): Promise<T | undefined> => {
    error.value = null
    try {
      const result = await withLoading(() => requestFn(...args))
      data.value = result
      onSuccess?.(result)
      return result
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      error.value = err
      onError?.(err)
      return undefined
    }
  }

  const refresh = () => run(...([] as unknown as P))

  // 立即执行
  if (immediate) {
    run(...([] as unknown as P))
  }

  return {
    data,
    loading,
    error,
    run,
    refresh,
  }
}
