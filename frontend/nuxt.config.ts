// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/tokens.css', '~/assets/css/animations.css'],
  devServer: {
    host: '0.0.0.0', // Docker 等コンテナ外からアクセスするため（Windows/Mac 共通）
    port: 3000,
  },
  // HMR 用 WebSocket のポート競合を避ける（複数 dev 起動時や前回プロセス残存時）
  vite: {
    server: {
      hmr: {
        port: 24679,
        clientPort: 24679,
      },
    },
  },
  runtimeConfig: {
    dynamodbEndpoint: '', // ローカル: NUXT_DYNAMODB_ENDPOINT=http://localhost:8000
    dynamodbTable: 'task-management',
  },
  nitro: {
    preset: 'static',
  },
})
