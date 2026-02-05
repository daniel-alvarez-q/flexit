import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  preview:{
    host:true,
    port:3000,
  },
  server: {
    host:true,
    port:3000,
    strictPort: true,
  }
})
