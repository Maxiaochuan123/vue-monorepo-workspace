// ========== 弹窗栈管理 ==========
export interface DialogStackItem {
  zIndex: number
  container: HTMLElement
  cleanup: (animate: boolean, callback?: () => void) => void
}

const dialogStack: DialogStackItem[] = []
let zIndexCounter = 2000

export function pushDialog(item: DialogStackItem): void {
  dialogStack.push(item)
}

export function popDialog(item: DialogStackItem): void {
  const index = dialogStack.indexOf(item)
  if (index > -1) {
    dialogStack.splice(index, 1)
  }
  if (dialogStack.length === 0) {
    zIndexCounter = 2000
  }
}

export function isTopDialog(item: DialogStackItem): boolean {
  return dialogStack.length > 0 && dialogStack[dialogStack.length - 1] === item
}

export function getNextZIndex(): number {
  return zIndexCounter++
}

export function getDialogStack(): readonly DialogStackItem[] {
  return dialogStack
}

export function closeAllDialogs(): void {
  // 从栈顶开始关闭，栈顶有动画
  const items = [...dialogStack].reverse()
  items.forEach((item, index) => {
    item.cleanup(index === 0, undefined) // 只有第一个（栈顶）有动画
  })
}
