// Remark plugin: auto-linking kódů pevností v markdown článcích
//
// V článku zmíněný kód typu "MO-S 5", "K-S 22a", nebo název "Tvrz Bouda"
// se při buildu promění v <a href="/katalog/{slug}">MO-S 5</a> —
// pouze při PRVNÍM výskytu v článku (readability) a jen pokud je text
// mimo kódový blok, odkaz a inline code.
//
// Konfigurace:
//   remarkPlugins: [[fortLinker, { catalog: './src/content/pevnosti' }]]

import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import yaml from 'js-yaml';
import { visit } from 'unist-util-visit';

// Regex pro kódy objektů (K-S 22a, MO-S 5, N-S 82, …)
const CODE_PATTERN = /\b((?:K|N|R|T|MO|OP|MJ|B|HE|J|KRK|LI|AP|CE)-[Ss]\s?\d+[a-z]?)\b/g;

// Regex pro názvy tvrzí (Tvrz Bouda, Tvrz Hanička, …)
const TVRZ_PATTERN = /\b(Tvrz\s+[A-ZĎŘŠČŽÁÉÍÓÚŮÝ][a-zďřščžáéíóúůýě]+)\b/g;

function normalizeCode(code) {
  return String(code).toLowerCase().replace(/\s+/g, '').replace(/„|"/g, '');
}

async function loadCatalog(catalogDir) {
  const codeToSlug = new Map();
  const titleToSlug = new Map();
  let files;
  try {
    files = await readdir(catalogDir);
  } catch (err) {
    console.warn(`[fort-linker] Nelze načíst katalog: ${catalogDir}`, err.message);
    return { codeToSlug, titleToSlug };
  }
  for (const fname of files) {
    if (!fname.endsWith('.yaml') && !fname.endsWith('.yml')) continue;
    const slug = fname.replace(/\.ya?ml$/, '');
    try {
      const raw = await readFile(resolve(catalogDir, fname), 'utf-8');
      const data = yaml.load(raw);
      if (data?.code) {
        codeToSlug.set(normalizeCode(data.code), slug);
      }
      if (data?.title && data.title.startsWith('Tvrz ')) {
        titleToSlug.set(data.title.trim().toLowerCase(), slug);
      }
    } catch (err) {
      console.warn(`[fort-linker] Chyba při parsování ${fname}:`, err.message);
    }
  }
  return { codeToSlug, titleToSlug };
}

// Cache přes celý build (plugin je volán pro každý markdown soubor)
let catalogPromise = null;

export default function fortLinker(options = {}) {
  const catalog = options.catalog || './src/content/pevnosti';
  const maxLinksPerParagraph = options.maxLinksPerParagraph || 3;

  return async function transformer(tree, file) {
    if (!catalogPromise) {
      catalogPromise = loadCatalog(catalog);
    }
    const { codeToSlug, titleToSlug } = await catalogPromise;
    if (codeToSlug.size === 0 && titleToSlug.size === 0) return;

    // Každý markdown soubor má vlastní set linkovaných věcí (first-occurrence-only)
    const linkedInDoc = new Set();

    // Skip podstromy uvnitř linků a code bloků
    visit(tree, (node, index, parent) => {
      if (!parent || typeof index !== 'number') return;
      if (node.type !== 'text') return;
      if (parent.type === 'link') return;
      if (parent.type === 'code' || parent.type === 'inlineCode') return;

      const value = node.value;
      if (!value || value.length < 3) return;

      // Najdi všechny kandidáty (kódy + tvrze)
      const candidates = [];
      for (const m of value.matchAll(CODE_PATTERN)) {
        const code = m[1];
        const key = normalizeCode(code);
        if (!codeToSlug.has(key)) continue;
        if (linkedInDoc.has(key)) continue;
        candidates.push({ index: m.index, text: code, slug: codeToSlug.get(key), key });
      }
      for (const m of value.matchAll(TVRZ_PATTERN)) {
        const title = m[1];
        const key = 't:' + title.trim().toLowerCase();
        if (!titleToSlug.has(title.trim().toLowerCase())) continue;
        if (linkedInDoc.has(key)) continue;
        candidates.push({ index: m.index, text: title, slug: titleToSlug.get(title.trim().toLowerCase()), key });
      }

      if (!candidates.length) return;

      // Seřaď podle pozice, vezmi prvních N (readability guard)
      candidates.sort((a, b) => a.index - b.index);
      const picks = candidates.slice(0, maxLinksPerParagraph);

      // Rozšíří text node na sekvenci text/link uzlů
      const newNodes = [];
      let cursor = 0;
      for (const c of picks) {
        if (c.index > cursor) {
          newNodes.push({ type: 'text', value: value.slice(cursor, c.index) });
        }
        newNodes.push({
          type: 'link',
          url: `/katalog/${c.slug}`,
          title: null,
          children: [{ type: 'text', value: c.text }],
          data: {
            hProperties: { class: 'auto-link', 'data-auto-link': 'true' }
          }
        });
        cursor = c.index + c.text.length;
        linkedInDoc.add(c.key);
      }
      if (cursor < value.length) {
        newNodes.push({ type: 'text', value: value.slice(cursor) });
      }

      parent.children.splice(index, 1, ...newNodes);
      return [visit.SKIP, index + newNodes.length];
    });
  };
}
