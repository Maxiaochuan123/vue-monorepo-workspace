/**
 * 验证手机号
 */
export function isPhone(value: string): boolean {
  return /^1[3-9]\d{9}$/.test(value)
}

/**
 * 验证邮箱
 */
export function isEmail(value: string): boolean {
  return /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(value)
}

/**
 * 验证身份证号
 */
export function isIdCard(value: string): boolean {
  return /^(?:\d{15}|\d{17}[\dx])$/i.test(value)
}

/**
 * 验证 URL
 */
export function isUrl(value: string): boolean {
  try {
    void new URL(value)
    return true
  }
  catch {
    return false
  }
}

/**
 * 是否为空值
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined)
    return true
  if (typeof value === 'string')
    return value.trim() === ''
  if (Array.isArray(value))
    return value.length === 0
  if (typeof value === 'object')
    return Object.keys(value).length === 0
  return false
}

/**
 * 创建表单验证器
 */
export function createValidator(rules: {
  required?: boolean
  message?: string
  pattern?: RegExp
  min?: number
  max?: number
  validator?: (value: unknown) => boolean | Promise<boolean>
}) {
  return async (value: unknown): Promise<{ valid: boolean, message?: string }> => {
    // 必填检查
    if (rules.required && isEmpty(value)) {
      return { valid: false, message: rules.message || '此项为必填项' }
    }

    // 正则检查
    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      return { valid: false, message: rules.message || '格式不正确' }
    }

    // 长度检查
    if (typeof value === 'string') {
      if (rules.min !== undefined && value.length < rules.min) {
        return { valid: false, message: rules.message || `最少 ${rules.min} 个字符` }
      }
      if (rules.max !== undefined && value.length > rules.max) {
        return { valid: false, message: rules.message || `最多 ${rules.max} 个字符` }
      }
    }

    // 自定义验证
    if (rules.validator) {
      const result = await rules.validator(value)
      if (!result) {
        return { valid: false, message: rules.message || '验证失败' }
      }
    }

    return { valid: true }
  }
}
