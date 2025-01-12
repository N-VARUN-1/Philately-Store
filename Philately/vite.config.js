import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: mode === 'development' ? {
      '/api': {
        target: 'https://philately-store-1.onrender.com',
        changeOrigin: true,
      },
    } : {},
  },
  plugins: [react()],
})
