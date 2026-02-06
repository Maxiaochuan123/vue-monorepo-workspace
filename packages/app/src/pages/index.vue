<route lang="json5">
{
  name: '首页'
}
</route>

<script setup lang="ts">
const features = [
  {
    icon: 'i-carbon-box',
    title: '共享组件',
    description: '基于 Vant UI 封装的通用组件，开箱即用',
    color: 'text-blue-500',
    route: '/components',
  },
  {
    icon: 'i-carbon-function',
    title: 'Composables',
    description: '常用的 Vue 3 组合式函数，提升效率',
    color: 'text-green-500',
    route: '/composables',
  },
  {
    icon: 'i-carbon-tool-box',
    title: 'Utils 工具',
    description: '格式化、验证、存储等通用函数',
    color: 'text-orange-500',
    route: '/utils',
  },
  {
    icon: 'i-carbon-mobile',
    title: '移动端优先',
    description: '原生感适配，完美兼容各种屏幕',
    color: 'text-purple-500',
    route: '/',
  },
]

const router = useRouter()
function go(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="px-4 py-6 pb-24">
    <!-- Header Section -->
    <header class="fade-in mb-10 text-center">
      <div class="mb-4 p-4 rounded-full bg-blue-500/10 inline-block">
        <div class="i-carbon-rocket text-5xl text-blue-500" />
      </div>
      <h1 class="text-2xl text-gray-800 font-bold mb-2 dark:text-white">
        MyOrg Monorepo
      </h1>
      <p class="text-sm text-gray-400">
        Vue 3.5 + Vite 7 + UnoCSS + Vant 4
      </p>
    </header>

    <!-- Features Grid -->
    <div class="gap-4 grid">
      <div
        v-for="(feature, index) in features"
        :key="index"
        class="fade-in p-4 border border-gray-100 rounded-xl bg-white flex gap-4 cursor-pointer shadow-sm transition-transform items-center backdrop-blur-md dark:border-white/10 dark:bg-white/5 active:scale-95"
        :style="{ animationDelay: `${index * 0.1}s` }"
        @click="go(feature.route)"
      >
        <div :class="[feature.icon, feature.color]" class="text-3xl shrink-0" />
        <div>
          <h3 class="text-gray-800 font-semibold dark:text-white">
            {{ feature.title }}
          </h3>
          <p class="text-xs text-gray-500 mt-1">
            {{ feature.description }}
          </p>
        </div>
        <div class="i-carbon-chevron-right text-gray-400 ml-auto" />
      </div>
    </div>

    <!-- UI Component Demo (Vant) -->
    <div class="mt-8 pt-8 border-t border-gray-100 dark:border-white/10">
      <van-divider content-position="left" class="!text-gray-500">
        Vant 4 集成状态
      </van-divider>
      <div class="flex flex-wrap gap-2">
        <van-tag type="primary" plain>
          自动路由
        </van-tag>
        <van-tag type="success" plain>
          Pinia
        </van-tag>
        <van-tag type="warning" plain>
          UnoCSS
        </van-tag>
      </div>

      <div class="mt-4 flex gap-4">
        <van-button type="primary" block class="shadow-blue-500/30 shadow-lg">
          主要按钮
        </van-button>
        <van-button plain block>
          次要按钮
        </van-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
