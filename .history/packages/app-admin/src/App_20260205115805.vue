<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from 'vant'

const route = useRoute()
const router = useRouter()

const menuItems = [
  { name: 'Dashboard', icon: 'chart-trending-o', label: '仪表盘', path: '/' },
  { name: 'Users', icon: 'friends-o', label: '用户管理', path: '/users' },
  { name: 'Settings', icon: 'setting-o', label: '系统设置', path: '/settings' },
]

const currentRoute = computed(() => route.name)

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <span class="logo">🏢</span>
        <h1 class="app-name">管理后台</h1>
      </div>
      <nav class="sidebar-nav">
        <div
          v-for="item in menuItems"
          :key="item.name"
          :class="['nav-item', { active: currentRoute === item.name }]"
          @click="navigateTo(item.path)"
        >
          <Icon :name="item.icon" size="20" />
          <span>{{ item.label }}</span>
        </div>
      </nav>
      <div class="sidebar-footer">
        <div class="user-info">
          <div class="avatar">A</div>
          <div class="user-details">
            <div class="username">Admin</div>
            <div class="role">超级管理员</div>
          </div>
        </div>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="main-content">
      <header class="content-header">
        <h2 class="page-title">
          {{ menuItems.find(m => m.name === currentRoute)?.label || '仪表盘' }}
        </h2>
        <div class="header-actions">
          <span class="project-badge">@myorg/app-admin</span>
        </div>
      </header>
      <div class="content-body">
        <router-view />
      </div>
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f0f2f5;
}

.sidebar {
  width: 240px;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  color: white;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 24px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  font-size: 28px;
}

.app-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4px;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.username {
  font-weight: 500;
}

.role {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-header {
  background: white;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a2e;
}

.project-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-family: 'Fira Code', monospace;
}

.content-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}
</style>
