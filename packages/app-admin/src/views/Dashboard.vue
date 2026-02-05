<script setup lang="ts">
import { ref } from 'vue'
// 使用共享包的组件和工具 👇
import { BaseCard, BaseButton } from '@myorg/shared/components'
import { useRequest } from '@myorg/shared/composables'
import { formatDate, formatMoney } from '@myorg/shared/utils'

// 模拟获取统计数据
const mockFetchStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 800))
  return {
    totalUsers: 12580,
    totalOrders: 3842,
    totalRevenue: 98672500, // 分
    todayVisits: 2341,
  }
}

const { data: stats, loading } = useRequest(mockFetchStats, { immediate: true })

const statCards = [
  { label: '总用户数', key: 'totalUsers', icon: '👥', color: '#667eea' },
  { label: '总订单数', key: 'totalOrders', icon: '📦', color: '#f093fb' },
  { label: '总营收', key: 'totalRevenue', icon: '💰', color: '#4facfe', isMoney: true },
  { label: '今日访问', key: 'todayVisits', icon: '📊', color: '#43e97b' },
]

const formatValue = (value: number, isMoney?: boolean) => {
  if (isMoney) return formatMoney(value)
  return value.toLocaleString()
}
</script>

<template>
  <div class="dashboard">
    <!-- 提示信息 -->
    <BaseCard class="info-card fade-in-up">
      <div class="info-content">
        <span class="info-icon">💡</span>
        <div>
          <strong>这是管理后台项目</strong>
          <p>它和 H5 App 一样，使用了 <code>@myorg/shared</code> 的组件和工具。</p>
          <p>修改 shared 包的代码，两个项目都会实时更新！</p>
        </div>
      </div>
    </BaseCard>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div
        v-for="(card, index) in statCards"
        :key="card.key"
        class="stat-card fade-in-up"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div 
          class="stat-card__icon" 
          :style="{ background: `${card.color}20`, color: card.color }"
        >
          {{ card.icon }}
        </div>
        <div class="stat-card__content">
          <div class="stat-card__value">
            <template v-if="loading">--</template>
            <template v-else>
              {{ formatValue(stats?.[card.key as keyof typeof stats] || 0, card.isMoney) }}
            </template>
          </div>
          <div class="stat-card__label">{{ card.label }}</div>
        </div>
      </div>
    </div>

    <!-- 演示共享组件 -->
    <BaseCard title="共享组件演示" class="demo-section fade-in-up" style="animation-delay: 0.4s">
      <p class="section-desc">这些组件来自 <code>@myorg/shared/components</code></p>
      <div class="button-group">
        <BaseButton type="primary">主要按钮</BaseButton>
        <BaseButton type="success">成功按钮</BaseButton>
        <BaseButton type="warning">警告按钮</BaseButton>
        <BaseButton type="danger">危险按钮</BaseButton>
      </div>
    </BaseCard>

    <!-- 演示共享工具 -->
    <BaseCard title="共享工具演示" class="demo-section fade-in-up" style="animation-delay: 0.5s">
      <p class="section-desc">这些工具来自 <code>@myorg/shared/utils</code></p>
      <div class="utils-demo">
        <div class="util-item">
          <span class="util-label">formatDate:</span>
          <span class="util-value">{{ formatDate(new Date()) }}</span>
        </div>
        <div class="util-item">
          <span class="util-label">formatMoney:</span>
          <span class="util-value">{{ formatMoney(12345678) }}</span>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
  border: 1px solid #667eea40;
}

.info-content {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.info-icon {
  font-size: 24px;
}

.info-content p {
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.info-content code {
  background: #667eea20;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
  color: #667eea;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.demo-section {
  opacity: 0;
}

.section-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.section-desc code {
  background: #f0f2f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
  color: #667eea;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.utils-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.util-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.util-label {
  font-weight: 500;
  color: var(--text-secondary);
}

.util-value {
  font-family: 'Fira Code', monospace;
  color: #667eea;
}
</style>
