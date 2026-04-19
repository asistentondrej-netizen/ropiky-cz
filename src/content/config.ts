import { defineCollection, z } from 'astro:content';

// ---------- Statické stránky (O opevnění...) ----------
const stranky = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().default(99),
    updated: z.coerce.date().optional(),
    sources: z.array(z.string()).optional(),
  }),
});

// ---------- Typologie pevností (LO vz. 36, 37, TO...) ----------
const typologie = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    code: z.string(),                    // např. "LO vz. 37"
    category: z.enum(['lehke', 'tezke']),
    description: z.string(),
    period: z.string(),                  // např. "1937–1938"
    builtCount: z.number().optional(),   // počet postavených
    armament: z.array(z.string()).optional(),
    order: z.number().default(99),
    updated: z.coerce.date().optional(),
    sources: z.array(z.string()).optional(),
    isComponent: z.boolean().default(false), // komponenta (zvon, kopule…), ne typ objektu
    isPrototype: z.boolean().default(false), // prototyp/experiment — nerealizovaný sériově
  }),
});

// ---------- Databáze konkrétních pevností ----------
const pevnosti = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),                   // jméno objektu
    code: z.string(),                    // úseko-objekt, např. "MO-S 5"
    type: z.string(),                    // odkaz na typologii (slug)
    line: z.string(),                    // úsek/oblast, např. "Mladá Boleslav"
    region: z.string(),                  // kraj
    location: z.object({
      lat: z.number(),
      lon: z.number(),
      address: z.string().optional(),
    }),
    built: z.string().optional(),        // datum dokončení
    state: z.enum(['muzeum', 'pristupny', 'zachovaly', 'zavreny', 'rozpadly', 'zničeny', 'neznamy']),
    description: z.string(),
    history: z.string().optional(),
    visit: z.string().optional(),        // info pro návštěvníky
    photos: z.array(z.object({
      url: z.string(),
      alt: z.string(),
      author: z.string().optional(),
      license: z.string().optional(),
      source: z.string().url().optional(),
    })).optional(),
    sources: z.array(z.string()).optional(),
    updated: z.coerce.date().optional(),
  }),
});

// ---------- Blog / Aktuality ----------
const clanky = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default('Redakce ropiky.cz'),
    tags: z.array(z.string()).optional(),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { stranky, typologie, pevnosti, clanky };
