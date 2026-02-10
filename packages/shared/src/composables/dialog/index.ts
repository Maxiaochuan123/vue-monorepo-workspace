import type { AppContext, Component } from 'vue'
import { createVNode, render } from 'vue'
import { lockBodyScroll, unlockBodyScroll } from './scroll-lock'
import type { DialogStackItem } from './stack'
import { closeAllDialogs, getNextZIndex, isTopDialog, popDialog, pushDialog } from './stack'
import { injectStyles } from './styles'

// ========== 类型定义 ==========
export interface DialogOptions<P = Record<string, unknown>> {
  /** 传递给组件的 Props（包含事件监听器 onXxx） */
  props?: P
  /** 弹窗位置：center（默认）或 bottom */
  position?: 'center' | 'bottom'
  /** 点击遮罩是否关闭，默认 true */
  closeOnClickOverlay?: boolean
  /** 是否锁定背景滚动，默认 true */
  lockScroll?: boolean
  /** 动画时长（ms），默认 200 */
  duration?: number
  /** 挂载目标，默认 document.body */
  mountTo?: HTMLElement
  /** 共享应用上下文（用于 pinia/router 等） */
  appContext?: AppContext
}

export interface DialogInstance<T = unknown> {
  /** Promise 结果，await 等待用户操作 */
  result: Promise<T>
  /** 手动关闭弹窗（resolve） */
  close: (payload?: T) => void
}

/**
 * 函数式调用弹窗组件
 *
 * ## 特性
 * - ✅ 函数式调用，告别 ref + v-if
 * - ✅ Promise 化，支持 async/await
 * - ✅ 自动 z-index 栈管理
 * - ✅ 自动动画管理（栈顶有动画，非栈顶瞬间）
 * - ✅ 内置遮罩层和动画样式
 * - ✅ 支持 CSS 变量自定义
 * - ✅ SSR 兼容
 *
 * ## CSS 变量
 * - `--dialog-overlay-bg`: 遮罩背景色
 * - `--dialog-backdrop-filter`: 毛玻璃效果
 * - `--dialog-duration`: 动画时长
 *
 * @example
 * ```typescript
 * // 基本用法
 * const { result } = useDialog(ConfirmPopup)
 * await result
 *
 * // 底部弹窗
 * useDialog(ActionSheet, { position: 'bottom' })
 *
 * // 关闭所有弹窗
 * useDialog.closeAll()
 * ```
 */
export function useDialog<T = unknown, P = Record<string, unknown>>(
  component: Component,
  options: DialogOptions<P> = {},
): DialogInstance<T> {
  // SSR 兼容检查
  if (typeof document === 'undefined') {
    return {
      result: Promise.reject(new Error('useDialog is not available in SSR')),
      close: () => {},
    }
  }

  // 首次调用时注入内置样式
  injectStyles()

  const {
    props = {} as P,
    position = 'center',
    closeOnClickOverlay = true,
    lockScroll = true,
    duration = 200,
    mountTo = document.body,
    appContext,
  } = options

  let _resolve: (value: T | PromiseLike<T>) => void
  let _reject: (reason?: unknown) => void
  let isClosed = false

  const promise = new Promise<T>((resolve, reject) => {
    _resolve = resolve
    _reject = reject
  })

  // 防止未处理的 rejection 警告（用户可以用 result.catch() 覆盖）
  promise.catch(() => {})

  // 1. 创建容器
  const zIndex = getNextZIndex()
  const container = document.createElement('div')
  container.className = `dialog-container dialog-container--${position}`
  container.style.zIndex = String(zIndex)
  container.style.setProperty('--dialog-duration', `${duration}ms`)

  // 2. 锁定背景滚动
  if (lockScroll) {
    lockBodyScroll()
  }

  // 3. 创建栈项
  const stackItem: DialogStackItem = {
    zIndex,
    container,
    cleanup: null as unknown as DialogStackItem['cleanup'],
  }

  // 4. 清理函数
  function cleanup(animate: boolean, callback?: () => void) {
    if (isClosed)
      return
    isClosed = true

    popDialog(stackItem)

    function doCleanup() {
      // 移除事件监听器（显式清理）
      container.removeEventListener('click', handleOverlayClick)

      if (lockScroll)
        unlockBodyScroll()

      // 卸载 Vue 组件
      render(null, container)

      // 移除 DOM
      container.remove()

      callback?.()
    }

    if (animate) {
      container.classList.add('dialog-container--closing')
      setTimeout(doCleanup, duration)
    } else {
      doCleanup()
    }
  }

  stackItem.cleanup = cleanup

  // 5. 加入栈
  pushDialog(stackItem)

  // 6. 点击遮罩处理（定义在 cleanup 之后，但注册在此处）
  function handleOverlayClick(e: MouseEvent) {
    if (closeOnClickOverlay && e.target === container) {
      const animate = isTopDialog(stackItem)
      cleanup(animate, () => _reject(new Error('Closed by overlay click')))
    }
  }
  container.addEventListener('click', handleOverlayClick)

  // 合并 Props：只处理 onConfirm 和 onClose
  const userProps = props as Record<string, unknown>
  const defaultConfirm = (payload: T) => cleanup(isTopDialog(stackItem), () => _resolve(payload))
  const defaultClose = () => cleanup(isTopDialog(stackItem), () => _reject())

  const mergedProps: Record<string, unknown> = {
    ...props,
    onConfirm: typeof userProps.onConfirm === 'function' ? userProps.onConfirm : defaultConfirm,
    onClose: typeof userProps.onClose === 'function' ? userProps.onClose : defaultClose,
  }

  // 8. 创建虚拟节点
  const vnode = createVNode(component, mergedProps)

  // 9. 继承应用上下文
  if (appContext) {
    vnode.appContext = appContext
  }

  // 10. 渲染与挂载
  render(vnode, container)
  mountTo.appendChild(container)

  return {
    result: promise,
    close: (payload?: T) => {
      const animate = isTopDialog(stackItem)
      cleanup(animate, () => _resolve(payload as T))
    },
  }
}

// ========== 静态方法 ==========

/** 关闭所有弹窗 */
useDialog.closeAll = closeAllDialogs

// ========== 便捷方法 ==========
export { closeAllDialogs }
export { vModel, vModels } from './v-model'
