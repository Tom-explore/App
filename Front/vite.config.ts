// vite.config.js
import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      legacy(),

    ],
    define: {
      'process.env': env, // Inject environment variables
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
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'react-vendor';
              }
              if (id.includes('@ionic/react') || id.includes('@ionic/react-router')) {
                return 'ionic-vendor';
              }
              if (id.includes('framer-motion')) {
                return 'framer-motion';
              }
              if (id.includes('swiper')) {
                return 'swiper';
              }
              if (id.includes('@fortawesome')) {
                return 'fontawesome';
              }
              if (id.includes('leaflet') || id.includes('react-leaflet') || id.includes('react-leaflet-cluster')) {
                return 'leaflet';
              }
              if (id.includes('js-cookie')) {
                return 'js-cookie';
              }
              if (id.includes('geolib')) {
                return 'geolib';
              }
              if (id.includes('react-window')) {
                return 'react-window';
              }
              if (id.includes('@react-spring')) {
                return 'react-spring';
              }
              // Add more conditions as needed for other large dependencies
            }
          },
        },
      },
      chunkSizeWarningLimit: 1000, // You can adjust this if necessary
      // Enable code splitting by default
      // Ensure that dynamic imports are used in your codebase where applicable
      // Other build optimizations can be added here
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@ionic/react',
        '@ionic/react-router',
        'framer-motion',
        'swiper',
        '@fortawesome/react-fontawesome',
        '@fortawesome/free-brands-svg-icons',
        '@fortawesome/free-solid-svg-icons',
        'leaflet',
        'react-leaflet',
        'react-leaflet-cluster',
        'js-cookie',
        'geolib',
        'react-window',
        '@react-spring/web',
      ],
    },
  };
});
