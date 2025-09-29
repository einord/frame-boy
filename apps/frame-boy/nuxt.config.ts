import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: false,
  typescript: {
    strict: true,
    typeCheck: false,
  },
  app: {
    head: {
      title: 'Frame Boy Home Hub',
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
        },
        {
          name: 'description',
          content: 'Always-on home status display for calendars, reminders and smart home widgets.',
        },
      ],
    },
  },
  components: true,
  devtools: { enabled: true },
  css: ['~/assets/styles/base.css'],
  runtimeConfig: {
    public: {
      appName: 'Frame Boy',
    },
  },
})
