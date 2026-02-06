# Vue Monorepo Workspace

基于 **pnpm Workspaces** 的 Vue 3 + TypeScript + Vant UI Monorepo 项目模板。

## 📦 项目结构

```
vue-monorepo-workspace/
├── packages/
│   ├── shared/                 # 共享包 @myorg/shared
│   │   ├── src/
│   │   │   ├── components/     # Vue 组件
│   │   │   ├── composables/    # 组合式函数
│   │   │   ├── utils/          # 工具函数
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── app/                    # 示例应用 @myorg/app
│       ├── src/
│       ├── package.json
│       └── vite.config.ts
├── pnpm-workspace.yaml
└── package.json
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装依赖

```bash
# 安装 pnpm（如果未安装）
npm install -g pnpm

# 安装所有依赖
pnpm install
```

### 开发模式

```bash
# 启动示例应用
pnpm dev:app

# 或同时启动所有包
pnpm dev
```

### 构建

```bash
# 构建共享包
pnpm build:shared

# 构建所有包
pnpm build
```

## 📚 使用共享包

### 在项目中引用

```json
// package.json
{
  "dependencies": {
    "@myorg/shared": "workspace:*"
  }
}
```

### 使用组件

```vue
<script setup lang="ts">
import { BaseButton, BaseCard } from '@myorg/shared/components'
</script>

<template>
  <BaseCard title="卡片标题">
    <BaseButton type="primary">
      点击
    </BaseButton>
  </BaseCard>
</template>
```

### 使用 Composables

```vue
<script setup lang="ts">
import { useLoading, useRequest, useStorage } from '@myorg/shared/composables'

const { loading, withLoading } = useLoading()
const theme = useStorage('theme', 'light')
</script>
```

### 使用 Utils

```typescript
import { formatDate, formatMoney, isEmail, isPhone } from '@myorg/shared/utils'

formatDate(new Date()) // 2024-01-15 10:30:00
formatMoney(1234567) // ¥12,345.67
isPhone('13812345678') // true
```

## 🧩 共享包内容

### Components 组件

| 组件             | 说明                         |
| ---------------- | ---------------------------- |
| `BaseButton`     | 按钮组件，封装 Vant Button   |
| `BaseCard`       | 卡片组件，支持标题/描述/插槽 |
| `LoadingOverlay` | 加载遮罩组件                 |

### Composables 组合式函数

| Hook          | 说明           |
| ------------- | -------------- |
| `useLoading`  | 加载状态管理   |
| `useRequest`  | 请求数据管理   |
| `useStorage`  | 响应式本地存储 |
| `useDebounce` | 防抖处理       |

### Utils 工具函数

| 模块       | 函数                                                        |
| ---------- | ----------------------------------------------------------- |
| `format`   | `formatDate`, `formatMoney`, `formatFileSize`, `maskPhone`  |
| `validate` | `isPhone`, `isEmail`, `isIdCard`, `isUrl`, `isEmpty`        |
| `storage`  | `getStorage`, `setStorage`, `removeStorage`, `clearStorage` |
| `request`  | `createRequest`, `http`                                     |

## 🔧 添加新项目

1. 在 `packages/` 目录下创建新项目：

```bash
mkdir packages/my-new-app
cd packages/my-new-app
pnpm init
```

2. 添加共享包依赖：

```json
{
  "dependencies": {
    "@myorg/shared": "workspace:*"
  }
}
```

3. 重新安装依赖：

```bash
pnpm install
```

## 📄 License

MIT
