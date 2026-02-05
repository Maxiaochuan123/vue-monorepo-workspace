export interface RequestConfig extends RequestInit {
  baseURL?: string
  timeout?: number
  params?: Record<string, string | number | boolean>
}

export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

/**
 * 创建请求实例
 */
export function createRequest(defaultConfig: RequestConfig = {}) {
  const { baseURL = '', timeout = 10000, ...defaultInit } = defaultConfig

  async function request<T>(
    url: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { params, timeout: reqTimeout, ...init } = { ...defaultInit, ...config }

    // 构建完整 URL
    let fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`

    // 添加查询参数
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value))
      })
      fullUrl += `?${searchParams.toString()}`
    }

    // 创建 AbortController 用于超时控制
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), reqTimeout || timeout)

    try {
      const response = await fetch(fullUrl, {
        ...init,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...init.headers,
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('请求超时')
      }
      throw error
    }
  }

  return {
    get: <T>(url: string, config?: RequestConfig) =>
      request<T>(url, { ...config, method: 'GET' }),

    post: <T>(url: string, data?: unknown, config?: RequestConfig) =>
      request<T>(url, {
        ...config,
        method: 'POST',
        body: JSON.stringify(data),
      }),

    put: <T>(url: string, data?: unknown, config?: RequestConfig) =>
      request<T>(url, {
        ...config,
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: <T>(url: string, config?: RequestConfig) =>
      request<T>(url, { ...config, method: 'DELETE' }),
  }
}

// 默认请求实例
export const http = createRequest()
