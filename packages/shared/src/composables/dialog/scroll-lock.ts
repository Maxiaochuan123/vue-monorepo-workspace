// ========== Body Scroll Lock ==========
let lockCount = 0
let originalOverflow = ''

export function lockBodyScroll(): void {
  // SSR 兼容
  if (typeof document === 'undefined')
    return

  if (lockCount === 0) {
    originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  lockCount++
}

export function unlockBodyScroll(): void {
  // SSR 兼容
  if (typeof document === 'undefined')
    return

  lockCount--
  if (lockCount <= 0) {
    lockCount = 0
    document.body.style.overflow = originalOverflow
  }
}
