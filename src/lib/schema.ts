/**
 * Schema.org JSON-LD helpers for ropiky.cz
 *
 * Každá funkce vrací čistý objekt (bez @context), který pak obalíme
 * v komponentě, případně spojíme do @graph bloku.
 */

const SITE_URL = 'https://ropiky.cz';
const ORG_NAME = 'Ropiky.cz';
const ORG_LOGO = `${SITE_URL}/img/logo.svg`;

// ---------- Breadcrumb ----------
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbList(items: BreadcrumbItem[]) {
  return {
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((it, i) => ({
      '@type': 'ListItem',
      'position': i + 1,
      'name': it.name,
      'item': it.url.startsWith('http') ? it.url : `${SITE_URL}${it.url}`,
    })),
  };
}

// ---------- Organization + WebSite (pro homepage) ----------
export function organization() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    'name': ORG_NAME,
    'url': SITE_URL,
    'logo': ORG_LOGO,
    'description':
      'Referenční portál o československém opevnění z let 1935–1938. Typologie, katalog pevností, historie a mapy.',
    'sameAs': [
      // Sem přidat sociální sítě, pokud vzniknou
    ],
  };
}

export function webSite() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    'url': SITE_URL,
    'name': ORG_NAME,
    'description':
      'Encyklopedie československého opevnění 1935–1938 — typologie, katalog, mapy a tematické cesty.',
    'inLanguage': 'cs-CZ',
    'publisher': { '@id': `${SITE_URL}/#organization` },
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${SITE_URL}/katalog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// ---------- Pevnost — TouristAttraction + Museum/HistoricalBuilding ----------
export interface PevnostSchemaInput {
  slug: string;
  title: string;
  code: string;
  description: string;
  state: string;
  line: string;
  region: string;
  lat: number;
  lon: number;
  elevation?: number;
  address?: string;
  photoUrl?: string;
  photoAuthor?: string;
  photoLicense?: string;
  entryPriceCzk?: number;
  entryFree?: boolean;
  openingHours?: string;
  openingSeason?: string;
  telephone?: string;
  reservationUrl?: string;
  operatorName?: string;
  operatorWeb?: string;
  keywords?: string[];
  dateBuilt?: string;
}

export function pevnostSchema(p: PevnostSchemaInput) {
  const isMuseum = p.state === 'muzeum';
  const types = isMuseum
    ? ['TouristAttraction', 'Museum']
    : ['TouristAttraction', 'LandmarksOrHistoricalBuildings'];

  const obj: any = {
    '@type': types,
    '@id': `${SITE_URL}/katalog/${p.slug}#place`,
    'name': p.title,
    'alternateName': p.code,
    'description': p.description,
    'url': `${SITE_URL}/katalog/${p.slug}`,
    'mainEntityOfPage': `${SITE_URL}/katalog/${p.slug}`,
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': p.lat,
      'longitude': p.lon,
      ...(p.elevation ? { 'elevation': `${p.elevation} m` } : {}),
    },
  };

  if (p.photoUrl) {
    obj.image = p.photoUrl.startsWith('http')
      ? p.photoUrl
      : `${SITE_URL}${p.photoUrl}`;
  }

  if (p.address) {
    obj.address = {
      '@type': 'PostalAddress',
      'streetAddress': p.address,
      'addressCountry': 'CZ',
      'addressRegion': p.region,
    };
  }

  // Ceník (muzea)
  if (p.entryFree || typeof p.entryPriceCzk === 'number') {
    obj.offers = {
      '@type': 'Offer',
      'price': p.entryFree ? '0' : String(p.entryPriceCzk),
      'priceCurrency': 'CZK',
      'availability': 'https://schema.org/InStock',
    };
    obj.isAccessibleForFree = !!p.entryFree;
  }

  // Otevírací doba
  if (p.openingHours) {
    obj.openingHours = p.openingHours;
  }
  if (p.openingSeason) {
    obj.openingHoursSpecification = {
      '@type': 'OpeningHoursSpecification',
      'description': p.openingSeason,
    };
  }

  if (p.telephone) obj.telephone = p.telephone;
  if (p.reservationUrl) {
    obj.potentialAction = {
      '@type': 'ReserveAction',
      'target': p.reservationUrl,
    };
  }

  if (p.operatorName || p.operatorWeb) {
    obj.isBasedOn = {
      '@type': 'Organization',
      'name': p.operatorName,
      ...(p.operatorWeb ? { 'url': p.operatorWeb } : {}),
    };
  }

  if (p.keywords && p.keywords.length > 0) {
    obj.keywords = p.keywords.join(', ');
  }

  if (p.dateBuilt) obj.dateCreated = p.dateBuilt;

  return obj;
}

