# Ropiky.cz

Referenční portál o československém opevnění z let 1935–1938.

## Stack

- **Astro 5.x** — static site generator
- **Decap CMS** — web admin pro editaci obsahu
- **Cloudflare Pages** — hosting (zdarma)
- **OpenStreetMap + Leaflet** — interaktivní mapa
- **Pagefind** — klientské vyhledávání

## Lokální vývoj

```bash
npm install
npm run dev
```

Web běží na `http://localhost:4321`.

## Produkční build

```bash
npm run build
npm run preview
```

## Struktura

```
astro-project/
├── public/
│   ├── admin/              ← Decap CMS (web admin na /admin/)
│   │   ├── index.html
│   │   └── config.yml
│   └── favicon.svg
├── src/
│   ├── content/
│   │   ├── config.ts       ← schema pro content collections
│   │   ├── stranky/        ← statické stránky (historie, Mnichov...)
│   │   ├── typologie/      ← typy pevností (LO vz. 37, TO...)
│   │   ├── pevnosti/       ← databáze jednotlivých objektů
│   │   └── clanky/         ← blog články
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── ArticleLayout.astro
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── FortCard.astro
│   ├── pages/
│   │   ├── index.astro             ← homepage
│   │   ├── o-opevneni/[slug].astro ← dynamické stránky
│   │   ├── typologie/[slug].astro
│   │   ├── katalog/index.astro
│   │   └── katalog/[slug].astro
│   └── styles/
│       └── global.css
└── astro.config.mjs
```

## Editace obsahu

Produkčně: `https://www.ropiky.cz/admin/` → přihlášení přes GitHub → editace.

Lokálně: úpravou Markdown souborů v `src/content/`.

## Licence

- Kód: MIT
- Obsah (texty, fotky): CC BY-SA 4.0 (viz patička webu a stránka /zdroje)
