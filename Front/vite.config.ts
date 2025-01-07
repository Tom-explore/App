import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement basées sur le mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      legacy(),
    ],
    define: {
      'process.env': env, // Injecte les variables d'environnement
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      https: {
        key: fs.readFileSync(path.resolve(__dirname, './private-key.key')),
        cert: fs.readFileSync(path.resolve(__dirname, './01.pem')),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ionic-vendor': ['@ionic/react'],
            'framer-motion': ['framer-motion'],
            'swiper': ['swiper'],
            'fontawesome': [
              '@fortawesome/react-fontawesome',
              '@fortawesome/free-brands-svg-icons',
              '@fortawesome/free-solid-svg-icons',
            ],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
  };
});
