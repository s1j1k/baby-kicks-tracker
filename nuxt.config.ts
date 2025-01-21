// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxtjs/tailwindcss', '@vite-pwa/nuxt'],
  app: {
    head: {
      link: [
        { rel: 'icon', href: 'https://fav.farm/👶'}
      ]
    }
  },
  pwa: {
    manifest: {
      name: "Baby Kicks Tracker",
      short_name: "Baby Kicks",
      theme_color:'#3b82f6',
      description: "Sally Kalumba sallykalumba@gmail.com",
      icons: [
        {
          src: 'icon.png',
          sizes: "150x150",
          type: "image/png"
        },
      ]


    },
    workbox: {
      navigateFallback: "/",

    },
    devOptions: {
      enabled: true, 
      type: "module"
    }

  }
})