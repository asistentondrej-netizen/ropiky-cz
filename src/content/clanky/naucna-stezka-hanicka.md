---
title: "Naučná stezka Hanička — kolem tvrze dvou epoch"
pubDate: 2026-04-18
author: "redakce ropiky.cz"
description: "Kompaktní naučná stezka kolem tvrze Hanička v Orlických horách — 5 km, 8 zastavení. Unikátní téma: souběžná historie čs. opevnění a sovětské přestavby na jaderný kryt."
tags: ["výlety", "turistika", "hanička", "orlické hory", "stezky"]
cover: "/img/clanky/hanicka-hero.jpg"
---

**Naučná stezka Hanička** je **nejkratší z velkých fortifikačních stezek v ČR** — ale v obsahu unikátní. Stezka kroutí okolo **tvrze Hanička**, jedné z pěti čs. dělostřeleckých tvrzí, která prošla **dvojí přestavbou**: nejprve jako čs. opevnění 1937–1938, pak v 70. a 80. letech jako **rezervní stanoviště ÚV KSČ** pro případ jaderné války. Tato **dvoubarevná historie** — fortifikační a studenoválečná — dělá ze stezky jedinečný zážitek.

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

<div id="hanicka-map" style="height: 460px; border: 1px solid #C9BFA8; background: #F5F1E8; margin: 24px 0;"></div>

