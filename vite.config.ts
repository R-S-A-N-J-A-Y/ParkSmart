import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/parkSmart/',  // This sets the base path for your app on GitHub Pages
  build: {
    outDir: 'dist',  // Ensure the build output is in the 'dist' folder
  },
});
