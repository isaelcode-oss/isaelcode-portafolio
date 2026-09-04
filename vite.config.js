import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    host: '127.0.0.1',
  },
  build: {
    // El chunk de three.js (~130 kB gzip) se carga con import() después del
    // arranque y no cuenta en el presupuesto inicial; el aviso por defecto
    // (500 kB) está pensado para chunks que sí bloquean la primera carga.
    chunkSizeWarningLimit: 600,
  },
})
