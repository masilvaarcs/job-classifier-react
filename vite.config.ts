import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // gRPC-Web -> serviço primário job-classifier-dotnet (porta 8000)
      '/dotnet': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dotnet/, ''),
      },
      // Dados do scraping (Python FastAPI porta 8001)
      '/dados': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
      },
      // Exportação Excel no microserviço Python (fora do escopo RPC v1)
      '/exportar': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
      },
    },
  },
})
