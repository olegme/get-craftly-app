import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Import the Tailwind CSS Vite plugin

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss() // Use the Tailwind CSS plugin
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into separate chunks
          'react-vendor': ['react', 'react-dom'],
          'firebase-vendor': ['firebase/app', 'firebase/firestore', 'firebase/auth'],
          'react-dnd': ['react-dnd', 'react-dnd-html5-backend'],
          'lucide-react': ['lucide-react'],
          'date-fns': ['date-fns'],
          'react-datepicker': ['react-datepicker'],
        }
      }
    }
  }
})
