<script setup lang="ts">
import { Tabbar, TabbarItem } from 'vant'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const active = computed({
  get: () => route.name as string,
  set: (name) => router.push({ name }),
})
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1 class="app-title">Vue Monorepo Demo</h1>
      <p class="app-subtitle">共享组件 · Composables · Utils</p>
    </header>

    <main class="app-main">
      <router-view />
    </main>

    <Tabbar v-model="active" route placeholder safe-area-inset-bottom>
      <TabbarItem name="Home" icon="home-o" to="/">首页</TabbarItem>
      <TabbarItem name="Components" icon="apps-o" to="/components">组件</TabbarItem>
      <TabbarItem name="Composables" icon="cluster-o" to="/composables">Hooks</TabbarItem>
      <TabbarItem name="Utils" icon="setting-o" to="/utils">工具</TabbarItem>
    </Tabbar>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.app-header {
  padding: 40px 20px 30px;
  text-align: center;
  color: white;
}

.app-title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.app-subtitle {
  margin: 10px 0 0;
  font-size: 14px;
  opacity: 0.9;
}

.app-main {
  padding: 0 16px 80px;
}
</style>
