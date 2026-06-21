import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Dev proxy: when running "npm run dev" locally, Vite will forward
    // any request starting with /api to http://localhost:5000.
    // This means you don't need to hardcode the backend URL in your code.
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
