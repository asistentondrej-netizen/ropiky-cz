#!/usr/bin/env node
// Orphan detector pro ropiky.cz
//
// Najde:
//   1. Nedokončené pevnosti (chybí description/history/photos)
//   2. Pevnosti bez cross-linku z jiné pevnosti
//   3. Pevnosti bez zmínky v žádném článku (pokud je `clanky` katalog)
//   4. Rozbité cross-linky v related.pevnosti (odkaz na neexistující slug)
//
// Výstup: JSON report + čitelný markdown na stdout
// Použití: node scripts/check-orphans.mjs [--json]

import { readdir, readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import yaml from 'js-yaml';

const ROOT = resolve(process.cwd());
const PEVNOSTI_DIR = resolve(ROOT, 'src/content/pevnosti');
const CLANKY_DIR = resolve(ROOT, 'src/content/clanky');
const TYPOLOGIE_DIR = resolve(ROOT, 'src/content/typologie');

const jsonOutput = process.argv.includes('--json');

function log(...args) {
  if (!jsonOutput) console.log(...args);
}

async function loadYamlDir(dir) {
  const out = new Map();
  let files = [];
  try {
    files = await readdir(dir);
  } catch (err) {
    console.error(`Nelze načíst ${dir}:`, err.message);
    return out;
  }
  for (const fname of files) {
    if (!fname.endsWith('.yaml') && !fname.endsWith('.yml')) continue;
    const slug = fname.replace(/\.ya?ml$/, '');
    const raw = await readFile(join(dir, fname), 'utf-8');
    try {
      out.set(slug, yaml.load(raw));
    } catch (err) {
      console.error(`YAML parse error ${fname}:`, err.message);
    }
  }
  return out;
}

async function loadMdDir(dir) {
  const out = new Map();
  let files = [];
  try {
    files = await readdir(dir);
  } catch (err) {
    return out;
  }
  for (const fname of files) {
    if (!fname.endsWith('.md') && !fname.endsWith('.mdx')) continue;
    const slug = fname.replace(/\.mdx?$/, '');
    const raw = await readFile(join(dir, fname), 'utf-8');
    out.set(slug, raw);
  }
  return out;
}

function checkCompleteness(slug, data) {
  const issues = [];
  if (!data.description || data.description.length < 50) {
    issues.push('description chybí nebo je kratší než 50 znaků');
  }
  if (!data.history || data.history.length < 80) {
    issues.push('history chybí nebo je kratší než 80 znaků');
  }
  if (!data.photos || data.photos.length === 0) {
    issues.push('žádné fotografie');
  }
  return issues;
}

async function main() {
  const pevnosti = await loadYamlDir(PEVNOSTI_DIR);
  const clanky = await loadMdDir(CLANKY_DIR);
  const typologie = await loadMdDir(TYPOLOGIE_DIR);

  log(`\n=== Orphan detector ===`);
  log(`Pevností: ${pevnosti.size}`);
  log(`Článků: ${clanky.size}`);
  log(`Typologií: ${typologie.size}`);

  const report = {
    timestamp: new Date().toISOString(),
    totals: { pevnosti: pevnosti.size, clanky: clanky.size, typologie: typologie.size },
    issues: {
      incomplete: [],
      noIncomingLinks: [],
      noArticleMentions: [],
      brokenRelatedLinks: [],
      brokenTypologieLinks: [],
    },
  };

  // 1. Nedokončené pevnosti
  for (const [slug, data] of pevnosti) {
    const issues = checkCompleteness(slug, data);
    if (issues.length > 0) {
      report.issues.incomplete.push({ slug, title: data.title, issues });
    }
  }

  // 2. Pevnosti bez incoming linků (nikdo je neoznačuje v related.pevnosti)
  const incomingLinks = new Map();
  for (const [slug, data] of pevnosti) {
    const related = data.related?.pevnosti ?? [];
    for (const target of related) {
      if (!incomingLinks.has(target)) incomingLinks.set(target, new Set());
      incomingLinks.get(target).add(slug);
    }
  }
  for (const [slug, data] of pevnosti) {
    const inc = incomingLinks.get(slug);
    if (!inc || inc.size === 0) {
      report.issues.noIncomingLinks.push({ slug, title: data.title });
    }
  }

  // 3. Rozbité cross-linky
  for (const [slug, data] of pevnosti) {
    const related = data.related?.pevnosti ?? [];
    for (const target of related) {
      if (!pevnosti.has(target)) {
        report.issues.brokenRelatedLinks.push({
          from: slug,
          fromTitle: data.title,
          brokenTarget: target,
        });
      }
    }
  }

  // 3b. Rozbité odkazy na typologii (tech.komponenty + related.typologie)
  for (const [slug, data] of pevnosti) {
    const allTypSlugs = [
      ...(data.tech?.komponenty ?? []),
      ...(data.related?.typologie ?? []),
    ];
    for (const target of allTypSlugs) {
      if (!typologie.has(target)) {
        report.issues.brokenTypologieLinks.push({
          from: slug,
          fromTitle: data.title,
          brokenTarget: target,
        });
      }
    }
  }

  // 4. Pevnosti bez zmínky v článku (kontrola heuristicky — kód pevnosti)
  if (clanky.size > 0) {
    const allArticleText = [...clanky.values()].join('\n').toLowerCase();
    for (const [slug, data] of pevnosti) {
      const code = (data.code ?? '').toLowerCase();
      const title = (data.title ?? '').toLowerCase();
      const mentioned = (code && allArticleText.includes(code)) ||
                        (title.length > 10 && allArticleText.includes(title));
      if (!mentioned) {
        report.issues.noArticleMentions.push({ slug, title: data.title, code: data.code });
      }
    }
  }

  // === VÝSTUP ===
  if (jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  const { incomplete, noIncomingLinks, noArticleMentions, brokenRelatedLinks, brokenTypologieLinks } = report.issues;

  log(`\n─── 1. Neúplné pevnosti (${incomplete.length}) ───`);
  incomplete.slice(0, 20).forEach((item) => {
    log(`  • ${item.slug} (${item.title})`);
    item.issues.forEach((i) => log(`      - ${i}`));
  });
  if (incomplete.length > 20) log(`  … a dalších ${incomplete.length - 20}`);

  log(`\n─── 2. Bez incoming linků (${noIncomingLinks.length}) ───`);
  noIncomingLinks.slice(0, 20).forEach((item) => {
    log(`  • ${item.slug} (${item.title})`);
  });
  if (noIncomingLinks.length > 20) log(`  … a dalších ${noIncomingLinks.length - 20}`);

  log(`\n─── 3. Rozbité cross-linky v related.pevnosti (${brokenRelatedLinks.length}) ───`);
  brokenRelatedLinks.forEach((item) => {
    log(`  • ${item.from} → ${item.brokenTarget} (neexistuje)`);
  });

  log(`\n─── 3b. Rozbité odkazy na typologii (${brokenTypologieLinks.length}) ───`);
  brokenTypologieLinks.forEach((item) => {
    log(`  • ${item.from} → /typologie/${item.brokenTarget} (neexistuje)`);
  });

  if (clanky.size > 0) {
    log(`\n─── 4. Bez zmínky v článku (${noArticleMentions.length} z ${pevnosti.size}) ───`);
    log(`  (kontrola zda je kód nebo název pevnosti zmíněn v nějakém článku)`);
    noArticleMentions.slice(0, 10).forEach((item) => {
      log(`  • ${item.slug} — ${item.code}`);
    });
    if (noArticleMentions.length > 10) log(`  … a dalších ${noArticleMentions.length - 10}`);
  }

  log(`\n=== Shrnutí ===`);
  log(`  Nekompletní:              ${incomplete.length} / ${pevnosti.size}`);
  log(`  Bez incoming linků:       ${noIncomingLinks.length} / ${pevnosti.size}`);
  log(`  Rozbité related odkazy:   ${brokenRelatedLinks.length}`);
  log(`  Rozbité typologie odkazy: ${brokenTypologieLinks.length}`);
  if (clanky.size > 0) {
    log(`  Bez zmínky v článku:      ${noArticleMentions.length} / ${pevnosti.size}`);
  }

  // Exit code: pokud jsou rozbité linky → fail (CI-friendly)
  const totalBroken = brokenRelatedLinks.length + brokenTypologieLinks.length;
  if (totalBroken > 0) {
    console.error(`\n✘ FAIL: ${totalBroken} rozbitých cross-linků.`);
    process.exit(1);
  }
  log(`\n✓ OK: žádné rozbité cross-linky.`);
}

main().catch((err) => {
  console.error('Chyba:', err);
  process.exit(2);
});
