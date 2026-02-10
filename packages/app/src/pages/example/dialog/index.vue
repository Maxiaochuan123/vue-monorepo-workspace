<route lang="json5">
{
  name: 'Dialog',
  meta: {
    level: 2,
  },
}
</route>

<script setup lang="ts">
import ActionSheetDialog from './components/ActionSheetDialog.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import FormDialog from './components/FormDialog.vue'
import ToastDialog from './components/ToastDialog.vue'
import { BaseButton } from '@myorg/shared/components'
import { closeAllDialogs, useDialog, vModels } from '@myorg/shared/composables'
import { showToast } from 'vant'

const router = useRouter()

// 双向绑定演示用的响应式数据
const nickname = ref('User_007')
const email = ref('user@example.com')

// 1. 基本用法（居中弹窗）
async function handleBasic() {
  try {
    const { result } = useDialog(ConfirmDialog, {
      props: {
        title: '删除确认',
        message: '确定要删除这条数据吗？此操作无法撤销。',
      },
    })

    const confirmed = await result
    if (confirmed) {
      showToast('删除成功')
    }
  } catch {
    showToast('操作取消')
  }
}

// 2. 双向绑定示例（使用 vModels 批量绑定）
async function handleForm() {
  try {
    const { result } = useDialog(FormDialog, {
      props: {
        ...vModels({ nickname, email }), // 批量绑定多个 v-model
        title: '修改个人信息',
        onCustomAction: (actionName: string) => {
          showToast(`触发自定义事件: ${actionName}`)
        },
      },
    })

    await result
    showToast(`保存成功: ${nickname.value}, ${email.value}`)
  } catch {
    // cancelled
  }
}

// 3. 底部弹窗（ActionSheet）
async function handleBottom() {
  try {
    const { result } = useDialog(ActionSheetDialog, {
      position: 'bottom',
      props: {
        title: '选择操作',
        options: ['拍照', '从相册选择', '保存图片'],
      },
    })

    const selected = await result
    showToast(`选择了: ${selected}`)
  } catch {
    // cancelled
  }
}

// 4. 多弹窗层级测试（自动动画管理）
function handleMultiple() {
  const layer1 = useDialog(ConfirmDialog, {
    props: {
      title: '第一层弹窗',
      message: '点击确定打开第二层',
      onConfirm: () => openSecondLayer(),
      onClose: () => {
        layer1.close()
        showToast('第一层取消')
      },
    },
  })

  function openSecondLayer() {
    const layer2 = useDialog(ConfirmDialog, {
      props: {
        title: '第二层弹窗',
        message: '点击确定打开第三层',
        onConfirm: () => openThirdLayer(),
        onClose: () => {
          layer2.close()
          showToast('第二层取消，第一层仍在')
        },
      },
    })

    function openThirdLayer() {
      const layer3 = useDialog(ConfirmDialog, {
        props: {
          title: '第三层弹窗',
          message: '确定后三层同时关闭',
          onConfirm: () => {
            // 栈顶自动有动画，非栈顶自动瞬间关闭
            layer3.close()
            layer2.close()
            layer1.close()
            showToast('三层同时关闭')
          },
          onClose: () => {
            layer3.close()
            showToast('第三层取消，前两层仍在')
          },
        },
      })
    }
  }
}

// 5. 手动控制关闭（Toast）
function handleManual() {
  const { close } = useDialog(ToastDialog, {
    closeOnClickOverlay: false,
    lockScroll: false,
    duration: 300,
    props: {
      message: '3秒后自动关闭...',
      type: 'info',
    },
  })

  setTimeout(() => close(), 3000)
}

// 6. 不同类型的 Toast
function handleToastType(type: 'success' | 'warning' | 'error') {
  const messages = {
    success: '操作成功！',
    warning: '请注意！',
    error: '操作失败！',
  }

  const { close } = useDialog(ToastDialog, {
    closeOnClickOverlay: true,
    lockScroll: false,
    props: {
      message: messages[type],
      type,
    },
  })

  setTimeout(() => close(), 2000)
}

