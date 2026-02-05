const PREFIX = 'myorg_'

/**
 * 获取本地存储
 */
export function getStorage<T>(key: string, defaultValue?: T): T | undefined {
  try {
    const item = localStorage.getItem(`${PREFIX}${key}`)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

/**
 * 设置本地存储
 */
export function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value))
  } catch (e) {
    console.warn('Failed to set localStorage:', e)
  }
}

/**
 * 移除本地存储
 */
export function removeStorage(key: string): void {
  localStorage.removeItem(`${PREFIX}${key}`)
}

/**
 * 清空所有本地存储（仅清空带前缀的）
 */
export function clearStorage(): void {
  const keys = Object.keys(localStorage)
  keys.forEach((key) => {
    if (key.startsWith(PREFIX)) {
      localStorage.removeItem(key)
    }
  })
}

/**
 * 获取 Session 存储
 */
export function getSession<T>(key: string, defaultValue?: T): T | undefined {
  try {
    const item = sessionStorage.getItem(`${PREFIX}${key}`)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

/**
 * 设置 Session 存储
 */
export function setSession<T>(key: string, value: T): void {
  try {
    sessionStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value))
  } catch (e) {
    console.warn('Failed to set sessionStorage:', e)
  }
}
