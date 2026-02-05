<script setup lang="ts">
import { BaseCard } from '@myorg/shared/components'

const features = [
  {
    icon: '📦',
    title: '共享组件',
    description: '基于 Vant UI 封装的通用组件，开箱即用',
  },
  {
    icon: '🎣',
    title: 'Composables',
    description: '常用的 Vue 3 组合式函数，提升开发效率',
  },
  {
    icon: '🔧',
    title: 'Utils 工具',
    description: '格式化、验证、存储等常用工具函数',
  },
  {
    icon: '📱',
    title: '移动端优先',
    description: '基于 Vant UI，完美适配移动端场景',
  },
]
</script>

<template>
  <div class="home">
    <div class="home-intro fade-in">
      <p>这是一个基于 <strong>pnpm Monorepo</strong> 的 Vue 3 项目演示</p>
      <p>展示如何在多个项目间共享组件、Composables 和 Utils</p>
    </div>

    <div class="features">
      <BaseCard
        v-for="(feature, index) in features"
        :key="index"
        :title="feature.title"
        :description="feature.description"
        class="feature-card fade-in"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <template #header>
          <div class="feature-header">
            <span class="feature-icon">{{ feature.icon }}</span>
            <div>
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-desc">{{ feature.description }}</p>
            </div>
          </div>
        </template>
      </BaseCard>
    </div>

    <div class="code-example demo-card fade-in" style="animation-delay: 0.4s">
      <h3 class="demo-card__title">使用方式</h3>
      <pre class="code-block"><code>// 在其他项目中使用共享包
import { BaseButton, BaseCard } from '@myorg/shared/components'
import { useLoading, useRequest } from '@myorg/shared/composables'
import { formatDate, isPhone } from '@myorg/shared/utils'</code></pre>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding-top: 10px;
}

.home-intro {
  text-align: center;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 24px;
  line-height: 1.8;
  font-size: 14px;
}

.home-intro strong {
  color: #fff;
  font-weight: 600;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-card {
  opacity: 0;
}

.feature-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px 0;
}

.feature-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.feature-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.feature-desc {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.code-example {
  opacity: 0;
}
</style>
