import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  preview: {
    allowedHosts: [
      'nexuscllub-creator-nexus-website-production.up.railway.app'
    ]
  }
});
