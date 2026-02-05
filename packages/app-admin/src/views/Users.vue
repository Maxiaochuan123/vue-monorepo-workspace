<script setup lang="ts">
import { ref } from 'vue'
// 使用共享包 👇
import { BaseCard, BaseButton } from '@myorg/shared/components'
import { useRequest, useDebounce } from '@myorg/shared/composables'
import { formatDate, maskPhone } from '@myorg/shared/utils'
import { showToast } from 'vant'

interface User {
  id: number
  name: string
  phone: string
  email: string
  status: 'active' | 'inactive'
  createdAt: string
}

const mockUsers: User[] = [
  { id: 1, name: '张三', phone: '13812345678', email: 'zhangsan@example.com', status: 'active', createdAt: '2024-01-15' },
  { id: 2, name: '李四', phone: '13987654321', email: 'lisi@example.com', status: 'active', createdAt: '2024-01-18' },
  { id: 3, name: '王五', phone: '13611112222', email: 'wangwu@example.com', status: 'inactive', createdAt: '2024-01-20' },
  { id: 4, name: '赵六', phone: '13733334444', email: 'zhaoliu@example.com', status: 'active', createdAt: '2024-01-22' },
]

const fetchUsers = async () => {
  await new Promise(resolve => setTimeout(resolve, 600))
  return mockUsers
}

const { data: users, loading, refresh } = useRequest(fetchUsers, { immediate: true })

const searchKeyword = ref('')
const debouncedKeyword = useDebounce(searchKeyword, 300)

const filteredUsers = () => {
  if (!users.value) return []
  if (!debouncedKeyword.value) return users.value
  return users.value.filter(user => 
    user.name.includes(debouncedKeyword.value) || 
    user.email.includes(debouncedKeyword.value)
  )
}

const handleEdit = (user: User) => {
  showToast(`编辑用户: ${user.name}`)
}

const handleDelete = (user: User) => {
  showToast(`删除用户: ${user.name}`)
}
</script>

<template>
  <div class="users-page">
    <BaseCard class="fade-in-up">
      <div class="card-header">
        <h3 class="admin-card__title">用户列表</h3>
        <div class="header-actions">
          <van-search
            v-model="searchKeyword"
            placeholder="搜索用户名或邮箱"
            shape="round"
            class="search-input"
          />
          <BaseButton type="primary" size="small" @click="refresh">
            刷新
          </BaseButton>
        </div>
      </div>

      <div class="info-box">
        <span>💡</span>
        <span>
          使用了 <code>useRequest</code> 获取数据，<code>useDebounce</code> 防抖搜索，
          <code>maskPhone</code> 脱敏手机号
        </span>
      </div>

      <div v-if="loading" class="loading-state">
        加载中...
      </div>

      <table v-else class="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>手机号</th>
            <th>邮箱</th>
            <th>状态</th>
            <th>注册时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers()" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ maskPhone(user.phone) }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="['status-tag', user.status]">
                {{ user.status === 'active' ? '正常' : '禁用' }}
              </span>
            </td>
            <td>{{ formatDate(user.createdAt, 'YYYY-MM-DD') }}</td>
            <td>
              <div class="action-buttons">
                <BaseButton size="mini" @click="handleEdit(user)">编辑</BaseButton>
                <BaseButton size="mini" type="danger" @click="handleDelete(user)">删除</BaseButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </BaseCard>
  </div>
</template>

<style scoped>
.users-page {
  animation: fadeInUp 0.4s ease-out;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-input {
  width: 240px;
  padding: 0;
}

.info-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f0f7ff;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
  color: #1890ff;
}

.info-box code {
  background: #e6f7ff;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
}

.loading-state {
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th,
.user-table td {
  padding: 12px 8px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.user-table th {
  font-weight: 500;
  color: var(--text-secondary);
  background: #f8f9fa;
}

.user-table tr:hover {
  background: #f8f9fa;
}

.status-tag {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-tag.active {
  background: #f0f9eb;
  color: #67c23a;
}

.status-tag.inactive {
  background: #fef0f0;
  color: #f56c6c;
}

.action-buttons {
  display: flex;
  gap: 8px;
}
</style>
