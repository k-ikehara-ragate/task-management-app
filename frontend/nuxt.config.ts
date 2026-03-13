// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/tokens.css', '~/assets/css/animations.css'],
  devServer: {
    port: 3000
  },
  // CloudFront + S3 静的配信用: ビルド成果物は .output/public に出力される
  nitro: {
    preset: 'static',
  },
})
