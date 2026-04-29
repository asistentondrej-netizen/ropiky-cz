import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';
import fortLinker from './src/remark/fort-linker.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.ropiky.cz',
  integrations: [
    sitemap({
      // Per-URL priority/changefreq pro lepší crawl prioritization v Google
      serialize(item) {
        const url = item.url;

        // Pillar pages — nejvyšší priorita, často se mění
        if (
          url === 'https://www.ropiky.cz/' ||
          url === 'https://www.ropiky.cz/ropiky/' ||
          url === 'https://www.ropiky.cz/pevnosti-csr/'
        ) {
          item.priority = 1.0;
          item.changefreq = 'weekly';
          return item;
        }

        // Hlavní rubriky — vysoká priorita
        if (
          /\/(katalog|mapa|typologie|clanky|o-opevneni)\/?$/.test(url) ||
          url === 'https://www.ropiky.cz/zdroje/' ||
          url === 'https://www.ropiky.cz/o-projektu/'
        ) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
          return item;
        }

        // Typologie + statické stránky
        if (
          url.includes('/typologie/') ||
          url.includes('/o-opevneni/')
        ) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
          return item;
        }

        // Články
        if (url.includes('/clanky/')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
          return item;
        }

        // Detail pevnosti — nižší priorita (je jich 6 000+)
        if (url.includes('/katalog/')) {
          item.priority = 0.6;
          item.changefreq = 'monthly';
          return item;
        }

        // Default
        item.priority = 0.5;
        item.changefreq = 'monthly';
        return item;
      },
    }),
    pagefind(),
  ],
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
