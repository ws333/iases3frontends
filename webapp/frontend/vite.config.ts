import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Define project type at build time
    __PROJECT_TYPE__: JSON.stringify('webapp'),
  },
});
