import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://philately-store-bk-new-iota.vercel.app',
        secure: true, // This is correct for HTTPS
        changeOrigin: true, // Add this to ensure the host header is changed to match the target
      },
    },
  },
  plugins: [react()],
  build: {
    outDir: 'dist', // Output directory for the build
  },
  publicDir: 'public', // Directory for public assets
})
