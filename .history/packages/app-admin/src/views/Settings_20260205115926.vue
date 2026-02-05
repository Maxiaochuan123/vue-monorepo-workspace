<script setup lang="ts">
// 使用共享包 👇
import { BaseCard, BaseButton } from '@myorg/shared/components'
import { useStorage } from '@myorg/shared/composables'
import { showToast, Switch, Field, CellGroup, Cell } from 'vant'

// 使用 useStorage 持久化设置
const darkMode = useStorage('admin_dark_mode', false)
const notifications = useStorage('admin_notifications', true)
const language = useStorage('admin_language', 'zh-CN')

const handleSave = () => {
  showToast('设置已保存（自动同步到 localStorage）')
}

const handleReset = () => {
  darkMode.value = false
  notifications.value = true
  language.value = 'zh-CN'
  showToast('已重置默认设置')
}
</script>

<template>
  <div class="settings-page">
    <BaseCard class="fade-in-up">
      <h3 class="admin-card__title">系统设置</h3>
      
      <div class="info-box">
        <span>💡</span>
        <span>
          使用 <code>useStorage</code> 组合式函数，设置会自动保存到 localStorage，
          刷新页面后依然保持。
        </span>
      </div>

      <van-cell-group inset class="settings-group">
        <van-cell title="深色模式" label="开启后使用深色主题">
          <template #right-icon>
            <van-switch v-model="darkMode" />
          </template>
        </van-cell>
        <van-cell title="消息通知" label="接收系统消息推送">
          <template #right-icon>
            <van-switch v-model="notifications" />
          </template>
        </van-cell>
        <van-cell title="语言" :value="language === 'zh-CN' ? '简体中文' : 'English'" is-link />
      </van-cell-group>

      <div class="settings-preview">
        <h4>当前设置值（存储在 localStorage）：</h4>
        <pre class="code-block"><code>{
  "admin_dark_mode": {{ darkMode }},
  "admin_notifications": {{ notifications }},
  "admin_language": "{{ language }}"
}</code></pre>
      </div>

      <div class="button-group">
        <BaseButton type="primary" @click="handleSave">保存设置</BaseButton>
        <BaseButton @click="handleReset">重置默认</BaseButton>
      </div>
    </BaseCard>

    <BaseCard title="关于共享包" class="fade-in-up" style="animation-delay: 0.1s">
      <div class="about-content">
        <p>当前项目使用的共享包：<code>@myorg/shared</code></p>
        
        <h4>共享内容：</h4>
        <ul>
          <li><strong>组件</strong>：BaseButton, BaseCard, LoadingOverlay</li>
          <li><strong>Composables</strong>：useLoading, useRequest, useStorage, useDebounce</li>
          <li><strong>Utils</strong>：formatDate, formatMoney, isPhone, isEmail 等</li>
        </ul>

        <h4>目录结构：</h4>
        <pre class="code-block"><code>packages/
├── shared/          ← 共享包
├── app/             ← H5 应用 (端口 3001)
└── app-admin/       ← 管理后台 (端口 3002) ← 当前项目</code></pre>
      </div>
    </BaseCard>
  </div>
</template>

<style scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #fff7e6;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
  color: #fa8c16;
}

.info-box code {
  background: #fff2e8;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
}

.settings-group {
  margin: 0 -20px 20px;
}

.settings-preview {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.settings-preview h4 {
  margin: 0 0 12px;
  font-size: 14px;
  color: var(--text-secondary);
}

.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 12px 16px;
  border-radius: 8px;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 13px;
  overflow-x: auto;
  margin: 0;
}

.button-group {
  display: flex;
  gap: 12px;
}

.about-content {
  font-size: 14px;
  line-height: 1.8;
}

.about-content code {
  background: #f0f2f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
  color: #667eea;
}

.about-content h4 {
  margin: 16px 0 8px;
  font-size: 14px;
}

.about-content ul {
  padding-left: 20px;
  margin: 0;
}

.about-content li {
  margin: 4px 0;
}
</style>
