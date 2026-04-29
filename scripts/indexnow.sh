#!/bin/bash
# IndexNow ping — pošle všechny URL ze sitemap-0.xml na IndexNow API.
# Tím se zrychlí indexace v Bing + Yandex + Seznam (Bing index).
#
# Použití:
#   ./scripts/indexnow.sh
#
# Doporučení: spustit po každém větším pushi obsahu, kdy chceš urychlit indexaci.
# Pokud chceš auto-spuštění při každém pushi, zkopíruj 09_seo/patches/indexnow_workflow.yml
# do .github/workflows/ (vyžaduje PAT s `workflow` scope).

set -euo pipefail

TOKEN="01d0a009744341fbb1b3bf1f64ca6440"
HOST="www.ropiky.cz"

echo "→ Stahuji sitemap z https://${HOST}/sitemap-0.xml..."
curl -fsSL "https://${HOST}/sitemap-0.xml" -o /tmp/ropiky-sitemap.xml

echo "→ Extrahuji URL..."
grep -oE '<loc>[^<]+</loc>' /tmp/ropiky-sitemap.xml \
  | sed -E 's|<loc>(.*)</loc>|\1|' \
  | head -10000 > /tmp/ropiky-urls.txt

URL_COUNT=$(wc -l < /tmp/ropiky-urls.txt | tr -d ' ')
echo "  Nalezeno ${URL_COUNT} URL."

echo "→ Sestavuji IndexNow payload..."
{
  echo '{'
  echo "  \"host\": \"${HOST}\","
  echo "  \"key\": \"${TOKEN}\","
  echo "  \"keyLocation\": \"https://${HOST}/${TOKEN}.txt\","
  echo '  "urlList": ['
  sed -E 's|.*|"&"|' /tmp/ropiky-urls.txt | paste -sd ',' -
  echo '  ]'
  echo '}'
} > /tmp/ropiky-indexnow.json

echo "→ Posílám POST na https://api.indexnow.org/IndexNow..."
HTTP_CODE=$(curl -s -o /tmp/ropiky-response.txt -w "%{http_code}" \
  -X POST "https://api.indexnow.org/IndexNow" \
  -H "Content-Type: application/json; charset=utf-8" \
  --data-binary @/tmp/ropiky-indexnow.json)

echo ""
echo "  HTTP ${HTTP_CODE}"
[ -s /tmp/ropiky-response.txt ] && cat /tmp/ropiky-response.txt && echo ""

if [[ "${HTTP_CODE}" == "200" || "${HTTP_CODE}" == "202" ]]; then
  echo "✓ IndexNow ping úspěšný — submitnuto ${URL_COUNT} URL."
  echo "  Indexace v Bing/Seznam se zrychlí z týdnů na hodiny."
else
  echo "⚠ IndexNow vrátil HTTP ${HTTP_CODE} (běžné: 200 = OK, 202 = accepted, 422 = některé URL neakceptované — non-fatal)"
fi
