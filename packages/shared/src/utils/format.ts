/**
 * 格式化日期
 * @param date - 日期对象或时间戳
 * @param format - 格式模板，默认 'YYYY-MM-DD HH:mm:ss'
 */
export function formatDate(
  date: Date | number | string,
  format = 'YYYY-MM-DD HH:mm:ss'
): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) {
    return ''
  }

  const map: Record<string, number> = {
    YYYY: d.getFullYear(),
    MM: d.getMonth() + 1,
    DD: d.getDate(),
    HH: d.getHours(),
    mm: d.getMinutes(),
    ss: d.getSeconds(),
  }

  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (matched) => {
    const value = map[matched]
    return value < 10 ? `0${value}` : String(value)
  })
}

/**
 * 格式化金额
 * @param amount - 金额（分）
 * @param options - 配置选项
 */
export function formatMoney(
  amount: number,
  options: {
    decimal?: number
    symbol?: string
    thousandSeparator?: boolean
  } = {}
): string {
  const { decimal = 2, symbol = '¥', thousandSeparator = true } = options
  
  // 分转元
  const yuan = amount / 100
  let formatted = yuan.toFixed(decimal)
  
  if (thousandSeparator) {
    const [intPart, decPart] = formatted.split('.')
    formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    if (decPart) {
      formatted += `.${decPart}`
    }
  }
  
  return `${symbol}${formatted}`
}

/**
 * 格式化文件大小
 * @param bytes - 字节数
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`
}

/**
 * 手机号脱敏
 * @param phone - 手机号
 */
export function maskPhone(phone: string): string {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}
