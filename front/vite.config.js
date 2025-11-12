import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/FrontRevolution/',

  // Configuración para entorno local y Render
  server: {
    host: '0.0.0.0', // permite acceso externo (útil para pruebas en red)
    port: 5173, // puerto local por defecto
  },
  preview: {
    host: '0.0.0.0', // Render necesita escuchar en todas las interfaces
    port: 10000, // Render detecta automáticamente, pero es buena práctica fijarlo
    allowedHosts: ['revolutioncarwash.onrender.com'], // tu dominio de Render
  },
})
