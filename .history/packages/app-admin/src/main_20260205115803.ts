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
      name: 'Dashboard',
      component: () => import('./views/Dashboard.vue'),
    },
    {
      path: '/users',
      name: 'Users',
      component: () => import('./views/Users.vue'),
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('./views/Settings.vue'),
    },
  ],
})

const app = createApp(App)
app.use(router)
app.mount('#app')
