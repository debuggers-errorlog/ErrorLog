import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // API 요청은 백엔드로 연결
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // 이미지 업로드 경로도 백엔드로 연결
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
