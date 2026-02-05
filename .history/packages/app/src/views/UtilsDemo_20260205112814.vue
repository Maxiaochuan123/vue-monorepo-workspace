<script setup lang="ts">
import { ref, computed } from 'vue'
import { BaseButton, BaseCard } from '@myorg/shared/components'
import { 
  formatDate, 
  formatMoney, 
  formatFileSize, 
  maskPhone,
  isPhone,
  isEmail,
  isEmpty,
} from '@myorg/shared/utils'

// ========== 格式化演示 ==========
const now = new Date()
const amount = 1234567 // 分
const fileSize = 1536000 // bytes
const phone = '13812345678'

// ========== 验证演示 ==========
const testPhone = ref('138123456789')
const testEmail = ref('test@example.com')

const phoneValid = computed(() => isPhone(testPhone.value))
const emailValid = computed(() => isEmail(testEmail.value))

// 复制到剪贴板
const copyCode = (code: string) => {
  navigator.clipboard.writeText(code)
}
</script>

<template>
  <div class="utils-demo">
    <!-- 格式化工具演示 -->
    <div class="demo-card fade-in">
      <h3 class="demo-card__title">格式化工具 format</h3>
      <p class="demo-desc">日期、金额、文件大小、手机号等格式化</p>

      <div class="format-list">
        <div class="format-item">
          <span class="format-label">formatDate</span>
          <span class="format-value">{{ formatDate(now) }}</span>
        </div>
        <div class="format-item">
          <span class="format-label">formatDate (自定义)</span>
          <span class="format-value">{{ formatDate(now, 'YYYY年MM月DD日') }}</span>
        </div>
        <div class="format-item">
          <span class="format-label">formatMoney</span>
          <span class="format-value">{{ formatMoney(amount) }}</span>
        </div>
        <div class="format-item">
          <span class="format-label">formatFileSize</span>
          <span class="format-value">{{ formatFileSize(fileSize) }}</span>
        </div>
        <div class="format-item">
          <span class="format-label">maskPhone</span>
          <span class="format-value">{{ maskPhone(phone) }}</span>
        </div>
      </div>

      <pre class="code-block"><code>import { formatDate, formatMoney } from '@myorg/shared/utils'

formatDate(new Date()) // 2024-01-15 10:30:00
formatMoney(1234567)   // ¥12,345.67</code></pre>
    </div>

    <!-- 验证工具演示 -->
    <div class="demo-card fade-in" style="animation-delay: 0.1s">
      <h3 class="demo-card__title">验证工具 validate</h3>
      <p class="demo-desc">手机号、邮箱、身份证等常用验证</p>

      <div class="validate-group">
        <van-field
          v-model="testPhone"
          label="手机号"
          placeholder="请输入手机号"
          :error="!phoneValid && testPhone.length > 0"
          :error-message="!phoneValid && testPhone.length > 0 ? '手机号格式不正确' : ''"
        />
        <div class="validate-result">
          <span>isPhone 验证结果:</span>
          <span :class="['tag', phoneValid ? 'tag-success' : 'tag-error']">
            {{ phoneValid ? '✓ 有效' : '✗ 无效' }}
          </span>
        </div>
      </div>

      <div class="validate-group">
        <van-field
          v-model="testEmail"
          label="邮箱"
          placeholder="请输入邮箱"
          :error="!emailValid && testEmail.length > 0"
          :error-message="!emailValid && testEmail.length > 0 ? '邮箱格式不正确' : ''"
        />
        <div class="validate-result">
          <span>isEmail 验证结果:</span>
          <span :class="['tag', emailValid ? 'tag-success' : 'tag-error']">
            {{ emailValid ? '✓ 有效' : '✗ 无效' }}
          </span>
        </div>
      </div>

      <pre class="code-block"><code>import { isPhone, isEmail, isEmpty } from '@myorg/shared/utils'

isPhone('13812345678') // true
isEmail('test@example.com') // true
isEmpty('') // true</code></pre>
    </div>

    <!-- 存储工具演示 -->
    <div class="demo-card fade-in" style="animation-delay: 0.2s">
      <h3 class="demo-card__title">存储工具 storage</h3>
      <p class="demo-desc">localStorage / sessionStorage 封装，带前缀管理</p>

      <BaseCard>
        <div class="storage-info">
          <p>所有存储项自动添加 <code>myorg_</code> 前缀</p>
          <p>支持 JSON 序列化/反序列化</p>
          <p>提供类型安全的 get/set 方法</p>
        </div>
      </BaseCard>

      <pre class="code-block"><code>import { getStorage, setStorage } from '@myorg/shared/utils'

setStorage('user', { name: '张三', age: 25 })
const user = getStorage('user')
// localStorage key: myorg_user</code></pre>
    </div>

    <!-- 请求工具演示 -->
    <div class="demo-card fade-in" style="animation-delay: 0.3s">
      <h3 class="demo-card__title">请求工具 request</h3>
      <p class="demo-desc">基于 fetch 封装，支持超时、拦截器等</p>

      <BaseCard>
        <div class="request-features">
          <div class="feature-tag">✓ 超时控制</div>
          <div class="feature-tag">✓ 请求拦截</div>
          <div class="feature-tag">✓ JSON 自动解析</div>
          <div class="feature-tag">✓ 错误处理</div>
        </div>
      </BaseCard>

      <pre class="code-block"><code>import { createRequest } from '@myorg/shared/utils'

const api = createRequest({
  baseURL: 'https://api.example.com',
  timeout: 10000,
})

const data = await api.get('/users')
await api.post('/users', { name: '张三' })</code></pre>
    </div>
  </div>
</template>

<style scoped>
.utils-demo {
  padding-top: 10px;
}

.demo-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.format-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.format-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.format-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.format-value {
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  color: var(--primary-color);
  font-weight: 500;
}

.validate-group {
  margin-bottom: 16px;
}

.validate-result {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  padding-left: 12px;
  font-size: 13px;
}

.tag-success {
  background: #f0f9eb;
  color: #67c23a;
}

.tag-error {
  background: #fef0f0;
  color: #f56c6c;
}

.storage-info {
  font-size: 13px;
  line-height: 2;
  color: var(--text-secondary);
}

.storage-info code {
  background: #f0f2f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
  color: var(--primary-color);
}

.request-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.feature-tag {
  padding: 6px 12px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-radius: 20px;
  font-size: 12px;
  color: var(--primary-color);
}
</style>