// ---------- Článek — Article ----------
export interface ArticleSchemaInput {
  slug: string;
  title: string;
  description: string;
  author?: string;
  pubDate?: Date;
  updated?: Date;
  cover?: string;
  tags?: string[];
}

export function articleSchema(a: ArticleSchemaInput) {
  const url = `${SITE_URL}/clanky/${a.slug}`;
  const obj: any = {
    '@type': 'Article',
    '@id': `${url}#article`,
    'headline': a.title,
    'description': a.description,
    'url': url,
    'mainEntityOfPage': url,
    'inLanguage': 'cs-CZ',
    'publisher': { '@id': `${SITE_URL}/#organization` },
  };

  if (a.author) {
    obj.author = { '@type': 'Person', 'name': a.author };
  }
  if (a.pubDate) obj.datePublished = a.pubDate.toISOString();
  if (a.updated) obj.dateModified = a.updated.toISOString();
  if (a.cover) {
    obj.image = a.cover.startsWith('http') ? a.cover : `${SITE_URL}${a.cover}`;
  }
  if (a.tags && a.tags.length > 0) obj.keywords = a.tags.join(', ');

  return obj;
}

// ---------- Cesta — TouristTrip ----------
export interface CestaSchemaInput {
  slug: string;
  title: string;
  description: string;
  region: string;
  delka_km?: number;
  delka_dni: number;
  cover?: string;
  startLat: number;
  startLon: number;
  startName: string;
  endLat?: number;
  endLon?: number;
  endName?: string;
  zastavky: Array<{
    nazev: string;
    slug?: string;
    poznamka?: string;
    doba_minut?: number;
  }>;
  updated?: Date;
  tags?: string[];
}

export function cestaSchema(c: CestaSchemaInput) {
  const url = `${SITE_URL}/cesty/${c.slug}`;

  const itinerary = c.zastavky.map((z, i) => {
    const item: any = {
      '@type': 'TouristAttraction',
      'name': z.nazev,
      'position': i + 1,
    };
    if (z.slug) {
      item['@id'] = `${SITE_URL}/katalog/${z.slug}#place`;
      item.url = `${SITE_URL}/katalog/${z.slug}`;
    }
    if (z.poznamka) item.description = z.poznamka;
    return item;
  });

  const obj: any = {
    '@type': 'TouristTrip',
    '@id': `${url}#trip`,
    'name': c.title,
    'description': c.description,
    'url': url,
    'mainEntityOfPage': url,
    'inLanguage': 'cs-CZ',
    'touristType': 'Fortifikace a vojenská historie',
    'itinerary': {
      '@type': 'ItemList',
      'itemListElement': itinerary.map((it, i) => ({
        '@type': 'ListItem',
        'position': i + 1,
        'item': it,
      })),
    },
    'partOfTrip': { '@id': `${SITE_URL}/cesty#trips` },
    'provider': { '@id': `${SITE_URL}/#organization` },
  };

  if (c.cover) {
    obj.image = c.cover.startsWith('http') ? c.cover : `${SITE_URL}${c.cover}`;
  }

  // Start / end jako Place
  obj.subjectOf = {
    '@type': 'Place',
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': c.startLat,
      'longitude': c.startLon,
    },
    'name': c.startName,
  };

  if (c.endLat && c.endLon && c.endName) {
    // Záměrně neuvádíme zvlášť pole pro end — reprezentuje to poslední zastávka v itinerary
  }

  if (c.tags && c.tags.length > 0) obj.keywords = c.tags.join(', ');

  // Doba trvání v ISO 8601 (P1D, P2D, …)
  if (c.delka_dni) obj.duration = `P${c.delka_dni}D`;

  if (c.updated) obj.dateModified = c.updated.toISOString();

  return obj;
}
