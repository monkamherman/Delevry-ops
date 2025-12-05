import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
// import { envs } from './src/core/config/env';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import tsconfigPaths from 'vite-tsconfig-paths';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      process: path.resolve(__dirname, 'node_modules/process'),
    },
  },

  server: {
    host: process.env.HOST || '0.0.0.0',
    port: Number(process.env.PORT) || 4000,
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // URL de votre API
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
      },
    },
  },

  preview: {
    host: process.env.HOST || '0.0.0.0',
    port: Number(process.env.PORT) || 4000,
  },

  css: {
    postcss: './postcss.config.js',
  },
});
