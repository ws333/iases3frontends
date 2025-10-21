import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
// WARNING: Do NOT import any constants or files that use import.meta.env here!
// Only import plain values. See constants.ts and constantsImportMeta.ts for details.
import { PATH_BASE, PORT_DEV_FAXAPP } from './src/constants/constants';

// https://vite.dev/config/
export default defineConfig({
  base: PATH_BASE,
  plugins: [react()],
  server: {
    port: PORT_DEV_FAXAPP,
    fs: {
      allow: [path.resolve(__dirname), path.resolve(__dirname, '../../addon/packages/interface')],
    },
  },
  resolve: {
    alias: {
      '@lib/ui': path.resolve(__dirname, './node_modules/ui-kit/lib/ui'),
      '@lib/utils': path.resolve(__dirname, './node_modules/ui-kit/lib/utils'),
      '@lib/codegen': path.resolve(__dirname, './node_modules/ui-kit/lib/codegen'),
    },
  },
  build: {
    target: 'ES2022',
    chunkSizeWarningLimit: 2048,
    // minify: false,
    // sourcemap: true,
  },
});
