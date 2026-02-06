<script setup lang="ts">
import { BaseButton, BaseCard } from '@myorg/shared/components'
import { useLoading, useRequest, useStorage, useDebounce } from '@myorg/shared/composables'
import { showToast } from 'vant'

// ========== useLoading 演示 ==========
const { loading: isLoading, withLoading } = useLoading()

const simulateRequest = async () => {
  await withLoading(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    showToast('操作完成！')
  })
}

// ========== useRequest 演示 ==========
interface User {
  id: number
  name: string
  email: string
}

const mockFetchUsers = async (): Promise<User[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  return [
    { id: 1, name: '张三', email: 'zhangsan@example.com' },
    { id: 2, name: '李四', email: 'lisi@example.com' },
    { id: 3, name: '王五', email: 'wangwu@example.com' },
  ]
}

const {
  data: users,
  loading: usersLoading,
  error: usersError,
  run: fetchUsers,
  refresh: refreshUsers
} = useRequest(mockFetchUsers, {
  onSuccess: () => showToast('获取用户列表成功'),
  onError: (err) => showToast(`错误: ${err.message}`),
})

// ========== useStorage 演示 ==========
const theme = useStorage<'light' | 'dark'>('theme', 'light')
const visitCount = useStorage<number>('visitCount', 0)
visitCount.value++

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  showToast(`主题已切换为: ${theme.value === 'light' ? '浅色' : '深色'}`)
}

// ========== useDebounce 演示 ==========
const searchKeyword = ref('')
const debouncedKeyword = useDebounce(searchKeyword, 500)

const searchResult = computed(() => {
  if (!debouncedKeyword.value) return ''
  return `搜索关键词: "${debouncedKeyword.value}"`
})
</script>

<template>
  <div class="composables-demo">
    <!-- useLoading 演示 -->
    <div class="demo-card fade-in">
      <h3 class="demo-card__title">useLoading</h3>
      <p class="demo-desc">加载状态管理，自动包装异步函数</p>

      <BaseButton
        type="primary"
        :loading="isLoading"
        @click="simulateRequest"
      >
        {{ isLoading ? '处理中...' : '模拟异步请求' }}
      </BaseButton>

      <pre class="code-block"><code>const { loading, withLoading } = useLoading()

await withLoading(async () => {
  await fetchData()
})</code></pre>
    </div>

    <!-- useRequest 演示 -->
    <div class="demo-card fade-in" style="animation-delay: 0.1s">
      <h3 class="demo-card__title">useRequest</h3>
      <p class="demo-desc">请求数据管理，自动处理 loading 和 error 状态</p>

      <div class="button-group">
        <BaseButton
          type="primary"
          :loading="usersLoading"
          @click="() => fetchUsers()"
        >
          获取用户列表
        </BaseButton>
        <BaseButton @click="() => refreshUsers()">
          刷新
        </BaseButton>
      </div>

      <BaseCard v-if="users" class="mt-12">
        <div class="user-list">
          <div v-for="user in users" :key="user.id" class="user-item">
            <div class="user-name">{{ user.name }}</div>
            <div class="user-email">{{ user.email }}</div>
          </div>
        </div>
      </BaseCard>

      <div v-if="usersError" class="error-msg">
        错误: {{ usersError.message }}
      </div>

      <pre class="code-block"><code>const { data, loading, error, run } = useRequest(
  fetchUserList,
  { immediate: true, onSuccess: handleSuccess }
)</code></pre>
    </div>

    <!-- useStorage 演示 -->
    <div class="demo-card fade-in" style="animation-delay: 0.2s">
      <h3 class="demo-card__title">useStorage</h3>
      <p class="demo-desc">响应式本地存储，自动同步到 localStorage</p>

      <div class="storage-demo">
        <div class="storage-item">
          <span>当前主题:</span>
          <span class="tag">{{ theme }}</span>
          <BaseButton size="small" @click="toggleTheme">切换</BaseButton>
        </div>
        <div class="storage-item">
          <span>访问次数:</span>
          <span class="tag">{{ visitCount }}</span>
        </div>
      </div>

      <pre class="code-block"><code>const theme = useStorage('theme', 'light')
theme.value = 'dark' // 自动保存到 localStorage</code></pre>
    </div>

    <!-- useDebounce 演示 -->
    <div class="demo-card fade-in" style="animation-delay: 0.3s">
      <h3 class="demo-card__title">useDebounce</h3>
      <p class="demo-desc">防抖处理，延迟执行搜索等场景</p>

      <van-field
        v-model="searchKeyword"
        placeholder="输入关键词搜索（500ms 防抖）"
        clearable
      />

      <div v-if="searchResult" class="search-result">
        {{ searchResult }}
      </div>
      <div v-else class="search-hint">
        输入内容后 500ms 触发搜索
      </div>

      <pre class="code-block"><code>const keyword = ref('')
const debouncedKeyword = useDebounce(keyword, 500)

watch(debouncedKeyword, (val) => {
  // 搜索逻辑
})</code></pre>
    </div>
  </div>
</template>

<style scoped>
.composables-demo {
  padding-top: 10px;
}

.demo-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.button-group {
  display: flex;
  gap: 10px;
}

.mt-12 {
  margin-top: 12px;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
}

.user-item:last-child {
  border-bottom: none;
}

.user-name {
  font-weight: 500;
}

.user-email {
  font-size: 12px;
  color: var(--text-muted);
}

.error-msg {
  margin-top: 12px;
  padding: 12px;
  background: #fff2f0;
  border-radius: 8px;
  color: #ff4d4f;
  font-size: 13px;
}

.storage-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.storage-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.search-result {
  margin-top: 12px;
  padding: 12px;
  background: #f0f9eb;
  border-radius: 8px;
  color: #67c23a;
  font-size: 14px;
}

.search-hint {
  margin-top: 12px;
  font-size: 13px;
  color: var(--text-muted);
}
</style>
