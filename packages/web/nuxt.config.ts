// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    serverMiddleware: [
        { path: "/api", handler: "~/server-middleware/bff/index.ts" },
      ],
})
