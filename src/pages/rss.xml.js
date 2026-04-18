import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const clanky = (await getCollection('clanky', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'Ropiky.cz — Články',
    description: 'Novinky a články o československém opevnění 1935–1938.',
    site: context.site,
    items: clanky.map((c) => ({
      title: c.data.title,
      pubDate: c.data.pubDate,
      description: c.data.description,
      link: `/clanky/${c.slug}/`,
    })),
    customData: '<language>cs-cz</language>',
  });
}
