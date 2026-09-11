import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  modules: ['nuxt-auth-utils'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    oauth: {
      oidc: {
        // Overridden by NUXT_OAUTH_OIDC_OPENID_CONFIG
        openidConfig: 'https://stubidp.cerberauth.com/.well-known/openid-configuration',
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
