import { defineCollection, z } from 'astro:content';

// ---------- Helper enumy ----------
const Odolnost = z.enum(['I', 'II', 'III', 'IV', 'neurceno']);
const StupenDokonceni = z.enum([
  'dokonceny',
  'dokonceny-bez-vyzbroje',
  'hruba-stavba',
  'rozestaveny',
  'plan-nedokonceny',
]);
const Pristupnost = z.enum([
  'auto-az-k-objektu',
  'auto-kratka-chuze',
  'pesky-turisticka',
  'pesky-narocna',
  'kolo',
  'uzavreno',
]);
const VhodnostRodiny = z.enum(['idealni', 'doporuceno', 'starsi-deti', 'jen-dospeli']);
const PamatkaStatus = z.enum(['nkp', 'kulturni-pamatka', 'pamatkova-zona', 'zadna', 'neznamy']);

// ---------- Statické stránky ----------
const stranky = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().default(99),
    updated: z.coerce.date().optional(),
    sources: z.array(z.string()).optional(),
    related: z.array(z.string()).optional(),
  }),
});

// ---------- Typologie ----------
const typologie = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    code: z.string(),
    category: z.enum(['lehke', 'tezke']),
    description: z.string(),
    period: z.string(),
    builtCount: z.number().optional(),
    armament: z.array(z.string()).optional(),
    order: z.number().default(99),
    updated: z.coerce.date().optional(),
    sources: z.array(z.string()).optional(),
    isComponent: z.boolean().default(false),
    isPrototype: z.boolean().default(false),
  }),
});

