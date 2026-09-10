import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { site } from './src/config/site';

// Static output. No adapter — Netlify serves `dist/` directly.
// An adapter is only introduced if server rendering or the Netlify Image CDN is needed.
export default defineConfig({
  site: site.url,
  trailingSlash: 'never',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  vite: {
    // Cast: Astro bundles its own copy of Vite, so the plugin type resolves
    // against a different Vite instance than the one Tailwind builds against.
    // The plugin itself is correct at runtime. Remove once the two dedupe.
    plugins: [tailwindcss() as never],
  },
  build: {
    inlineStylesheets: 'auto',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
