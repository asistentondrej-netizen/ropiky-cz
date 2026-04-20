#!/usr/bin/env python3
"""
Wikimedia Commons photo fetcher pro ropiky.cz.

- Projde src/content/pevnosti/*.yaml
- Pro pevnosti bez `photos:` provede search na code + title
- Najde-li CC fotku, stáhne (throttle 3s) a přidá do YAML
- Compliant User-Agent, Image thumb (iiurlwidth=1600)

Použití:
    python3 scripts/fetch-photos.py --limit 25
    python3 scripts/fetch-photos.py --limit 10 --dry-run
"""
import argparse
import html
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
PEVNOSTI = ROOT / "src/content/pevnosti"
IMG_DIR = ROOT / "public/img/forts"
UA = "RopikyCzWebsite/1.0 (https://www.ropiky.cz; ondrej.ungr@gmail.com) Python/urllib"
API = "https://commons.wikimedia.org/w/api.php"
ACCEPT_LICENSES = {
    "CC BY-SA 4.0", "CC BY-SA 3.0", "CC BY-SA 2.5", "CC BY-SA 2.0", "CC BY-SA 1.0",
    "CC BY 4.0", "CC BY 3.0", "CC BY 2.5", "CC BY 2.0", "CC BY 1.0",
    "CC0", "Public domain", "PD",
}
THROTTLE_SEC = 3.0


def http_get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def api_call(params):
    qs = urllib.parse.urlencode(params)
    return json.loads(http_get(f"{API}?{qs}").decode("utf-8"))


def strip_html(s):
    return re.sub(r"<[^>]+>", "", s or "").strip()


def sanitize_filename(name):
    name = re.sub(r"\.jpe?g$", "", name, flags=re.I)
    name = re.sub(r"[^a-zA-Z0-9._-]", "-", name)
    name = re.sub(r"-+", "-", name).strip("-")
    return (name[:90] + ".jpg").lower()


def search_wikimedia(query, limit=10):
    try:
        data = api_call({
            "action": "query", "format": "json", "list": "search",
            "srsearch": query, "srnamespace": "6", "srlimit": str(limit),
        })
        return [r["title"] for r in data.get("query", {}).get("search", [])]
    except Exception as e:
        print(f"  search err: {e}", file=sys.stderr)
        return []


def get_image_info(titles):
    if not titles:
        return {}
    try:
        data = api_call({
            "action": "query", "format": "json",
            "titles": "|".join(titles[:10]),
            "prop": "imageinfo",
            "iiprop": "url|extmetadata|mime",
            "iiurlwidth": "1600",
        })
        out = {}
        for _, page in data.get("query", {}).get("pages", {}).items():
            if "imageinfo" not in page:
                continue
            ii = page["imageinfo"][0]
            lic = strip_html(ii.get("extmetadata", {}).get("LicenseShortName", {}).get("value", ""))
            artist = strip_html(ii.get("extmetadata", {}).get("Artist", {}).get("value", ""))
            out[page["title"]] = {
                "title": page["title"],
                "thumb_url": ii.get("thumburl") or ii.get("url"),
                "license": lic,
                "artist": html.unescape(artist) if artist else "",
                "mime": ii.get("mime", ""),
                "url": ii.get("url", ""),
            }
        return out
    except Exception as e:
        print(f"  imageinfo err: {e}", file=sys.stderr)
        return {}


def download_image(url, dest):
    data = http_get(url)
    dest.write_bytes(data)
    return len(data)


def code_normalize(s):
    """K-S 17 / K-S-17 / K_S_17 / KS17 → 'ks17' (jen alnum, lowercase)."""
    return re.sub(r"[^a-z0-9]", "", s.lower())


def title_contains_code(title, code):
    """Match na normalizovanou alfanumerickou reprezentaci — řeší varianty pomlček/mezer/podtržítek."""
    if not code:
        return False
    code_norm = code_normalize(code)
    if len(code_norm) < 3:
        return False  # moc krátké, false positives
    # Tokenizuj title: rozděl na ne-alfanumerických, normalizuj každý token, zkontroluj prefix/suffix match
    # Trik: vytvoříme "clean" reprezentaci title s mezerami jako separátory mezi alfanum. skupinami,
    # pak matchujeme code_norm jako samostatné slovo (prefix/suffix musí být hranice)
    t = title.lower()
    # Nahraď všechny ne-alfanumerické za mezeru, pak zkombinuj alfanum. skupiny do kompaktních "slov"
    t_clean = re.sub(r"[^a-z0-9]+", " ", t).strip()
    # Match: buď přesné slovo, nebo obsahuje prefix/suffix jasně oddělený číslicemi
    tokens = t_clean.split()
    # Poskládej po 1–3 tokenech a zkus match:
    n = len(tokens)
    for i in range(n):
        for j in range(i, min(i + 4, n)):
            joined = "".join(tokens[i:j+1])
            if joined == code_norm:
                return True
    return False


def best_candidate(infos, code=None):
    """Jen fotky s kódem v názvu, akceptovatelnou licencí a JPG/PNG/WebP formátem."""
    scored = []
    for info in infos.values():
        if info["mime"] not in ("image/jpeg", "image/png", "image/webp"):
            continue
        lic = info["license"]
        if not any(acc in lic for acc in ACCEPT_LICENSES):
            continue
        if code and not title_contains_code(info["title"], code):
            continue
        score = 0
        if "CC BY-SA" in lic or "CC0" in lic:
            score += 2
        elif "CC BY" in lic:
            score += 1
        scored.append((score, info))
    scored.sort(key=lambda x: -x[0])
    return scored[0][1] if scored else None


