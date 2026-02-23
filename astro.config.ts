import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

// https://astro.build/config
// Using server output to enable middleware for language detection
export default defineConfig({
  output: 'server',
  adapter: netlify(),
  site: 'https://devisia.pro',
  trailingSlash: 'never',
  image: {
    // Allow remote image optimization for all current blog providers.
    domains: ['cdn.outrank.so', 'cdnimg.co'],
  },
});
