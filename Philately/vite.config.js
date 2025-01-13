import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        port: 10000,
        host: '0.0.0.0',
        target: 'https://philately-store-1.onrender.com',
        changeOrigin: true, // Ensure the origin header matches the target server
        secure: true,       // For https targets
      },
    },
  },
  plugins: [react()],
})
