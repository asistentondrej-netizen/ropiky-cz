import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.ropiky.cz',
  integrations: [sitemap(), pagefind()],
  build: {
    format: 'directory',
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
  vite: {
    build: {
      rollupOptions: {
        // Pagefind generuje /pagefind/pagefind.js až po buildu (astro-pagefind integrace),
        // takže Rollup při build-time tu cestu nesmí resolvovat.
        external: [/^\/pagefind\//],
      },
    },
  },
});
