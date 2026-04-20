/**
 * Wikimedia Commons srcset helper.
 *
 * Wikimedia thumb URLs mají pattern:
 *   https://upload.wikimedia.org/wikipedia/commons/thumb/X/XX/FILENAME/WIDTHpx-FILENAME
 *
 * Změnou WIDTHpx se vygeneruje jiná velikost náhledu.
 */

const WIKIMEDIA_THUMB_REGEX = /^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/thumb\/[^/]+\/[^/]+\/[^/]+\/)(\d+)px-(.+)$/;

const DEFAULT_WIDTHS = [480, 768, 1024, 1280, 1600];

export function isWikimediaThumb(url: string | undefined | null): boolean {
  if (!url) return false;
  return WIKIMEDIA_THUMB_REGEX.test(url);
}

/**
 * Vrátí srcset string pro Wikimedia thumb URL.
 * Pokud URL není Wikimedia thumb, vrátí null.
 */
export function wikimediaSrcset(
  url: string | undefined | null,
  widths: number[] = DEFAULT_WIDTHS
): string | null {
  if (!url) return null;
  const match = url.match(WIKIMEDIA_THUMB_REGEX);
  if (!match) return null;
  const [, prefix, , filename] = match;
  return widths
    .map((w) => `${prefix}${w}px-${filename} ${w}w`)
    .join(', ');
}

/**
 * Vrátí optimální src URL v dané šířce, zachová fallback na originál.
 */
export function wikimediaAtWidth(
  url: string | undefined | null,
  width: number
): string | null {
  if (!url) return null;
  const match = url.match(WIKIMEDIA_THUMB_REGEX);
  if (!match) return null;
  const [, prefix, , filename] = match;
  return `${prefix}${width}px-${filename}`;
}

/**
 * Default sizes atribut pro karty 16:10 v grid layoutu.
 */
export const CARD_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
export const HERO_SIZES = '(max-width: 768px) 100vw, 960px';
export const RELATED_SIZES = '(max-width: 640px) 100vw, 33vw';
