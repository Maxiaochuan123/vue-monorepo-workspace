import type { AppContext, Component, VNode } from 'vue'
import { createVNode, getCurrentInstance, isVNode, render } from 'vue'
import { lockBodyScroll, unlockBodyScroll } from './scroll-lock'
import type { DialogStackItem } from './stack'
import { closeAllDialogs, getNextZIndex, isTopDialog, popDialog, pushDialog } from './stack'
import { injectStyles } from './styles'

// ========== 类型定义 ==========

/** 弹窗结果：统一以 { action, data, close } 格式返回 */
export interface DialogResult<T = unknown> {
  /** 触发的动作名称（即 emit 事件名，如 'confirm'、'close'、'customAction' 等） */
  action: string
  /** 事件携带的数据 */
  data?: T
  /** 手动关闭弹窗的方法 */
  close: () => void
}

export interface DialogOptions<P = Record<string, unknown>> {
  /** 传递给组件的 Props（包含事件监听器 onXxx） */
  props?: P
  /** 弹窗位置：center（默认）或 bottom/top/left/right */
  position?: 'center' | 'bottom' | 'top' | 'left' | 'right'
  /** 点击遮罩是否关闭，默认 false */
  closeOnClickOverlay?: boolean
  /** 是否锁定背景滚动，默认 true */
  lockScroll?: boolean
  /** 动画时长（ms），默认 200 */
  duration?: number
  /** 挂载目标，默认 document.body */
  mountTo?: HTMLElement
  /** 共享应用上下文（用于 pinia/router 等） */
  appContext?: AppContext
  /**
   * 手动补充需要拦截的事件列表
   *
   * 通常无需指定，`useDialog` 会自动从组件的 `emits` 选项中读取。
   * 只有当组件未声明 `emits` 但确实发出事件时才需要手动补充。
   */
  actions?: string[]
  /**
   * action 触发后是否自动关闭弹窗
   *
   * - `true`（默认）: 除 v-model 外，所有 action 都会关闭弹窗
   * - `false`: 所有 action 都不关闭，需手动 `close()`
   * - `(action) => boolean`: 返回 true 关闭，returning false 不关闭
   *
   * @example
   * ```ts
   * // 除了 customAction 其他都自动关
   * autoClose: (action) => action !== 'customAction'
   * ```
   */
  autoClose?: boolean | ((action: string) => boolean)
}

export interface DialogInstance<T = unknown> {
  /** Promise 结果 */
  result: Promise<DialogResult<T>>
  /** 手动关闭弹窗 */
  close: () => void
  /** Thenable: 支持 await useDialog(...) 直接获取 { action, data } */
  then: Promise<DialogResult<T>>['then']
  /** Thenable: 支持 .catch() */
  catch: Promise<DialogResult<T>>['catch']
}

// 辅助：获取组件定义的 emits
// 辅助：获取组件定义的 emits
function getComponentEmits(source: Component | VNode): string[] {
  const comp = isVNode(source) ? source.type : source
  const emits = (comp as any)?.emits
  if (!emits)
    return []
  return Array.isArray(emits) ? emits : Object.keys(emits)
}

/**
 * 函数式调用弹窗组件
 *
 * ## 特性
 * - ✅ 函数式调用，告别 ref + v-if
 * - ✅ Thenable: 直接 `await useDialog(...)` 无需 `.result`
 * - ✅ 统一 { action, data } 结果，用 if 判断替代 try/catch
 * - ✅ `actions` 选项精确控制哪些事件 resolve
 * - ✅ `autoClose: false` 支持多层堆叠
 * - ✅ 自动 z-index 栈管理 & 动画管理
 * - ✅ SSR 兼容
 *
 * @example
 * ```typescript
 * // 基本用法 — 直接 await
 * const { action } = await useDialog(ConfirmDialog)
 * if (action === 'confirm') { ... }
 *
 * // 多层堆叠 — autoClose: false
 * const d1 = useDialog(Dialog1, { autoClose: false })
 * const r1 = await d1
 * if (r1.action === 'confirm') {
 *   const d2 = useDialog(Dialog2, { autoClose: false })
 *   const r2 = await d2
 *   closeAllDialogs() // 手动关闭所有
 * }
 *
 * // 不 await 时拿 close 引用
 * const { close } = useDialog(ToastDialog)
 * setTimeout(() => close(), 3000)
 * ```
 */
