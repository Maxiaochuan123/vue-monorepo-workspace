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
  try {
    const { result } = useDialog(ConfirmDialog, {
      props: {
        title: '删除确认',
        message: '确定要删除这条数据吗？',
      },
    })

    await result
    // 用户点击了确定
    deleteData()
  } catch {
    // 用户取消或点击遮罩关闭
  }
}
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
import { useDialog, vModel, vModels } from '@myorg/shared/composables'

// 单个绑定
const nickname = ref('张三')
useDialog(FormDialog, {
  props: {
    ...vModel(nickname),
  },
})

// 多个绑定
const firstName = ref('张')
const lastName = ref('三')
useDialog(UserForm, {
  props: {
    ...vModels({ firstName, lastName }),
  },
})
```

## 多层弹窗

多层弹窗时，使用 `onConfirm` 阻止自动关闭：

```typescript
function handleMultiple() {
  const layer1 = useDialog(ConfirmDialog, {
    props: {
      title: '第一层',
      onConfirm: () => openSecondLayer(),
    },
  })

  function openSecondLayer() {
    const layer2 = useDialog(ConfirmDialog, {
      props: {
        title: '第二层',
        onConfirm: () => {
          layer2.close() // 栈顶 → 有动画
          layer1.close() // 非栈顶 → 瞬间关闭
        },
      },
    })
  }
}
```

## 手动控制

```typescript
const { result, close } = useDialog(ToastDialog, {
  closeOnClickOverlay: false,
  props: { message: '3秒后关闭' },
})

setTimeout(() => close(), 3000)
```

## 关闭所有弹窗

```typescript
import { closeAllDialogs } from '@myorg/shared/composables'

closeAllDialogs()

// 或
useDialog.closeAll()
```

## API

### DialogOptions

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `props` | `object` | `{}` | 传递给组件的 Props |
| `position` | `'center' \| 'bottom'` | `'center'` | 弹窗位置 |
| `closeOnClickOverlay` | `boolean` | `true` | 点击遮罩是否关闭 |
| `lockScroll` | `boolean` | `true` | 是否锁定背景滚动 |
| `duration` | `number` | `200` | 动画时长（ms） |
| `mountTo` | `HTMLElement` | `document.body` | 挂载目标 |
| `appContext` | `AppContext` | - | Vue 应用上下文 |

### DialogInstance

| 属性/方法 | 类型 | 说明 |
|-----------|------|------|
| `result` | `Promise<T>` | 等待用户操作结果 |
| `close(payload?)` | `function` | 手动关闭弹窗（resolve） |

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
