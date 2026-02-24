// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  // base path for deployment
  // use './' for relative paths (good for GitHub Pages)
  // use '/' if deploying to domain root
  base: './',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  server: {
    port: 5173, // default Vite port, change if needed
    open: true, // opens browser on start
  },

  build: {
    outDir: 'dist', // default build folder
    sourcemap: true, // useful for debugging deployed code
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'), // ensure correct entry
    },
  },
});