import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import 'vant/lib/index.css'
import './styles/index.css'

// 路由配置
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('./views/Home.vue'),
    },
    {
      path: '/components',
      name: 'Components',
      component: () => import('./views/ComponentsDemo.vue'),
    },
    {
      path: '/composables',
      name: 'Composables',
      component: () => import('./views/ComposablesDemo.vue'),
    },
    {
      path: '/utils',
      name: 'Utils',
      component: () => import('./views/UtilsDemo.vue'),
    },
  ],
})

const app = createApp(App)
app.use(router)
app.mount('#app')
