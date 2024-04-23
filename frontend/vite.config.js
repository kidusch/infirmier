import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import topLevelAwait from "vite-plugin-top-level-await"

// see: https://vitejs.dev/config/

export default defineConfig(({ command, mode }) => {
   console.log('mode=', mode, 'command=', command) // visible in the terminal where `npm run dev` or `npm run preview` is executed
   return {
      plugins: [
         vue({
            template: {
               compilerOptions: {
                  isCustomElement: tag => tag.startsWith('jcb-')
               },
            }
         }),
         topLevelAwait(),
         VitePWA({
            devOptions: {
               enabled: false
            },
            mode: "development",
            base: "/",
            srcDir: "src",
            filename: "sw.ts",
            includeAssets: ["/favicon.png"],
            strategies: "injectManifest",
            manifest: {
               name: "Infirmier",
               short_name: "Infirmier",
               theme_color: "#ffffff",
               start_url: "/",
               display: "standalone",
               background_color: "#ffffff",
               icons: [
                  {
                     src: "img/icons/logo-192x192.png",
                     sizes: "192x192",
                     type: "image/png",
                  },
                  {
                     src: "img/icons/logo-512x512.png",
                     sizes: "512x512",
                     type: "image/png",
                  },
                  {
                     src: "img/icons/logo-512x512.png",
                     sizes: "512x512",
                     type: "image/png",
                     purpose: "any maskable",
                  },
               ],
            },
         }),
      ],
      resolve: {
         alias: [
            { find: '@', replacement: '/src' },
         ],
      },
      server: {
         port: 8000,
         open: true,
         proxy: {
            '^/infirmier-socket-io/.*': {
               target: 'http://localhost:9500',
               ws: true,
               secure: false,
               changeOrigin: true,
            },
            '^/auth/.*': 'http://localhost:9500',
            '^/static/.*': 'http://localhost:9500',
         }
      },
      }
})
