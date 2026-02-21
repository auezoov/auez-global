import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/auez-global/',
  plugins: [react()],
  server: {
    host: true, // Expose to local network
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5003',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist'
  }
})
