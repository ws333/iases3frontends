import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import { PORT_DEV_DOCS } from '../webapp/frontend/src/constants/constants';

export default defineConfig({
  server: {
    port: PORT_DEV_DOCS,
    fs: {
      allow: [path.resolve(__dirname), path.resolve(__dirname, '../../addon/packages/interface')],
    },
  },
  plugins: [
    react(),
    {
      name: 'organize-assets',
      writeBundle() {
        // Post-build: move img folder to docs/img
        const distPath = path.resolve(__dirname, 'dist');
        const imgSrc = path.join(distPath, 'img');
        const imgDest = path.join(distPath, 'docs', 'img');

        if (fs.existsSync(imgSrc)) {
          // Create docs directory if it doesn't exist
          const docsDir = path.join(distPath, 'docs');
          if (!fs.existsSync(docsDir)) {
            fs.mkdirSync(docsDir, { recursive: true });
          }

          // Move img folder
          fs.renameSync(imgSrc, imgDest);
        }
      },
    },
  ],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names[0];
          // Put CSS and JS assets in docs/ subdirectory
          if (name.endsWith('.css') || name.endsWith('.js')) {
            return 'docs/assets/[name]-[hash][extname]';
          }
          // Put image assets from public/img in docs/img
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.exec(name)) {
            if (name.includes('send-email-page') || name.includes('settings-menu')) {
              return 'docs/img/[name][extname]';
            }
            // Other images go to docs/assets
            return 'docs/assets/[name]-[hash][extname]';
          }
          // Default for other assets
          return 'docs/assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'docs/assets/[name]-[hash].js',
        entryFileNames: 'docs/assets/[name]-[hash].js',
      },
    },
  },
});
