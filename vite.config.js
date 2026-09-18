import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// PORT lets a preview harness assign a free port; the default stays 5173.
// BASE_PATH sets the public base for sub-path hosting (GitHub Pages uses /<repo>/).
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || '/',
  server: { port: process.env.PORT ? Number(process.env.PORT) : 5173 },
});
