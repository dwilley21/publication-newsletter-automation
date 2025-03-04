// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  
  // Pass environment variables to the server
  runtimeConfig: {
    // Server-only environment variables
    BREVO_API_KEY: process.env.BREVO_API_KEY,
    
    // Public variables that are also available client-side
    public: {
      apiBase: process.env.API_BASE || '/api'
    }
  }
})