import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy: {
      '/api': {
        target: 'https://philately-store-bk-new-iota.vercel.app',
        secure: true
      },
    },
  },
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
  },
  publicDir: 'public', // added from chatgpt
})
