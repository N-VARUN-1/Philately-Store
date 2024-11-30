import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy: {
      '/api/(.*)': {
        target: 'https://philately-store-backend.vercel.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
  plugins: [react()],
  base: '/Philately',
  build: {
    outDir: 'dist',
  }, // added from chatgpt
})
