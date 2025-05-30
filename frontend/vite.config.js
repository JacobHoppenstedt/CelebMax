// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,          // This is important to use "expect" globally
    environment: 'jsdom',   // Use jsdom for browser-like testing
  },
  server: {
    watch: {
      usePolling: true,
      interval: 100,
    },
    host: true,
    port: 3000,
  },
});