import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import { getCustomPages } from './src/lib/sitemap-helper';

// https://astro.build/config
// Using server output to enable middleware for language detection
export default defineConfig({
  output: 'server',
  adapter: netlify(),
  site: 'https://devisia.pro',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      // In SSR mode, we must manually provide dynamic routes
      customPages: await getCustomPages(),
    }),
  ],
});
