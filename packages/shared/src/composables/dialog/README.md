# useDialog

函数式弹窗调用，告别 `ref + v-if` 的繁琐写法。

## 特性

- ✅ 函数式调用，Promise 化
- ✅ 自动 z-index 栈管理
- ✅ 自动动画管理（栈顶有动画，非栈顶瞬间关闭）
- ✅ 内置遮罩层和动画样式
- ✅ 支持 CSS 变量自定义
- ✅ SSR 兼容

## 基本用法

```typescript
import { useDialog } from '@myorg/shared/composables'
import ConfirmDialog from '@/components/dialog/ConfirmDialog.vue'

async function handleDelete() {
  // 推荐：直接 await 获取结果和控制器
  const { action, close } = await useDialog(ConfirmDialog, {
    props: {
      title: '删除确认',
      message: '确定要删除这条数据吗？',
    },
  })

  if (action === 'confirm') {
    // 用户点击了确定
    deleteData()
  }
}
```

## 自动关闭控制

默认情况下，触发任意 action（除了 v-model 更新）都会自动关闭弹窗。
你可以通过 `autoClose` 选项精确控制：

```typescript
useDialog(FormDialog, {
  // 仅当 action 不为 'custom' 时自动关闭
  autoClose: (action) => action !== 'custom'
})
```

## 底部弹窗

```typescript
useDialog(ActionSheet, {
  position: 'bottom',
  props: {
    options: ['拍照', '从相册选择'],
  },
})
```

## 双向绑定

使用 `vModel` / `vModels` 辅助函数简化双向绑定：

```typescript
import { vModel, vModels } from '@myorg/shared/composables'

useDialog(FormDialog, {
  props: {
    ...vModels({ nickname, email }),
  },
})
```

## 关闭所有弹窗

```typescript
import { closeAllDialogs } from '@myorg/shared/composables'

closeAllDialogs()
```

## 路由跳转清理

建议在全局路由守卫中清理弹窗，防止跨页残留：

```typescript
// router/index.ts
import { closeAllDialogs } from '@myorg/shared/composables'

router.beforeEach(() => {
  closeAllDialogs()
})
```

## 全局上下文 (Router/Pinia 支持)

为了在 Setup 外（如 axios 拦截器）正常使用依赖 Router/Pinia 的弹窗，需注入全局上下文：

```typescript
// main.ts
import { setDialogContext } from '@myorg/shared/composables'

const app = createApp(App)
setDialogContext(app) // 注入
app.mount('#app')
```

## API

### DialogOptions

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `props` | `object` | `{}` | 传递给组件的 Props |
| `actions` | `string[]` | `[]` | 声明哪些事件会 resolve Promise |
| `autoClose` | `boolean \| (action) => boolean` | `true` | 是否自动关闭 |
| `position` | `'center' \| 'bottom' \| ...` | `'center'` | 弹窗位置 |
| `mountTo` | `HTMLElement` | `body` | 挂载节点 |
| `appContext` | `AppContext` | - | 手动指定上下文 |

### DialogResult

| 属性 | 类型 | 说明 |
|------|------|------|
| `action` | `string` | 触发的事件名 (confirm, close...) |
| `data` | `T` | 事件携带的数据 |
| `close` | `() => void` | 手动关闭当前弹窗 |

## CSS 变量

```css
:root {
  --dialog-overlay-bg: rgba(0, 0, 0, 0.5);
  --dialog-backdrop-filter: blur(2px);
  --dialog-duration: 200ms;
}
```

## 弹窗组件约定

弹窗组件需要 emit 以下事件：

```vue
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'confirm', payload?: any): void
  (e: 'close'): void
}>()
</script>

<template>
  <div class="my-dialog">
    <button @click="emit('confirm', data)">确定</button>
    <button @click="emit('close')">取消</button>
  </div>
</template>
```

## 文件结构

```
packages/shared/src/composables/dialog/
├── index.ts       # 主入口
├── stack.ts       # 弹窗栈管理
├── scroll-lock.ts # 背景滚动锁定
├── styles.ts      # 内置样式
├── v-model.ts     # vModel/vModels 辅助函数
└── README.md      # 本文档
```
