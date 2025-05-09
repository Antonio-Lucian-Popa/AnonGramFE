import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/anongram-fe/', // Set your base path here
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
