import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      'lit/decorators': path.resolve(__dirname, 'node_modules/lit/decorators.js'),
      '@': path.resolve(__dirname, 'src/scss'),
    },
  },
});
