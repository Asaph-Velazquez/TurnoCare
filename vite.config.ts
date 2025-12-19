import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  // Prevenir que el navegador se abra automáticamente en Tauri
  server: {
    port: 5173,
    strictPort: true,
  },
  // Optimizaciones para Tauri
  clearScreen: false,
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    // Tauri usa Chromium en Windows, Edge en Linux y Safari en macOS
    target: (process.env.TAURI_PLATFORM === 'windows' ? 'chrome105' : 'safari13') as 'chrome105' | 'safari13',
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
})
