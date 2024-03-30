import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [vue()],
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
})
