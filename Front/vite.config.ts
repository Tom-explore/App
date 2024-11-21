/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement basées sur le mode
  const env = loadEnv(mode, process.cwd(), '')

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
  }
})
