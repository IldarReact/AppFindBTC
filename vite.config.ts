import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: true,
    port: 3000,
    headers: {
      'Content-Security-Policy': "frame-ancestors 'self' https://web.telegram.org https://*.telegram.org",
      'X-Frame-Options': 'ALLOW-FROM https://web.telegram.org/'
    }
  },
  build: {
    outDir: 'build',
    sourcemap: true
  }
})



