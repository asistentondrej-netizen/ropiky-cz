#!/usr/bin/env python3
"""
Match ropiky.cz pevností proti offline seznamu Commons fotek.

Použití:
    python3 scripts/match-commons.py --limit 40
    python3 scripts/match-commons.py --refresh-index   # znovu stáhne seznam
"""
import argparse
import html
import json
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
INDEX_FILE = ROOT / "scripts/.commons-index.txt"
UA = "RopikyCzWebsite/1.0 (https://www.ropiky.cz; ondrej.ungr@gmail.com) Python/urllib"
API = "https://commons.wikimedia.org/w/api.php"
ACCEPT_LICENSES = [
    "CC BY-SA 4.0", "CC BY-SA 3.0", "CC BY-SA 2.5", "CC BY-SA 2.0",
    "CC BY 4.0", "CC BY 3.0", "CC BY 2.5",
    "CC0", "Public domain", "PD",
]
THROTTLE_SEC = 1.5


def http_get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def api_call(params):
    qs = urllib.parse.urlencode(params)
    return json.loads(http_get(f"{API}?{qs}").decode("utf-8"))


def strip_html(s):
    return re.sub(r"<[^>]+>", "", s or "").strip()


def refresh_index():
    seen = set()

    def traverse(cat, depth=0, max_depth=6):
        files = []
        if cat in seen or depth > max_depth:
            return files
        seen.add(cat)
        try:
            r = api_call({
                "action": "query", "format": "json",
                "list": "categorymembers", "cmtitle": f"Category:{cat}",
                "cmtype": "file|subcat", "cmlimit": "500",
            })
        except Exception as e:
            print(f"  err {cat}: {e}", file=sys.stderr)
            return files
        time.sleep(0.2)
        for m in r.get("query", {}).get("categorymembers", []):
            if m["title"].startswith("Category:"):
                sub = m["title"].replace("Category:", "")
                files.extend(traverse(sub, depth + 1, max_depth))
            elif m["title"].startswith("File:"):
                files.append(m["title"])
        return files

    print("Stahuji index (max_depth=6)...")
    all_files = []
    for root in [
        "Bunkers in the Czech Republic",
        "Bunkers in Slovakia",
        "Fortifications of World War II in Czechoslovakia",
        "Czechoslovak light pillboxes Model 36 of ZVV Brno",
        "Czechoslovak light pillboxes Model 36 of ZVV Praha",
        "Czechoslovak light pillboxes Model 37 of I. army corps",
        "Czechoslovak light pillboxes Model 37 of II. army corps",
        "Czechoslovak light pillboxes Model 37 of III. army corps",
        "Czechoslovak light pillboxes Model 37 of IV. army corps",
    ]:
        before = len(all_files)
        all_files.extend(traverse(root))
        print(f"  + {root}: +{len(all_files) - before}")
    all_files = sorted(set(all_files))
    INDEX_FILE.write_text("\n".join(all_files), encoding="utf-8")
    print(f"Uloženo {len(all_files)} File: titles → {INDEX_FILE}")
    return all_files


def load_index():
    if not INDEX_FILE.exists():
        return refresh_index()
    return INDEX_FILE.read_text(encoding="utf-8").splitlines()


def code_normalize(s):
    return re.sub(r"[^a-z0-9]", "", s.lower())


def title_contains_code(title, code):
    if not code:
        return False
    code_norm = code_normalize(code)
    if len(code_norm) < 3:
        return False
    t = title.lower()
    t_clean = re.sub(r"[^a-z0-9]+", " ", t).strip()
    tokens = t_clean.split()
    n = len(tokens)
    for i in range(n):
        for j in range(i, min(i + 4, n)):
            joined = "".join(tokens[i:j + 1])
            if joined == code_norm:
                return True
    return False


def sanitize_filename(name):
    name = re.sub(r"\.jpe?g$", "", name, flags=re.I)
    name = re.sub(r"[^a-zA-Z0-9._-]", "-", name)
    name = re.sub(r"-+", "-", name).strip("-")
    return (name[:90] + ".jpg").lower()


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
            }
        return out
    except Exception as e:
        print(f"  imageinfo err: {e}", file=sys.stderr)
        return {}


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
    }
    for k, v in mapping.items():
        if k in lic:
            return v
    if "CC0" in lic or "Public domain" in lic or "PD" in lic:
        return "CC0"
    return lic or "CC BY-SA"


def is_compatible_license(lic):
    return any(acc in lic for acc in ACCEPT_LICENSES)


