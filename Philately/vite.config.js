import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
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
  }, // added from chatgpt
})
