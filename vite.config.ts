import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/presign': {
        target: 'http://localhost:3500',
        changeOrigin: true
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
