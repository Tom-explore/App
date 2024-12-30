// vite.config.js
import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

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
      host: '0.0.0.0', // Permet d'écouter sur toutes les interfaces réseau
      port: 5173, // Définit le port du serveur de développement
      strictPort: true, // Empêche Vite de basculer sur un autre port si le port est occupé
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
