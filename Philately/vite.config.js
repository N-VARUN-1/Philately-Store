import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Bind to all network interfaces
    port: 10000 // Use PORT or fallback to 3000
    proxy: {
      '/api': {
        target: 'https://philately-store-1.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  plugins: [react()],
  build: {
    outDir: 'dist' // Output directory for production build
  }
})