<script>
(function(){
  function init(){
    if (typeof L === 'undefined') { setTimeout(init, 100); return; }
    var el = document.getElementById('hanicka-map');
    if (!el || el._inited) return; el._inited = true;
    var map = L.map('hanicka-map', { scrollWheelZoom:false }).setView([50.1967, 16.4925], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:18, attribution:'© OpenStreetMap' }).addTo(map);
    map.on('click', function(){ map.scrollWheelZoom.enable(); });
    var body = [
      {n:'◆', title:'Návštěvnické centrum Hanička', lat:50.1967, lon:16.4925, href:null, note:'Výchozí bod, parkování, úvodní expozice', color:'#7A3B2E'},
      {n:1, title:'Tvrz Hanička — vchodový srub', lat:50.1940, lon:16.4920, href:'/katalog/tvrz-hanicka', note:'Hlavní vstup do muzea — čs. tvrz + sovětský kryt', color:'#2D5F3F'},
      {n:2, title:'H-S 5 „Aurora"', lat:50.1982, lon:16.4970, href:null, note:'Pěchotní srub tvrze s originálními pancéřovými zvony', color:'#5A6B4F'},
      {n:3, title:'H-S 6 „Boda"', lat:50.2005, lon:16.4995, href:null, note:'Srub přestavěný v 70. letech na ventilační věž', color:'#5A6B4F'},
      {n:4, title:'Pozorovatelna Orlík', lat:50.2040, lon:16.5030, href:null, note:'Vyhlídka 400 m. n. m. — Orlické hory, Polsko', color:'#7A3B2E'},
      {n:5, title:'Sovětská ventilační věž', lat:50.1955, lon:16.4950, href:null, note:'Betonová věž z roku 1978 — sovětský komplex', color:'#5A4A33'}
    ];
    body.forEach(function(p){
      var icon = L.divIcon({ className:'', html:'<div style="width:30px;height:30px;border-radius:50%;background:'+p.color+';color:white;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:14px;border:2px solid white;box-shadow:0 1px 5px rgba(0,0,0,0.4);">'+p.n+'</div>', iconSize:[34,34], iconAnchor:[17,17] });
      var html = '<div style="font-family:inherit;min-width:220px;"><strong style="font-size:0.95rem;color:#3A2F20;">'+p.title+'</strong><br/><span style="font-size:0.8rem;color:#5A4A33;">'+p.note+'</span>'+(p.href?'<br/><a href="'+p.href+'" style="color:#7A3B2E;font-size:0.85rem;font-weight:600;margin-top:6px;display:inline-block;">Detail →</a>':'')+'</div>';
      L.marker([p.lat, p.lon], {icon:icon}).addTo(map).bindPopup(html);
    });
    var bounds = L.latLngBounds(body.map(function(p){return [p.lat, p.lon];}));
    map.fitBounds(bounds, {padding:[40,40]});
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
</script>

> **Okruh 5 km, 8 zastavení** — výchozí bod návštěvnické centrum Hanička → vchodový srub muzea → H-S 5 „Aurora" → H-S 6 „Boda" → vyhlídka Orlík → sovětská ventilační věž → návrat. Modrá turistická značka.

<figure>
  <img src="/img/forts/orlicke-zahori--cerna-voda-u-orlickeho-zahori--r-s.jpg" alt="Pěchotní srub R-S v Orlickém Záhoří — typický objekt linie u Haničky" />
  <figcaption>Lehké opevnění v Orlických horách u Haničky — typický objekt linie. Foto: Wikimedia Commons</figcaption>
</figure>

## Základní údaje

| Parametr | Hodnota |
|---|---|
| Délka | 5 km |
| Časová náročnost | 3–4 hodiny |
| Převýšení | 150 m |
| Zastavení | 8 panelů |
| Značení | modré turistické |
| Provozovatel | Muzeum tvrze Hanička |
| Vstupné | zdarma (muzeum samostatně 180 Kč) |

## Unikátnost stezky: dvě historie

Zatímco většina fortifikačních naučných stezek pracuje s jedním tématem (čs. opevnění 1935–1938), **Hanička nese dvě vrstvy**:

**Vrstva 1 — 1937–1938:** dělostřelecká tvrz ČSR, čtyři sruby propojené podzemím, nedokončená.

**Vrstva 2 — 1974–1989:** přestavba na **rezervní stanoviště ÚV KSČ** — původní objekt vybetonovaný, rozšířený o nové podzemní komplexy, vybavený jaderně-odolnými dveřmi, filtroventilací a ubytovnou pro 250 osob.

Stezka vysvětluje, jak **naprosto rozdílné účely** byly sloučeny v jednom objektu a jak tyto dvě historické vrstvy dnes koexistují.

## Trasa zastavení

### Zastavení 1: Návštěvnické centrum (výchozí bod)

Moderní budova z roku 2012, stojí u vstupu do muzea Hanička. Zde zakupujete vstupenky, získáte mapu stezky a můžete si prohlédnout **úvodní expozici** — modely tvrze ve dvou obdobích, fotogalerii stavby 1937 a přestavby 1974.

### Zastavení 2: Pěchotní srub H-S 5 „Aurora"

První bunkrový objekt nad tvrzí. Externě přístupný, pancéřové zvony **originál dochovaný z roku 1938**. Tabule vysvětluje, proč je Hanička zvláštní — byla postavena s **menším počtem srubů** než Bouda (jen 4 místo 5), kompenzováno **větší hloubkou podzemí**.

### Zastavení 3: Pěchotní srub H-S 6 „Boda"

Druhý objekt v linii. **Speciální zajímavost:** tento srub byl v období 1974–1982 **přestavěn na ventilační věž** pro sovětský kryt — jeho vnitřek byl kompletně odstraněn, objekt dostal novou funkci.

### Zastavení 4: Pamětní místo obětí září 1938

Kámen připomínající oběti bojů při mobilizaci. U Haničky došlo v září 1938 k několika **regulačním konfliktům** s Freikorpsem (sudetoněmecká dobrovolnická ozbrojená složka), pět čs. vojáků bylo zraněno.

### Zastavení 5: Vchodový srub a hlavní vstup

**Klíčové místo stezky.** Zde se rozděluje cesta na **muzejní prohlídku** (90 minut, s průvodcem) a externí pokračování stezky. Vchodový srub byl v 70. letech rozšířen o **jaderně-odolná ocelová vrata**, která jsou dnes na místě — velkolepá ukázka sovětské konstrukce.

→ Detail: [Tvrz Hanička](/katalog/tvrz-hanicka)

### Zastavení 6: Sovětská ventilační věž

Poměrně nečekané zastavení — **betonová věž z roku 1978**, která slouží jako ventilační otvor sovětského komplexu. Tabule srovnává tuto konstrukci s původními čs. pancéřovými zvony a ukazuje rozdílnou estetiku obou epoch.

### Zastavení 7: Pozorovatelna „Orlík"

Přírodní vyhlídka cca 400 m. n. m. s pohledem na Orlické hory a do Polska. Tabule popisuje **strategický význam Haničky** — střežila přístup z Kladské kotliny, tak jako Dobrošov na severu.

### Zastavení 8: Návrat do návštěvnického centra

Závěrečná tabule shrnuje **poučení ze dvou historií** — jak jedna stavba může sloužit diametrálně odlišným účelům. Uzavírá výlet **výzvou k reflexi** o významu opevnění v 20. století.

## Muzejní prohlídka tvrze

**Bezpodmínečně doporučujeme** zakombinovat stezku s prohlídkou tvrze:

| Parametr | Hodnota |
|---|---|
| Délka prohlídky | 90 minut |
| Trasa | původní čs. objekt + sovětský kryt |
| Průvodce | povinný (výklad ve skupině 15 osob) |
| Vstupné | 180 Kč dospělí / 120 Kč studenti |
| Rezervace | doporučená přes [haničkapark.cz](https://hanickapark.cz) |

Prohlídka začíná v původním čs. vstupním srubu, pokračuje do hloubkového komplexu z 80. let (ubikace, velín, elektrocentrála) a končí u ventilační šachty. Výklad kombinuje **fortifikační a politologické** perspektivy.

## Harmonogram výletu

**Ideální jednodenní plán:**

- 9:30 — Příjezd a parkování
- 9:45–10:00 — Návštěvnické centrum (zastavení 1)
- 10:00–11:00 — Stezka zastavení 2–5
- 11:00–12:30 — **Prohlídka tvrze s průvodcem** (rezervujte!)
- 12:30–13:30 — Oběd (restaurace Hanička)
- 13:30–15:30 — Pokračování stezky (zastavení 6–8)
- 15:30–16:00 — Souvenýry v návštěvnickém centru
- 16:00 — Odjezd

## Kam dál

Hanička je **centrálně položená** v Orlických horách, takže se dobře kombinuje s:

- **Tvrz Bouda** (25 km jižně) — hlavní cíl Betonové hranice
- **Dělostřelecká tvrz Dobrošov** (40 km severně) — nedokončená tvrz u Náchoda
- **Ski areál Deštné** (10 km) — v zimě pro aktivní zastávku

## Doprava

- **Auto:** silnice 14 → Rokytnice v Orl. h. → Orlické Záhoří (2 h z Prahy)
- **Vlak:** Praha → Hradec Králové → Týniště nad Orlicí → bus (3 h)
- **Parkování:** u návštěvnického centra, zdarma

## Pro koho

**Vhodné:**
- rodiny s dětmi od 10 let (obě historie jsou pro ně uchopitelné)
- zájemce o historii studené války (unikátní téma v ČR)
- fotografy (kontrast mezi moderní betonovou věží a krajinou)

**Méně vhodné:**
- cyklisty (terén je pěší, bez sjízdných tras)
- návštěvníky s klaustrofobií (v tvrzi jsou úzké chodby z 80. let)

## Odkazy

- [Tvrz Hanička](/katalog/tvrz-hanicka) — podrobné informace o objektu
- [Naučná stezka Dobrošov](/clanky/naucna-stezka-dobrosov) — sousední stezka
- [Top 10 fortifikačních výletů](/clanky/top-10-fortifikacnich-vyletu)

**Důležitá poznámka:** Muzeum tvrze Hanička je jediné fortifikační muzeum v ČR, které **systematicky dokumentuje éru 1974–1989**. Pokud vás zajímá studená válka, je to **povinná zastávka**.