export function useDialog<T = unknown, P = Record<string, unknown>>(
  component: Component | VNode,
  options: DialogOptions<P> = {},
): DialogInstance<T> {
  // SSR 兼容检查
  if (typeof document === 'undefined') {
    const noop = Promise.resolve({ action: 'close', close: () => {} } as DialogResult<T>)
    return {
      result: noop,
      close: () => {},
      then: noop.then.bind(noop),
      catch: noop.catch.bind(noop),
    }
  }

  // 首次调用时注入内置样式
  injectStyles()

  // 尝试自动获取应用上下文 (用于支持 useRouter, useStore 等)
  const currentInstance = getCurrentInstance()

  const {
    props = {} as P,
    position = 'center',
    closeOnClickOverlay = false,
    lockScroll = true,
    duration = 200,
    mountTo = document.body,
    // 优先使用 options 传入的，否则尝试自动获取
    appContext = currentInstance?.appContext,
    actions = [],
    autoClose = true,
  } = options

  let _resolve: (value: DialogResult<T>) => void
  let isResolved = false
  let isClosed = false

  const promise = new Promise<DialogResult<T>>((resolve) => {
    _resolve = resolve
  })

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

  // 3. 创建栈项（cleanup 在 destroy 定义后赋值）
  const stackItem: DialogStackItem = {
    zIndex,
    container,
    cleanup: null as unknown as DialogStackItem['cleanup'],
  }

  // ---- resolve: 仅 resolve promise，不操作 DOM ----
  function resolve(action: string, data?: T) {
    if (isResolved)
      return
    isResolved = true
    _resolve({ action, data, close })
  }

  // ---- destroy: 清理 DOM 和资源 ----
  function destroy(animate: boolean) {
    if (isClosed)
      return
    isClosed = true

    popDialog(stackItem)

    function doDestroy() {
      container.removeEventListener('click', handleOverlayClick)
      if (lockScroll)
        unlockBodyScroll()
      // 如果 promise 还没 resolve，默认 resolve close
      resolve('close')
      render(null, container)
      container.remove()
    }

    if (animate) {
      container.classList.add('dialog-container--closing')
      setTimeout(doDestroy, duration)
    } else {
      doDestroy()
    }
  }

  stackItem.cleanup = destroy

  // ---- handleAction: 统一处理 action ----
  // shouldClose: 该事件是否应该关闭弹窗
  function handleAction(action: string, data?: T, shouldClose = true) {
    resolve(action, data)
    if (shouldClose) {
      destroy(isTopDialog(stackItem))
    }
  }

  // 4. 加入栈
  pushDialog(stackItem)

  // 5. 点击遮罩处理（遮罩点击始终关闭，无论 autoClose）
  function handleOverlayClick(e: MouseEvent) {
    if (closeOnClickOverlay && e.target === container) {
      resolve('overlay')
      destroy(isTopDialog(stackItem))
    }
  }
  container.addEventListener('click', handleOverlayClick)

  // 6. 合并 Props & 自动事件拦截
  const userProps = props as Record<string, unknown>
  const mergedProps: Record<string, unknown> = { ...userProps }

  // 收集所有需要拦截的事件
  // 1. 自动从组件 emits 选项读取
  // 2. 加上默认的 confirm/close
  // 3. 加上用户手动补充的 actions
  const componentEmits = getComponentEmits(component)
  const allEvents = new Set([...componentEmits, 'confirm', 'close', ...actions])

  for (const eventName of allEvents) {
    // 转换为 onEventName 格式 (kebab-case -> CamelCase)
    const camelName = eventName.replace(/-(\w)/g, (_, c) => c.toUpperCase())
    const propKey = `on${camelName[0].toUpperCase()}${camelName.slice(1)}`

    // 智能判断是否需要关闭弹窗：
    // 优先级 1: v-model (update:) -> 始终 false
    // 优先级 2: autoClose 是函数 -> 运行函数
    // 优先级 3: autoClose 是布尔值 -> 直接使用
    let shouldClose = true

    if (eventName.startsWith('update:')) {
      shouldClose = false
    } else if (typeof autoClose === 'function') {
      shouldClose = autoClose(eventName)
    } else {
      shouldClose = autoClose // boolean
    }

    const userFn = typeof userProps[propKey] === 'function'
      ? userProps[propKey] as (...args: unknown[]) => unknown
      : null

    mergedProps[propKey] = (...args: unknown[]) => {
      userFn?.(...args)
      handleAction(eventName, args[0] as T, shouldClose)
    }
  }

  // 7. 创建虚拟节点 & 渲染
  const vNode = createVNode(component, mergedProps)
  if (appContext) {
    vNode.appContext = appContext
  }
  render(vNode, container)
  mountTo.appendChild(container)

  // 8. 手动关闭
  function close() {
    resolve('close')
    destroy(isTopDialog(stackItem))
  }

  return {
    result: promise,
    close,
    then: promise.then.bind(promise),
    catch: promise.catch.bind(promise),
  }
}

// ========== 静态方法 ==========

/** 关闭所有弹窗 */
useDialog.closeAll = closeAllDialogs

// ========== 便捷方法 ==========
export { closeAllDialogs }
export { vModel, vModels } from './v-model'
