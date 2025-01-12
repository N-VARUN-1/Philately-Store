// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  
  // Render.com specific configurations
  base: '/',
  
  dist: {
    outDir: 'dist'
  },
  
  server: {
    proxy: {
      '/api': {
        target: 'https://philately-store-1.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  }
})
