import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import motaServerPlugin from './vite-plugin-mota-server'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    motaServerPlugin(),
  ],
  publicDir: 'public',
  server: {
    port: 3000,
    host: '127.0.0.1',
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 确保所有资源都被正确复制
    copyPublicDir: true,
  },
})
