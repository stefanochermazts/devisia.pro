import { defineConfig } from 'astro/config';

// https://astro.build/config
// Note: No adapter needed for static output on Netlify
// Netlify will serve the static files from dist/ directly
export default defineConfig({
  output: 'static',
  site: 'https://devisia.pro',
});
