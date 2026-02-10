<script setup lang="ts">
import { BaseButton, BaseCard, LoadingOverlay } from '@myorg/shared/components'

const loading = ref(false)
const buttonLoading = ref(false)

function handleClick() {
  showToast('按钮被点击了！')
}

async function handleLoadingClick() {
  buttonLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 2000))
  buttonLoading.value = false
  showToast('加载完成！')
}

function toggleOverlay() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>

<template>
  <div class="components-demo">
    <!-- BaseButton 演示 -->
    <div class="demo-card fade-in">
      <h3 class="demo-card__title">
        BaseButton 按钮
      </h3>
      <p class="demo-desc">
        封装 Vant Button，提供统一的按钮样式
      </p>

      <div class="button-group">
        <BaseButton type="primary" @click="handleClick">
          主要按钮
        </BaseButton>
        <BaseButton type="success">
          成功按钮
        </BaseButton>
        <BaseButton type="warning">
          警告按钮
        </BaseButton>
        <BaseButton type="danger">
          危险按钮
        </BaseButton>
      </div>

      <div class="button-group">
        <BaseButton type="primary" size="large" block>
          大号块级按钮
        </BaseButton>
      </div>

      <div class="button-group">
        <BaseButton
          type="primary"
          :loading="buttonLoading"
          @click="handleLoadingClick"
        >
          点击加载
        </BaseButton>
        <BaseButton type="primary" disabled>
          禁用状态
        </BaseButton>
      </div>

      <pre
        class="code-block"
      ><code>import { BaseButton } from '@myorg/shared/components'

&lt;BaseButton type="primary" @click="handleClick"&gt;
  主要按钮
&lt;/BaseButton&gt;</code></pre>
    </div>

    <!-- BaseCard 演示 -->
    <div class="demo-card fade-in" style="animation-delay: 0.1s">
      <h3 class="demo-card__title">
        BaseCard 卡片
      </h3>
      <p class="demo-desc">
        通用卡片组件，支持标题、描述、插槽等
      </p>

      <BaseCard
        title="带标题的卡片"
        description="这是卡片的描述信息"
        shadow="hover"
      >
        <p>这是卡片的内容区域，可以放置任意内容。</p>
      </BaseCard>

      <BaseCard class="mt-12">
        <template #header>
          <div class="custom-header">
            <span class="emoji">🎨</span>
            <span>自定义 Header</span>
          </div>
        </template>
        <p>使用插槽自定义卡片头部内容</p>
        <template #footer>
          <BaseButton type="primary" size="small">
            操作按钮
          </BaseButton>
        </template>
      </BaseCard>

      <pre
        class="code-block"
      ><code>import { BaseCard } from '@myorg/shared/components'

&lt;BaseCard title="卡片标题" description="描述"&gt;
  卡片内容
&lt;/BaseCard&gt;</code></pre>
    </div>

    <!-- LoadingOverlay 演示 -->
    <div class="demo-card fade-in" style="animation-delay: 0.2s">
      <h3 class="demo-card__title">
        LoadingOverlay 加载遮罩
      </h3>
      <p class="demo-desc">
        全屏或局部加载遮罩组件
      </p>

      <BaseButton type="primary" @click="toggleOverlay">
        显示加载遮罩（2秒）
      </BaseButton>

      <pre
        class="code-block"
      ><code>import { LoadingOverlay } from '@myorg/shared/components'

&lt;LoadingOverlay
  :show="loading"
  text="加载中..."
  fullscreen
/&gt;</code></pre>
    </div>

    <!-- 全局加载遮罩 -->
    <LoadingOverlay :show="loading" text="加载中..." fullscreen />
  </div>
</template>

<style scoped>
.components-demo {
  padding-top: 10px;
}

.demo-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}

.mt-12 {
  margin-top: 12px;
}

.custom-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.emoji {
  font-size: 20px;
}
</style>
