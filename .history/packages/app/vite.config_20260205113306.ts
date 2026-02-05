import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      // 开发环境直接引用共享包源码
      '@myorg/shared/components': resolve(__dirname, '../shared/src/components'),
      '@myorg/shared/composables': resolve(__dirname, '../shared/src/composables'),
      '@myorg/shared/utils': resolve(__dirname, '../shared/src/utils'),
      '@myorg/shared': resolve(__dirname, '../shared/src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ['vue', 'vue-router', 'vant'],
  },
})
