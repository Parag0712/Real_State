import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  'proxy':{
    '/api':"http://localhost:8000",
  },  
  plugins: [react()],
})
