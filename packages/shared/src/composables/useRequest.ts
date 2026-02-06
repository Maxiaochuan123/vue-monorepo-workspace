import { ref, shallowRef } from 'vue'
import type { Ref, ShallowRef } from 'vue'
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

export interface UseRequestReturn<T, P extends unknown[]> {
  data: ShallowRef<T | undefined>
  loading: Ref<boolean>
  error: Ref<Error | null>
  run: (...args: P) => Promise<T | undefined>
  refresh: () => Promise<T | undefined>
}

/**
 * 请求管理 composable
 */
export function useRequest<T, P extends unknown[] = unknown[]>(
  requestFn: (...args: P) => Promise<T>,
  options: UseRequestOptions<T> = {},
): UseRequestReturn<T, P> {
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
    }
    catch (e) {
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
