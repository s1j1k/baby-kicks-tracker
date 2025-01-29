// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  runtimeConfig: {
    public: {
      fbApiKey: process.env.NUXT_PUBLIC_FB_API_KEY,
      fbAuthDomain: process.env.NUXT_PUBLIC_FB_AUTH_DOMAIN,
      fbProjectId: process.env.NUXT_PUBLIC_FB_PROJECT_ID,
      fbStorageBucket: process.env.NUXT_PUBLIC_FB_STORAGE_BUCKET,
      fbMessagingSenderId: process.env.NUXT_PUBLIC_FB_MESSAGING_SENDER_ID,
      fbAppId: process.env.NUXT_PUBLIC_FB_APP_ID,
      fbMeasurementId: process.env.NUXT_PUBLIC_FB_MEASUREMENT_ID,
    },
  },
  typescript: {
    typeCheck: true
  },
  colorMode: {
    preference: 'light'
  },
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxtjs/tailwindcss", "@vite-pwa/nuxt"],
  app: {
    head: {
      link: [{ rel: "icon", href: "https://fav.farm/👶" }],
    },
  },
  pwa: {
    manifest: {
      name: "Baby Kicks Tracker",
      short_name: "Baby Kicks",
      theme_color: "#f3f4f6", // Match it to the background color
      description: "Sally Kalumba sallykalumba@gmail.com",
      icons: [
        {
          src: "icon.png",
          sizes: "150x150",
          type: "image/png",
        },
      ],
    },
    workbox: {
      navigateFallback: "/",
    },
    devOptions: {
      enabled: true,
      type: "module",
    },
  },
});
