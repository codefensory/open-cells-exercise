import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
            @use "@/base";
          `,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/css'),
    },
  },
  optimizeDeps: {
    exclude: ['/__web-dev-server__web-socket.js'],
  },
});
