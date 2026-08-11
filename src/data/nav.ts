/**
 * Jediný zdroj pravdy pro navigaci webu.
 *
 * Z tohoto souboru se generuje desktopová lišta, mobilní menu, rozcestníkové
 * stránky jednotlivých sekcí i drobečková navigace. Nikdy nepiš navigaci
 * ručně na dvou místech — jinak se desktop a mobil rozejdou.
 */

export type NavChild = {
  /** Cílová adresa */
  href: string;
  /** Text v liště a nadpis dlaždice na rozcestníku */
  label: string;
  /** Popisek — používá se jen na rozcestníku, ne v liště */
  blurb?: string;
  /** Klíč kolekce, ze které se má spočítat počet položek (viz sectionCounts) */
  count?: 'pevnosti' | 'tvrze' | 'linie' | 'typologie' | 'vyzbroj' | 'cesty' | 'clanky';
};

export type NavSection = {
  /** Adresa rozcestníku — vždy klikatelná, nikdy jen přepínač dropdownu */
  href: string;
  /** Text v liště */
  label: string;
  /** Nadpis H1 rozcestníku */
  title: string;
  /** Perex rozcestníku */
  lead: string;
  /** Prefixy cest, které tuto sekci označují jako aktivní */
  match: string[];
  /** Položky dropdownu a dlaždice rozcestníku; prázdné = prostý odkaz bez dropdownu */
  children: NavChild[];
};

export const NAV: NavSection[] = [
  {
    href: '/o-opevneni',
    label: 'Opevnění',
    title: 'Československé opevnění 1935–1938',
    lead: 'Proč vzniklo, kdo ho stavěl, z čeho se skládalo a proč se o něj nikdy nebojovalo. Souhrnný úvod do problematiky — od politického rozhodnutí přes technické typy objektů až po Mnichov.',
    match: ['/o-opevneni', '/typologie', '/vyzbroj', '/casova-osa'],
    children: [
      {
        href: '/o-opevneni/co-je-rop',
        label: 'Co je ŘOP',
        blurb: 'Ředitelství opevňovacích prací — instituce, která za tři roky postavila přes 10 000 objektů.',
      },
      {
        href: '/o-opevneni/historie-a-politicky-kontext',
        label: 'Historie a politický kontext',
        blurb: 'Proč se malá republika rozhodla utratit miliardy za beton — a co tomu předcházelo.',
      },
      {
        href: '/typologie',
        label: 'Typologie objektů',
        blurb: 'Od lehkého řopíku po dělostřeleckou tvrz. Rozměry, odolnost, výzbroj, ceny.',
        count: 'typologie',
      },
      {
        href: '/vyzbroj',
        label: 'Výzbroj',
        blurb: 'Kulomety vz. 26, 35 a 37, protitankové kanony, minomety a pozorovací technika.',
        count: 'vyzbroj',
      },
      {
        href: '/casova-osa',
        label: 'Časová osa',
        blurb: 'Rok po roce od studijní cesty do Francie po záborová jednání.',
      },
      {
        href: '/o-opevneni/mnichov-a-osud-opevneni',
        label: 'Mnichov 1938 a osud opevnění',
        blurb: 'Co se stalo s hotovou linií, když padlo rozhodnutí nebránit se.',
      },
      {
        href: '/o-opevneni/nemecka-spionaz',
        label: 'Německá špionáž',
        blurb: 'Jak se abwehr dostával k plánům a co se na opevnění zkoušelo ostrými.',
      },
    ],
  },
  {
    href: '/ropiky',
    label: 'Řopíky',
    title: 'Řopíky',
    lead: 'Lehké opevnění vzor 37 — nejrozšířenější a nejznámější československý pevnostní objekt.',
    match: ['/ropiky'],
    children: [],
  },
  {
    href: '/objekty',
    label: 'Objekty',
    title: 'Objekty a linie',
    lead: 'Konkrétní stavby v terénu: úplný katalog dochovaných i zaniklých objektů, dělostřelecké tvrze a obranné linie, do kterých byly zapojeny.',
    match: ['/objekty', '/katalog', '/tvrze', '/linie', '/pevnosti-csr'],
    children: [
      {
        href: '/katalog',
        label: 'Katalog objektů',
        blurb: 'Prohledávatelná databáze jednotlivých objektů s polohou, typem a stavem.',
        count: 'pevnosti',
      },
      {
        href: '/tvrze',
        label: 'Dělostřelecké tvrze',
        blurb: 'Podzemní komplexy — Dobrošov, Hanička, Bouda, Adam, Smolkov a další.',
        count: 'tvrze',
      },
      {
        href: '/linie',
        label: 'Obranné linie',
        blurb: 'Geografický přehled úseků od Ostravy přes Orlické hory po jižní Moravu.',
        count: 'linie',
      },
      {
        href: '/mapa',
        label: 'Mapa objektů',
        blurb: 'Všechny objekty na jedné mapě — filtrovatelné podle typu a stavu.',
      },
    ],
  },
  {
    href: '/mapa',
    label: 'Mapa',
    title: 'Mapa objektů',
    lead: 'Všechny objekty na jedné mapě.',
    match: ['/mapa'],
    children: [],
  },
  {
    href: '/cesty',
    label: 'V terénu',
    title: 'V terénu',
    lead: 'Opevnění se dá projít pěšky. Tematické trasy po dochovaných objektech, muzeích a přístupných tvrzích — s odhadem času, náročnosti a s tím, co po cestě uvidíte.',
    match: ['/cesty'],
    children: [
      {
        href: '/cesty',
        label: 'Tematické cesty',
        blurb: 'Připravené trasy po jednotlivých úsecích a tématech.',
        count: 'cesty',
      },
      {
        href: '/mapa',
        label: 'Mapa objektů',
        blurb: 'Naplánujte si vlastní trasu podle toho, co je ve vašem okolí.',
      },
      {
        href: '/tvrze',
        label: 'Přístupné tvrze',
        blurb: 'Které podzemní komplexy jsou zpřístupněné veřejnosti.',
        count: 'tvrze',
      },
    ],
  },
  {
    href: '/clanky',
    label: 'Články',
    title: 'Články a prameny',
    lead: 'Delší texty vycházející z archivních dokumentů, výkladový slovník pevnostních pojmů a přehled pramenů, ze kterých web čerpá.',
    match: ['/clanky', '/glosar', '/zdroje'],
    children: [
      {
        href: '/clanky',
        label: 'Články',
        blurb: 'Texty z primárních pramenů — ceníky, směrnice, technika, utajení.',
        count: 'clanky',
      },
      {
        href: '/glosar',
        label: 'Glosář',
        blurb: 'Co znamená krakorec, předpancíř, granátový skluz nebo „arab".',
      },
      {
        href: '/zdroje',
        label: 'Zdroje a archiv',
        blurb: 'Archivní fondy, literatura a obrazové zdroje včetně fondu ŘOP ve VÚA–VHA.',
      },
    ],
  },
];

/** Je daná cesta uvnitř této sekce? */
export function sectionActive(section: NavSection, pathname: string): boolean {
  return section.match.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );
}

/** Najde sekci, do které patří daná cesta (pro drobečkovou navigaci). */
export function findSection(pathname: string): NavSection | undefined {
  return NAV.find((s) => sectionActive(s, pathname));
}