def yaml_append_photos(raw, block):
    # Pro alt/author použij JSON (double-quote s escape) — validní YAML
    alt_yaml = json.dumps(block["alt"], ensure_ascii=False)
    author_yaml = json.dumps(block["author"], ensure_ascii=False)
    section = (
        "\n# === MÉDIA ===\n"
        "photos:\n"
        f"  - url: {block['url']}\n"
        f"    alt: {alt_yaml}\n"
        f"    author: {author_yaml}\n"
        f"    license: {block['license']}\n"
        f"    source: {block['source']}\n"
    )
    idx = raw.find("# === CROSS-LINKING")
    if idx != -1:
        return raw[:idx] + section + "\n" + raw[idx:]
    m = re.search(r"^related:\s*$", raw, flags=re.M)
    if m:
        return raw[:m.start()] + section + "\n" + raw[m.start():]
    return raw.rstrip() + "\n" + section + "\n"


def download_image(url, dest):
    data = http_get(url)
    dest.write_bytes(data)
    return len(data)


def process_fort(fpath, index, dry_run=False):
    raw = fpath.read_text(encoding="utf-8")
    data = yaml.safe_load(raw)
    if data.get("photos"):
        return "has_photos", None
    # Pokud existuje prázdný photos: [] / null, odstraníme ho před appendem
    has_empty_photos = re.search(r"^photos:\s*(\[\]|null)?\s*$", raw, flags=re.M)

    code = (data.get("code") or "").strip()
    title = (data.get("title") or "").strip()

    if not code:
        return "no_code", None

    candidates = [t for t in index if title_contains_code(t, code)]
    if not candidates:
        return "no_match", None

    # Omez na max 5 kandidátů, vem jejich info
    time.sleep(THROTTLE_SEC)
    infos = get_image_info(candidates[:5])
    if not infos:
        return "no_info", None

    best = None
    for info in infos.values():
        if info["mime"] not in ("image/jpeg", "image/png", "image/webp"):
            continue
        if not is_compatible_license(info["license"]):
            continue
        best = info
        break

    if not best:
        return "no_compatible_license", None

    thumb_url = best["thumb_url"]
    src_title = best["title"].replace("File:", "")
    fname = sanitize_filename(src_title)
    dest = IMG_DIR / fname

    if not dry_run and not dest.exists():
        time.sleep(THROTTLE_SEC)
        try:
            size = download_image(thumb_url, dest)
            print(f"  ✓ {fname} ({size // 1024} kB)")
        except Exception as e:
            print(f"  ✗ download fail: {e}", file=sys.stderr)
            return "download_fail", None

    source_url = f"https://commons.wikimedia.org/wiki/{urllib.parse.quote(best['title'])}"
    photo_block = {
        "url": f"/img/forts/{fname}",
        "alt": f"{title} — {code}".strip(" —"),
        "author": best["artist"] or "Wikimedia Commons",
        "license": normalize_license(best["license"]),
        "source": source_url,
    }

    if not dry_run:
        # Nejprve odstraň prázdný photos: [] / null pokud existuje
        clean_raw = re.sub(r"^photos:\s*(\[\]|null)?\s*\n", "", raw, flags=re.M)
        new_raw = yaml_append_photos(clean_raw, photo_block)
        fpath.write_text(new_raw, encoding="utf-8")

    return "added", best["title"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=30)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--refresh-index", action="store_true")
    ap.add_argument("--only", help="Slug substring filter")
    args = ap.parse_args()

    IMG_DIR.mkdir(parents=True, exist_ok=True)

    if args.refresh_index:
        refresh_index()

    index = load_index()
    print(f"Commons index: {len(index)} souborů")

    all_yamls = sorted(PEVNOSTI.glob("*.yaml"))
    stats = {"has_photos": 0, "added": 0, "no_match": 0, "no_compatible_license": 0,
             "no_info": 0, "no_code": 0, "download_fail": 0, "skipped": 0}
    processed_new = 0
    added_list = []

    for fpath in all_yamls:
        if args.only and args.only not in fpath.stem:
            continue
        if processed_new >= args.limit:
            stats["skipped"] += 1
            continue
        try:
            status, matched = process_fort(fpath, index, dry_run=args.dry_run)
        except Exception as e:
            print(f"[{fpath.stem}] ERROR: {e}", file=sys.stderr)
            status, matched = "error", None
        stats[status] = stats.get(status, 0) + 1
        if status == "added":
            added_list.append((fpath.stem, matched))
            print(f"[{fpath.stem}] ← {matched}")
            processed_new += 1
        # limit je počet ÚSPĚŠNĚ přidaných fotek; no_match/no_compatible atd. nespotřebovávají slot

    print("\n=== Výsledky ===")
    for k, v in stats.items():
        print(f"  {k:24s} {v}")
    print(f"\nPřidáno {len(added_list)} fotek.")


if __name__ == "__main__":
    main()
