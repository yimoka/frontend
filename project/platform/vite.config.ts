/* eslint-disable @typescript-eslint/no-explicit-any */
import { URL, fileURLToPath } from 'url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8002,
    // 本地开发环境 允许任意域名访问
    host: true,
    proxy: {
      '/api': {
        target: 'https://platform.hs.zxnum.com',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 8102,
  },
  build: {
    sourcemap: true,
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['dayjs', 'dayjs/locale/zh-cn', 'axios', 'lodash-es'],
          react: ['react', 'react-dom', 'react-is', 'react-router-dom', 'react/jsx-runtime'],
          icon: ['@ant-design/icons'],
          yimoka: ['@yimoka/shared', '@yimoka/store', '@yimoka/react'],
          yimokaAntd: ['@yimoka/antd'],
        },
      },
    },
  },

  plugins: [
    react() as any,
    VitePWA({
      registerType: 'prompt',
      manifestFilename: 'manifest.json',
      manifest: {
        lang: 'zh-CN',
        name: '控制台',
        short_name: '控制台',
        description: '控制台',
        start_url: '.',
        theme_color: '#1890ff',
        background_color: '#fff',
        icons: [
          {
            src: '/logo48.png',
            sizes: '48x48',
            type: 'image/png',
          },
          {
            src: '/logo72.png',
            sizes: '72x72',
            type: 'image/png',
          },
          {
            src: '/logo96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: '/logo144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: '/logo168.png',
            sizes: '168x168',
            type: 'image/png',
          },
          {
            src: '/logo192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/logo512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      useCredentials: true,
      base: '/',
      workbox: {
        skipWaiting: false,
        clientsClaim: false,
      },
    }),
  ],
});
