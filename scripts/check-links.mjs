#!/usr/bin/env node
/**
 * check-links.mjs — kontrola rozbitých obrázků a mrtvých domén v obsahu ropiky.cz
 *
 * Web hotlinkuje ~6 200 fotek z Wikimedia Commons. Když je někdo na Commons
 * přejmenuje nebo smaže, obrázek na ropiky.cz tiše zmizí a nikdo se to nedozví.
 * Tenhle skript to najde.
 *
 *   node scripts/check-links.mjs            # obrázky i domény
 *   node scripts/check-links.mjs --images   # jen obrázky
 *   node scripts/check-links.mjs --hosts    # jen DNS kontrola domén
 *   node scripts/check-links.mjs --json     # strojově čitelný výstup
 *
 * Pozn.: Wikimedia při rychlém dávkování vrací 429. Skript proto každou
 * nalezenou chybu ověřuje ještě jednou, pomalu — jako rozbité hlásí jen to,
 * co selže i napodruhé.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import dns from 'node:dns/promises';

const UA = 'ropiky.cz-linkcheck/1.0 (https://www.ropiky.cz; info@ropiky.cz)';
const SRC = 'src';
const PUBLIC = 'public';
const args = process.argv.slice(2);
const JSON_OUT = args.includes('--json');
const ONLY_IMAGES = args.includes('--images');
const ONLY_HOSTS = args.includes('--hosts');
const log = (...a) => { if (!JSON_OUT) console.log(...a); };

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (['.md', '.yaml', '.astro', '.ts', '.json'].includes(extname(p))) out.push(p);
  }
  return out;
}

const files = walk(SRC);
const imageRefs = new Map(); // url -> Set(file)
const hostRefs = new Map();  // host -> Set(file)

const add = (map, key, file) => {
  if (!map.has(key)) map.set(key, new Set());
  map.get(key).add(file);
};

for (const f of files) {
  const s = readFileSync(f, 'utf8');
  for (const m of s.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)) add(imageRefs, m[1], f);
  for (const m of s.matchAll(/<img[^>]+src="([^"]+)"/g)) add(imageRefs, m[1], f);
  for (const m of s.matchAll(/^\s*(?:url|cover|ogImage):\s*>?-?\s*["']?(\S+?)["']?\s*$/gm)) add(imageRefs, m[1], f);
  for (const m of s.matchAll(/url:\s*>-\s*\n\s+(\S+)/g)) add(imageRefs, m[1], f);
  for (const m of s.matchAll(/https?:\/\/([A-Za-z0-9._-]+)/g)) add(hostRefs, m[1].toLowerCase(), f);
}

const images = [...imageRefs.keys()].filter((u) => u.startsWith('/img') || u.startsWith('http'));
const result = { missingLocal: [], brokenRemote: [], deadHosts: [] };

// --- lokální soubory ---
if (!ONLY_HOSTS) {
  for (const u of images.filter((u) => u.startsWith('/img'))) {
    if (!existsSync(PUBLIC + u.split('?')[0])) {
      result.missingLocal.push({ url: u, files: [...imageRefs.get(u)] });
    }
  }
  log(`Lokální obrázky: ${images.filter((u) => u.startsWith('/img')).length}, chybí ${result.missingLocal.length}`);
}

// --- externí obrázky ---
async function head(url, timeoutMs = 20000) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  try {
    let r = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': UA }, redirect: 'follow', signal: ac.signal });
    if (r.status === 405 || r.status >= 400) {
      r = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow', signal: ac.signal });
    }
    return r.status;
  } catch (e) {
    return 'ERR:' + e.name;
  } finally {
    clearTimeout(t);
  }
}

async function pool(items, worker, concurrency) {
  const out = new Map();
  let i = 0;
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (i < items.length) {
        const idx = i++;
        out.set(items[idx], await worker(items[idx]));
        if (!JSON_OUT && idx % 500 === 0) process.stdout.write(`  ${idx}/${items.length}\r`);
      }
    })
  );
  return out;
}

if (!ONLY_HOSTS) {
  const remote = images.filter((u) => u.startsWith('http'));
  log(`Externí obrázky: ${remote.length} — kontroluji…`);
  const first = await pool(remote, head, 12);
  const suspects = [...first.entries()].filter(([, c]) => c !== 200).map(([u]) => u);
  log(`\n  podezřelých po 1. kole: ${suspects.length} (většinou 429 = rate limit) — ověřuji pomalu…`);
  for (const u of suspects) {
    let code;
    for (let a = 0; a < 3; a++) {
      code = await head(u);
      if (code === 200 || code === 404) break;
      await new Promise((r) => setTimeout(r, 2500));
    }
    if (code !== 200) result.brokenRemote.push({ url: u, status: code, files: [...imageRefs.get(u)] });
    await new Promise((r) => setTimeout(r, 500));
  }
  log(`  skutečně rozbitých: ${result.brokenRemote.length}`);
}

// --- DNS kontrola domén ---
if (!ONLY_IMAGES) {
  log(`\nHostnamů v obsahu: ${hostRefs.size} — DNS kontrola…`);
  for (const h of [...hostRefs.keys()].sort()) {
    try {
      await dns.lookup(h);
    } catch {
      result.deadHosts.push({ host: h, files: [...hostRefs.get(h)] });
    }
  }
  log(`  neexistujících domén: ${result.deadHosts.length}`);
}

if (JSON_OUT) {
  console.log(JSON.stringify(result, null, 2));
} else {
  const show = (title, rows, fmt) => {
    if (!rows.length) return;
    console.log(`\n=== ${title} (${rows.length}) ===`);
    for (const r of rows) {
      console.log(fmt(r));
      for (const f of r.files.slice(0, 5)) console.log('     ' + f);
      if (r.files.length > 5) console.log(`     … a ${r.files.length - 5} dalších`);
    }
  };
  show('CHYBĚJÍCÍ LOKÁLNÍ OBRÁZKY', result.missingLocal, (r) => '  ' + r.url);
  show('ROZBITÉ EXTERNÍ OBRÁZKY', result.brokenRemote, (r) => `  [${r.status}] ${r.url}`);
  show('NEEXISTUJÍCÍ DOMÉNY', result.deadHosts, (r) => '  ' + r.host);
  const total = result.missingLocal.length + result.brokenRemote.length + result.deadHosts.length;
  console.log(total === 0 ? '\n✓ Vše v pořádku.' : `\n✗ Celkem ${total} problémů.`);
}

process.exit(result.missingLocal.length + result.brokenRemote.length + result.deadHosts.length ? 1 : 0);