// ---------- Pevnosti (rozšířeno v T1.1) ----------
const pevnosti = defineCollection({
  type: 'data',
  schema: z.object({
    // === ZÁKLAD (stávající, zachovat) ===
    title: z.string(),
    code: z.string(),
    type: z.string(),
    line: z.string(),
    region: z.string(),
    location: z.object({
      lat: z.number(),
      lon: z.number(),
      address: z.string().optional(),
      elevation: z.number().optional(), // NOVÉ
    }),
    built: z.string().optional(),
    state: z.enum(['muzeum', 'pristupny', 'zachovaly', 'zavreny', 'rozpadly', 'zničeny', 'neznamy']),
    description: z.string(),
    history: z.string().optional(),
    visit: z.string().optional(),

    // === TECHNICKÁ KARTA (NOVÉ) ===
    tech: z
      .object({
        odolnost: Odolnost.optional(),
        stupenDokonceni: StupenDokonceni.optional(),
        typObjektu: z.string().optional(),
        orientace: z.string().optional(),
        posadka: z
          .object({
            mini: z.number().optional(),
            maxi: z.number().optional(),
            poznamka: z.string().optional(),
          })
          .optional(),
        vyzbroj: z
          .array(
            z.object({
              zbran: z.string(),
              pocet: z.number().default(1),
              umisteni: z.string().optional(),
            })
          )
          .optional(),
        steny: z
          .object({
            tloustka_cm: z.number().optional(),
            material: z.string().optional(),
          })
          .optional(),
        komponenty: z.array(z.string()).optional(),
      })
      .optional(),

    // === STAVBA (NOVÉ) ===
    stavba: z
      .object({
        projektant: z.string().optional(),
        stavebniFirma: z.string().optional(),
        zahajeni: z.string().optional(),
        dokonceni: z.string().optional(),
        betonaz_m3: z.number().optional(),
        cena_kc_1938: z.number().optional(),
        cena_kc_dnes_priblizne: z.number().optional(),
        delnikuPocet: z.number().optional(),
        poznamka: z.string().optional(),
      })
      .optional(),

    // === HISTORIE MILNÍKY (NOVÉ) ===
    historieMilniky: z
      .array(
        z.object({
          datum: z.string(),
          udalost: z.string(),
          zdroj: z.string().optional(),
        })
      )
      .optional(),

    // === NÁVŠTĚVA (NOVÉ) ===
    navsteva: z
      .object({
        pristupnost: Pristupnost.optional(),
        vhodnostRodiny: VhodnostRodiny.optional(),
        doporucenaDoba_minut: z.number().optional(),
        otevreno: z
          .object({
            sezonne: z.boolean().default(false),
            obdobi: z.string().optional(),
            dny: z.string().optional(),
            hodiny: z.string().optional(),
            poznamka: z.string().optional(),
          })
          .optional(),
        vstupne: z
          .object({
            zakladni_kc: z.number().optional(),
            snizene_kc: z.number().optional(),
            rodinne_kc: z.number().optional(),
            zdarma: z.boolean().default(false),
            poznamka: z.string().optional(),
          })
          .optional(),
        rezervace: z
          .object({
            nutna: z.boolean().default(false),
            url: z.string().url().optional(),
            telefon: z.string().optional(),
          })
          .optional(),
        parkovani: z.string().optional(),
        mhd: z.string().optional(),
        teplotaUvnitr_C: z.number().optional(),
        upozorneni: z.array(z.string()).optional(),
      })
      .optional(),

    // === SPRAVUJÍCÍ SUBJEKT (NOVÉ) ===
    spravujicSubjekt: z
      .object({
        nazev: z.string(),
        typ: z.enum(['muzeum', 'klub-vojenske-historie', 'obec', 'soukromy', 'statni', 'neznamy']).optional(),
        web: z.string().url().optional(),
        email: z.string().optional(),
        telefon: z.string().optional(),
      })
      .optional(),

    // === MÉDIA (rozšířeno) ===
    photos: z
      .array(
        z.object({
          url: z.string(),
          alt: z.string(),
          caption: z.string().optional(),
          author: z.string().optional(),
          license: z.string().optional(),
          source: z.string().url().optional(),
          category: z.enum(['exterier', 'interier', 'detail', 'dobova', 'pudorys', 'terenni']).optional(),
          featured: z.boolean().default(false),
        })
      )
      .optional(),
    floorplan: z
      .object({
        url: z.string(),
        alt: z.string(),
        zdroj: z.string().optional(),
      })
      .optional(),
    video: z
      .array(
        z.object({
          platform: z.enum(['youtube', 'vimeo']),
          id: z.string(),
          title: z.string(),
        })
      )
      .optional(),

    // === PAMÁTKOVÁ OCHRANA (NOVÉ) ===
    pamatka: z
      .object({
        status: PamatkaStatus.optional(),
        cisloUspka: z.string().optional(),
        poznamka: z.string().optional(),
      })
      .optional(),

    // === CROSS-LINKING (NOVÉ) ===
    related: z
      .object({
        clanky: z.array(z.string()).optional(),
        pevnosti: z.array(z.string()).optional(),
        typologie: z.array(z.string()).optional(),
      })
      .optional(),
    castTvrze: z.string().optional(),

    // === ZDROJE (rozšířeno — string nebo objekt) ===
    sources: z
      .array(
        z.union([
          z.string(),
          z.object({
            title: z.string(),
            author: z.string().optional(),
            year: z.number().optional(),
            url: z.string().url().optional(),
            type: z.enum(['kniha', 'clanek', 'archiv', 'web', 'terenni-pruzkum']).optional(),
          }),
        ])
      )
      .optional(),

    // === SEO ===
    seo: z
      .object({
        ogImage: z.string().optional(),
        canonical: z.string().url().optional(),
        noindex: z.boolean().default(false),
      })
      .optional(),

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
    related: z.array(z.string()).optional(),
  }),
});

// ---------- Tematické cesty ----------
const Obtiznost = z.enum(['snadna', 'stredni', 'narocna']);
const Rocni = z.enum(['celorocne', 'sezonne-duben-rijen', 'jen-leto']);

const cesty = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    region: z.string(),
    delka_km: z.number().optional(),
    delka_dni: z.number().default(1),
    obtiznost: Obtiznost.default('stredni'),
    rocni: Rocni.default('sezonne-duben-rijen'),
    doprava: z.enum(['auto', 'auto-chuze', 'mhd-chuze', 'kolo', 'pesky']).default('auto-chuze'),
    startPoint: z.object({
      nazev: z.string(),
      lat: z.number(),
      lon: z.number(),
    }),
    endPoint: z
      .object({
        nazev: z.string(),
        lat: z.number(),
        lon: z.number(),
      })
      .optional(),
    // Posloupnost zastávek — slugy pevností nebo externí body
    zastavky: z.array(
      z.object({
        slug: z.string().optional(),
        nazev: z.string(),
        typ: z.enum(['pevnost', 'muzeum', 'obec', 'priroda', 'gastro']).default('pevnost'),
        poznamka: z.string().optional(),
        doba_minut: z.number().optional(),
      })
    ),
    cover: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { stranky, typologie, pevnosti, clanky, cesty };