def build_queries(code, title, line):
    """
    Priorita dotazů — first-match:
    1. kód s kontextem („bunkr", „pevnost")
    2. kód s místní linií
    3. samotný kód v uvozovkách (insearch to neumí, ale zkusíme)
    4. title (název v uvozovkách)
    """
    qs = []
    if code:
        c = code.replace(" ", "-")
        qs.append(f"{c} bunkr")
        qs.append(f"{c} pevnost")
        qs.append(f"{c} opevnění")
        if line:
            qs.append(f"{c} {line}")
        qs.append(c)
    if title:
        qs.append(title.strip('"'))
    # deduplikace
    seen = set()
    out = []
    for q in qs:
        q = re.sub(r"\s+", " ", q).strip()
        if q and q not in seen:
            seen.add(q)
            out.append(q)
    return out


def process_fort(fpath, dry_run=False):
    raw = fpath.read_text(encoding="utf-8")
    data = yaml.safe_load(raw)
    if data.get("photos"):
        return "has_photos"

    code = (data.get("code") or "").strip()
    title = (data.get("title") or "").strip()
    line = (data.get("line") or "").strip()

    queries = build_queries(code, title, line)
    if not queries:
        return "no_query"

    print(f"[{fpath.stem}] code={code!r} title={title!r}")

    # Hledej postupně, dokud nemáme kandidáty
    found_titles = []
    for q in queries[:4]:
        print(f"  query: {q}")
        time.sleep(THROTTLE_SEC)
        titles = search_wikimedia(q, limit=6)
        if titles:
            found_titles = titles
            break

    if not found_titles:
        return "not_found"

    time.sleep(THROTTLE_SEC)
    infos = get_image_info(found_titles)
    if not infos:
        return "no_info"

    best = best_candidate(infos, code=code)
    if not best:
        return "no_compatible_license"

    thumb_url = best["thumb_url"]
    src_title = best["title"].replace("File:", "")
    fname = sanitize_filename(src_title)
    dest = IMG_DIR / fname

    if not dry_run and not dest.exists():
        time.sleep(THROTTLE_SEC)
        try:
            size = download_image(thumb_url, dest)
            print(f"  ✓ downloaded {fname} ({size // 1024} kB)")
        except Exception as e:
            print(f"  ✗ download fail: {e}", file=sys.stderr)
            return "download_fail"

    # Přidej photos sekci do YAML
    source_url = f"https://commons.wikimedia.org/wiki/{urllib.parse.quote(best['title'])}"
    photo_block = {
        "url": f"/img/forts/{fname}",
        "alt": f"{title} — {code}".strip(" —"),
        "author": best["artist"] or "Wikimedia Commons",
        "license": normalize_license(best["license"]),
        "source": source_url,
    }

    # Zapiš přes text append — udržíme YAML formátování existujícího souboru
    if not dry_run:
        new_block = yaml_append_photos(raw, photo_block)
        fpath.write_text(new_block, encoding="utf-8")

    print(f"  + photos: {photo_block['url']} ({photo_block['license']})")
    return "added"


def normalize_license(lic):
    lic = lic.strip()
    mapping = {
        "CC BY-SA 4.0": "CC BY-SA 4.0",
        "CC BY-SA 3.0": "CC BY-SA 3.0",
        "CC BY-SA 2.5": "CC BY-SA 2.5",
        "CC BY-SA 2.0": "CC BY-SA 2.0",
        "CC BY 4.0": "CC BY 4.0",
        "CC BY 3.0": "CC BY 3.0",
        "CC BY 2.5": "CC BY 2.5",
        "CC BY 2.0": "CC BY 2.0",
    }
    for k, v in mapping.items():
        if k in lic:
            return v
    if "CC0" in lic or "Public domain" in lic or "PD" in lic:
        return "CC0"
    return lic or "CC BY-SA"


def yaml_append_photos(raw, block):
    """Vloží `photos:` před `related:` nebo na konec souboru (před `# === X ===` sekci)."""
    section = (
        "\n# === MÉDIA ===\n"
        "photos:\n"
        f"  - url: {block['url']}\n"
        f"    alt: {block['alt']!r}\n".replace('"', "'")
        + f"    author: {json.dumps(block['author'], ensure_ascii=False)}\n"
        f"    license: {block['license']}\n"
        f"    source: {block['source']}\n"
    )

    # Pokus o vložení před "# === CROSS-LINKING" blok
    idx = raw.find("# === CROSS-LINKING")
    if idx != -1:
        return raw[:idx] + section + "\n" + raw[idx:]
    # Jinak před "related:"
    m = re.search(r"^related:\s*$", raw, flags=re.M)
    if m:
        return raw[:m.start()] + section + "\n" + raw[m.start():]
    # Jinak connect na konec
    return raw.rstrip() + "\n" + section + "\n"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=20, help="Max počet pevností ke zpracování")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--only", help="Zpracovat jen slug obsahující tento substring")
    args = ap.parse_args()

    IMG_DIR.mkdir(parents=True, exist_ok=True)

    all_yamls = sorted(PEVNOSTI.glob("*.yaml"))
    stats = {"has_photos": 0, "added": 0, "not_found": 0, "no_compatible_license": 0,
             "no_info": 0, "no_query": 0, "download_fail": 0, "skipped": 0}
    processed = 0
    for fpath in all_yamls:
        if args.only and args.only not in fpath.stem:
            continue
        if processed >= args.limit:
            stats["skipped"] += 1
            continue
        try:
            status = process_fort(fpath, dry_run=args.dry_run)
        except Exception as e:
            print(f"[{fpath.stem}] ERROR: {e}", file=sys.stderr)
            status = "error"
        stats[status] = stats.get(status, 0) + 1
        if status != "has_photos":
            processed += 1

    print("\n=== Výsledky ===")
    for k, v in stats.items():
        print(f"  {k:24s} {v}")


if __name__ == "__main__":
    main()
