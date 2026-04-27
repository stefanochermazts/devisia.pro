import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import rehypeExternalLinks from 'rehype-external-links';
import type { Element } from 'hast';

/** Hostnames treated as same-site (no target="_blank" for absolute URLs). */
const SAME_SITE_HOSTS = new Set(['devisia.pro', 'localhost']);

function isExternalHref(href: string): boolean {
  try {
    if (href.startsWith('//')) {
      const u = new URL(`https:${href}`);
      return !SAME_SITE_HOSTS.has(u.hostname.replace(/^www\./i, '').toLowerCase());
    }
    if (!/^https?:/i.test(href)) return true;
    const u = new URL(href);
    return !SAME_SITE_HOSTS.has(u.hostname.replace(/^www\./i, '').toLowerCase());
  } catch {
    return true;
  }
}

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
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['noopener', 'noreferrer'],
          test: (node: Element) => {
            const href = node.properties?.href;
            return typeof href === 'string' && isExternalHref(href);
          },
        },
      ],
    ],
  },
});
