import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/swagger-files': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/api-docs': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})