// 7. 关闭所有弹窗
function handleCloseAll() {
  // 打开多个弹窗
  useDialog(ConfirmDialog, {
    props: { title: '第一层', message: '点击“关闭所有”按钮' },
  })
  useDialog(ConfirmDialog, {
    props: { title: '第二层', message: '点击“关闭所有”按钮' },
  })
  useDialog(ConfirmDialog, {
    props: { title: '第三层', message: '点击下方按钮关闭所有' },
  })

  // 1.5秒后关闭所有
  setTimeout(() => {
    closeAllDialogs()
    showToast('已关闭所有弹窗')
  }, 1500)
}
</script>

<template>
  <div class="px-4 py-6 pb-32 bg-gray-50 min-h-screen transition-colors duration-300 dark:bg-gray-950">
    <!-- Header -->
    <header class="mb-8 flex gap-3 items-center">
      <button
        class="text-gray-600 rounded-xl bg-white flex h-10 w-10 shadow-sm transition-transform items-center justify-center dark:text-gray-300 dark:bg-gray-800 active:scale-95"
        @click="router.back()"
      >
        <div class="i-carbon-arrow-left text-xl" />
      </button>
      <div>
        <h1 class="text-xl text-gray-900 font-bold dark:text-white">
          useDialog
        </h1>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          函数式弹窗 · z-index · lockScroll · 动画
        </p>
      </div>
    </header>

    <div class="space-y-4">
      <section class="p-5 rounded-2xl bg-white shadow-sm dark:bg-gray-900">
        <h2 class="text-gray-900 font-bold mb-2 dark:text-white">
          居中弹窗
        </h2>
        <BaseButton type="primary" block @click="handleBasic">
          ConfirmDialog
        </BaseButton>
      </section>

      <section class="p-5 rounded-2xl bg-white shadow-sm dark:bg-gray-900">
        <h2 class="text-gray-900 font-bold mb-2 dark:text-white">
          自定义事件
        </h2>
        <BaseButton type="success" block @click="handleForm">
          FormDialog
        </BaseButton>
      </section>

      <section class="p-5 rounded-2xl bg-white shadow-sm dark:bg-gray-900">
        <h2 class="text-gray-900 font-bold mb-2 dark:text-white">
          底部弹窗
        </h2>
        <BaseButton type="warning" block @click="handleBottom">
          ActionSheetDialog
        </BaseButton>
      </section>

      <section class="p-5 rounded-2xl bg-white shadow-sm dark:bg-gray-900">
        <h2 class="text-gray-900 font-bold mb-2 dark:text-white">
          多层弹窗
        </h2>
        <BaseButton type="danger" block @click="handleMultiple">
          测试 z-index 层级
        </BaseButton>
      </section>

      <section class="p-5 rounded-2xl bg-white shadow-sm dark:bg-gray-900">
        <h2 class="text-gray-900 font-bold mb-2 dark:text-white">
          Toast 提示
        </h2>
        <div class="gap-2 grid grid-cols-2">
          <BaseButton block @click="handleManual">
            自动关闭
          </BaseButton>
          <BaseButton type="success" block @click="handleToastType('success')">
            成功
          </BaseButton>
          <BaseButton type="warning" block @click="handleToastType('warning')">
            警告
          </BaseButton>
          <BaseButton type="danger" block @click="handleToastType('error')">
            错误
          </BaseButton>
        </div>
      </section>

      <section class="p-5 rounded-2xl bg-white shadow-sm dark:bg-gray-900">
        <h2 class="text-gray-900 font-bold mb-2 dark:text-white">
          关闭所有弹窗
        </h2>
        <BaseButton block @click="handleCloseAll">
          打开 3 层，1.5s 后全部关闭
        </BaseButton>
      </section>
    </div>
  </div>
</template>
