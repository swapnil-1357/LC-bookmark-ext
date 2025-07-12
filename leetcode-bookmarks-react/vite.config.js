// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const isContent = process.env.VITE_BUILD_TARGET === 'content';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    'process.env': {}, // Prevents process-related errors
  },
  build: {
    rollupOptions: {
      input: isContent
        ? { content: resolve(__dirname, 'src/content.jsx') }
        : { popup: resolve(__dirname, 'public/index.html') },

      output: {
        entryFileNames: chunk => {
          if (chunk.name === 'content') return 'content.js';
          if (chunk.name === 'popup') return 'popup.js';
          return '[name].js';
        },
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]',
      },

      // ✅ Prevent bundling Chrome extension APIs
      external: isContent ? ['chrome'] : []
    },
    outDir: 'dist',
    emptyOutDir: !isContent,
    target: 'esnext',
    minify: true,
    sourcemap: false,
  }
});
