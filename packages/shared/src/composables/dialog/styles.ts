// ========== 内置样式 ==========
let stylesInjected = false

export function injectStyles(): void {
  // SSR 兼容
  if (typeof document === 'undefined')
    return

  if (stylesInjected)
    return
  stylesInjected = true

  const style = document.createElement('style')
  style.id = 'use-dialog-styles'
  style.textContent = `
    /* ========== 遮罩层基础样式 ========== */
    .dialog-container {
      position: fixed;
      inset: 0;
      background: var(--dialog-overlay-bg, rgba(0, 0, 0, 0.5));
      display: flex;
      backdrop-filter: var(--dialog-backdrop-filter, blur(2px));
      animation: dialog-fade-in var(--dialog-duration, 200ms) ease-out;
    }

    /* 居中弹窗 */
    .dialog-container--center {
      align-items: center;
      justify-content: center;
    }

    /* 底部弹窗 */
    .dialog-container--bottom {
      align-items: flex-end;
      justify-content: center;
    }

    .dialog-container--bottom > * {
      animation: dialog-slide-up var(--dialog-duration, 200ms) cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* 顶部弹窗 */
    .dialog-container--top {
      align-items: flex-start;
      justify-content: center;
    }

    .dialog-container--top > * {
      animation: dialog-slide-down-in var(--dialog-duration, 200ms) cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* 左侧弹窗 */
    .dialog-container--left {
      align-items: center;
      justify-content: flex-start;
    }

    .dialog-container--left > * {
      animation: dialog-slide-right-in var(--dialog-duration, 200ms) cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* 右侧弹窗 */
    .dialog-container--right {
      align-items: center;
      justify-content: flex-end;
    }

    .dialog-container--right > * {
      animation: dialog-slide-left-in var(--dialog-duration, 200ms) cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* ========== 关闭动画 ========== */
    .dialog-container--closing {
      animation: dialog-fade-out var(--dialog-duration, 200ms) ease-out forwards;
    }

    .dialog-container--bottom.dialog-container--closing > * {
      animation: dialog-slide-down-out var(--dialog-duration, 200ms) ease-out forwards;
    }

    .dialog-container--top.dialog-container--closing > * {
      animation: dialog-slide-up-out var(--dialog-duration, 200ms) ease-out forwards;
    }

    .dialog-container--left.dialog-container--closing > * {
      animation: dialog-slide-left-out var(--dialog-duration, 200ms) ease-out forwards;
    }

    .dialog-container--right.dialog-container--closing > * {
      animation: dialog-slide-right-out var(--dialog-duration, 200ms) ease-out forwards;
    }

    /* ========== 动画关键帧 ========== */
    @keyframes dialog-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes dialog-fade-out {
      from { opacity: 1; }
      to { opacity: 0; }
    }

    /* Bottom: Up In / Down Out */
    @keyframes dialog-slide-up {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
    @keyframes dialog-slide-down-out {
      from { transform: translateY(0); }
      to { transform: translateY(100%); }
    }

    /* Top: Down In / Up Out */
    @keyframes dialog-slide-down-in {
      from { transform: translateY(-100%); }
      to { transform: translateY(0); }
    }
    @keyframes dialog-slide-up-out {
      from { transform: translateY(0); }
      to { transform: translateY(-100%); }
    }

    /* Left: Right In / Left Out */
    @keyframes dialog-slide-right-in {
      from { transform: translateX(-100%); }
      to { transform: translateX(0); }
    }
    @keyframes dialog-slide-left-out {
      from { transform: translateX(0); }
      to { transform: translateX(-100%); }
    }

    /* Right: Left In / Right Out */
    @keyframes dialog-slide-left-in {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    @keyframes dialog-slide-right-out {
      from { transform: translateX(0); }
      to { transform: translateX(100%); }
    }
  `
  document.head.appendChild(style)
}
