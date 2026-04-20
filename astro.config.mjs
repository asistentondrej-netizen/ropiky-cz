import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';
import fortLinker from './src/remark/fort-linker.mjs';

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
    remarkPlugins: [
      [fortLinker, { catalog: './src/content/pevnosti', maxLinksPerParagraph: 3 }],
    ],
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
