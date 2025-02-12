import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: process.env.API,
        changeOrigin: true,
        secure: true,
      },
    },
  },
  plugins: [react()]
})
