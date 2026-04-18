---
title: "Naučná stezka Betonová hranice — Králíky a Kladský průsmyk"
pubDate: 2026-04-18
author: "redakce ropiky.cz"
description: "Nejrozsáhlejší fortifikační naučná stezka v ČR — 40 km linie opevnění mezi Červenou Vodou, Králíkami a Mladkovem. Průvodce zastaveními, doporučené trasy, praktické informace."
tags: ["výlety", "turistika", "králíky", "betonová hranice", "stezky"]
cover: "/img/clanky/betonova-hranice-hero.jpg"
---

**Betonová hranice** je v českých reáliích unikátní — je to **největší naučná stezka věnovaná fortifikaci** v ČR a pokrývá 40 km úseku **Kladského klínu**, kde v letech 1935–1938 vznikla nejhustší koncentrace těžkého opevnění v celém Československu. Stezka je otevřená celoročně, lze ji projít pěšky nebo na kole a díky kombinaci muzeí, externě přístupných srubů a výkladových tabulí nabízí **pedagogicky hodnotný zážitek** pro rodiny i odborně zaměřené návštěvníky.

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

<div id="bh-map" style="height: 540px; border: 1px solid #C9BFA8; background: #F5F1E8; margin: 24px 0;"></div>

<script>
(function(){
  function init(){
    if (typeof L === 'undefined') { setTimeout(init, 100); return; }
    var el = document.getElementById('bh-map');
    if (!el || el._inited) return; el._inited = true;
    var map = L.map('bh-map', { scrollWheelZoom:false }).setView([50.1292, 16.7539], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:18, attribution:'© OpenStreetMap' }).addTo(map);
    map.on('click', function(){ map.scrollWheelZoom.enable(); });
    var body = [
      {n:'◆', title:'Červená Voda — start', lat:50.0500, lon:16.7283, href:null, note:'Severní výchozí bod, vlaková zastávka, IC', color:'#7A3B2E'},
      {n:1, title:'K-S 5 „Na sedle"', lat:50.0540, lon:16.7340, href:null, note:'První srub stezky — externě přístupný, III. odolnost', color:'#5A6B4F'},
      {n:2, title:'Tvrz Bouda', lat:50.1147, lon:16.7028, href:'/katalog/tvrz-bouda', note:'Klíčový bod — jediná plně průchozí dělostřelecká tvrz v ČR', color:'#2D5F3F'},
      {n:3, title:'Vojenské muzeum Králíky', lat:50.0850, lon:16.7647, href:null, note:'Expozice ŘOP, čs. armáda, Mnichov 1938', color:'#2D5F3F'},
      {n:4, title:'K-S 14 „U cihelny"', lat:50.0689, lon:16.7497, href:'/katalog/k-s-14-u-cihelny', note:'Slavný srub s vráceným pancéřovým zvonem z Atlantského valu', color:'#2D5F3F'},
      {n:5, title:'K-S 33 „U svatyně"', lat:50.0410, lon:16.7800, href:null, note:'Hřebenový srub, výchozí bod do údolí Moravy', color:'#5A6B4F'},
      {n:6, title:'Mladkov', lat:50.0167, lon:16.6792, href:null, note:'Jižní konec hlavní trasy, napojení na pohraniční linii', color:'#7A3B2E'},
      {n:7, title:'K-S 36 „Na sedle"', lat:50.0090, lon:16.6650, href:null, note:'Ikonická poloha s výhledem do Polska', color:'#5A6B4F'},
      {n:8, title:'K-S 43 „Adam"', lat:49.9920, lon:16.6440, href:null, note:'Vstupní srub plánované tvrze Adam', color:'#5A6B4F'}
    ];
    body.forEach(function(p){
      var icon = L.divIcon({ className:'', html:'<div style="width:30px;height:30px;border-radius:50%;background:'+p.color+';color:white;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:14px;border:2px solid white;box-shadow:0 1px 5px rgba(0,0,0,0.4);">'+p.n+'</div>', iconSize:[34,34], iconAnchor:[17,17] });
      var html = '<div style="font-family:inherit;min-width:220px;"><strong style="font-size:0.95rem;color:#3A2F20;">'+p.title+'</strong><br/><span style="font-size:0.8rem;color:#5A4A33;">'+p.note+'</span>'+(p.href?'<br/><a href="'+p.href+'" style="color:#7A3B2E;font-size:0.85rem;font-weight:600;margin-top:6px;display:inline-block;">Detail →</a>':'')+'</div>';
      L.marker([p.lat, p.lon], {icon:icon}).addTo(map).bindPopup(html);
    });
    var route = body.map(function(p){return [p.lat, p.lon];});
    L.polyline(route, {color:'#B85C2E', weight:3, opacity:0.7, dashArray:'8,8'}).addTo(map);
    var bounds = L.latLngBounds(route);
    map.fitBounds(bounds, {padding:[40,40]});
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
</script>

> **Trasa 40 km** — severní konec Červená Voda → tvrz Bouda → Králíky (muzeum + K-S 14 U cihelny) → Mladkov. Červená turistická značka kopíruje linii těžkého opevnění. Tmavě zelené body = muzea s prohlídkou; světle zelené = externě přístupné sruby; hnědé = obecné body trasy.

## Základní informace

| Parametr | Hodnota |
|---|---|
| Délka trasy | 40 km (hlavní linie) |
| Časová náročnost | 1 den (auto), 2–3 dny (pěšky/kolo) |
| Převýšení | cca 300 m (terén Kladského pohoří) |
| Značení | červená turistická |
| Rok otevření | 1994 (modernizace 2018) |
| Provozovatel | Společnost přátel čs. opevnění |
| Vstupné | zdarma (muzea platí zvlášť) |

## Trasa a nejdůležitější zastavení

Stezka sleduje **liniovou osu** čs. opevnění v Kladském klínu — od Červené Vody přes Králíky k Mladkovu. Je to **logický zeměpisný celek**: pohoří z jedné strany limitováno Kralickým Sněžníkem a z druhé Orlickými horami, uprostřed klínem vystupující polská Kladsko.

### Výchozí bod: Červená Voda

Severní konec stezky začíná v **Červené Vodě**, zastávka vlaku Pardubice–Jeseník. Zde je informační centrum s mapou a výchozí informační tabulí. První zastavení je u objektu **K-S 5 „Na sedle"** (500 m od nádraží) — srub III. stupně odolnosti, v rámci drobných úprav přístupný externě.

### Tvrz Bouda (klíčový bod)

Po 8 km jižním směrem dosáhnete **tvrze Bouda** — **hlavní atrakce celé stezky**. Komplex pěti podzemně propojených srubů, jediná plně průchozí dělostřelecká tvrz v ČR. Rezervace prohlídky nutná předem (přes [tvrzbouda.cz](https://tvrzbouda.cz)).

<figure>
  <img src="/img/forts/tvrz-bouda-objekt-k-s-22a-krok.jpg" alt="Tvrz Bouda — objekt K-S 22a „Krok" s pancéřovým zvonem" />
  <figcaption>Objekt K-S 22a „Krok" — jeden z pěti srubů tvrze Bouda. Foto: Wikimedia Commons (CC BY-SA)</figcaption>
</figure>

→ Detail: [Tvrz Bouda](/katalog/tvrz-bouda)

### Pěchotní srub K-S 14 „U cihelny"

U Králík (centrální bod stezky) leží **K-S 14 U cihelny** — proslulý návratem pancéřového zvonu z Atlantické zdi. Muzeum s vlastním provozem, otevřené o víkendech. Interiérová prohlídka s výkladem.

<div class="photo-grid">
  <figure>
    <img src="/img/forts/k-s-14-u-cihelny-1.jpg" alt="Pěchotní srub K-S 14 U cihelny — pohled na objekt s pancéřovým zvonem" />
    <figcaption>K-S 14 U cihelny — exteriér s vráceným pancéřovým zvonem</figcaption>
  </figure>
  <figure>
    <img src="/img/forts/k-s-14-u-cihelny-5.jpg" alt="K-S 14 — druhý pohled, detail vchodu a maskovacího zdiva" />
    <figcaption>Detail vchodu a maskování objektu</figcaption>
  </figure>
</div>

→ Detail: [K-S 14 U cihelny](/katalog/k-s-14-u-cihelny)

### Muzeum pevnosti Králíky

V **Králíkách** je druhé významné muzeum — **Vojenské muzeum Králíky** v objektu bývalých kasáren, s expozicí věnovanou ŘOP, čs. armádě a osudům pohraničí po Mnichovu. Muzeum je **ideální pro dny, kdy nechcete chodit v terénu** — teplé, osvětlené, s interaktivními panely.

### Jižní úsek: Mladkov a Jamné

Od Králík stezka pokračuje jihem k **Mladkovu** a dále k **Jamnému**, kde se napojuje na linii tzv. **pohraničních objektů** s výhledem do polské Kladské kotliny. Zde najdete desítky externě přístupných pěchotních srubů, z nichž většina je v původním nepoškozeném stavu (jen bez vybavení).

- **K-S 33 „U svatyně"** — srub na hřebenové cestě, výchozí bod k pěšímu výletu do údolí Moravy
- **K-S 36 „Na sedle"** — ikonická poloha s výhledem, oblíbené místo pro fotografy
- **K-S 43 „Adam"** — vstupní srub plánované tvrze, dnes externě přístupný s tabulí

## Doporučené trasy

### **Jednodenní auto-výlet** (60 km auto + 10 km pěšky)

- 9:00 — Start v Králíkách (parkování u muzea)
- 9:30 — Vojenské muzeum Králíky (1 h)
- 11:00 — K-S 14 U cihelny (prohlídka s průvodcem, 1,5 h)
- 13:00 — Oběd v Králíkách
- 14:30 — Tvrz Bouda (auto + prohlídka, 3 h)
- 17:30 — Návrat do Králík

### **Dvoudenní pěší túra** (cca 25 km)

**Den 1:** Červená Voda → tvrz Bouda → Králíky (nocleh)
**Den 2:** Králíky → K-S 14 → jižní linie → Mladkov

Doporučujeme **jaro nebo podzim** — v létě je v Kladském klínu mnoho turistů u hlavních muzeí, v zimě jsou vnitřní prohlídky uzavřené.

### **Cyklovýlet** (40 km cyklo + pěší vsuvky k objektům)

Trasa je sjízdná **MTB nebo gravelem** — hlavní linie po zpevněných lesních cestách, vsuvky k objektům občas po pěšinách. Doporučujeme **GPX stopu** ze stránky [bouda-cz.cz/cyklo](https://bouda-cz.cz/cyklo).

## Co si vzít

- **Pevné boty** (v okolí muzeí jsou hrubé cesty)
- **Teplé oblečení** — i v létě je v objektech 8–12 °C
- **Baterka** (některé venkovní objekty jsou přístupné bez osvětlení)
- **Foťák** — vítá se, blesk u interiérových prohlídek zakázán
- **Svačina** — mezi objekty jsou někde restaurační pauzy 2–3 h chůze
- **Povinně: pitná voda**

## Praktické informace

### Doprava

- **Auto:** D35 → Králíky (výstup ul. Střížová) — parkování u muzea
- **Vlak:** Pardubice → Letohrad → Králíky (2,5 h)
- **Vlakem:** Červená Voda má přímou linku ze směru Šumperk

### Ubytování

- **Hotel Beseda Králíky** — centrum města, 3*, od 1500 Kč
- **Chata u Boudy** — cca 1 km od tvrze, 2*, od 800 Kč
- **Penzion Jamné** — jižní konec stezky, 2*, od 900 Kč

### Stravování

- **Restaurace Beseda** — Králíky, česká kuchyně
- **Bistro u muzea** — přímo u Vojenského muzea, bufetový styl
- **Restaurace Panoramatická** — u tvrze Bouda, výhled do údolí

## Pro koho je stezka

**Vhodné pro:**
- rodiny s dětmi od 8 let (děti mladší mohou být přetížené délkou)
- milovníky vojenské historie
- sportovce (cyklisté, běžci)
- fotografy krajiny

**Méně vhodné pro:**
- děti mladší 8 let (velké vzdálenosti, málo interaktivity pro malé)
- lidi se sníženou pohyblivostí (některé objekty vyžadují lezení přes terén)
- ty, kdo chtějí jen 1–2 h výlet (stezka je logická jako celek)

## Historický kontext

Kladský klín byl v letech 1935–1938 **strategicky nejcennějším úsekem čs. pohraniční linie** — kontroloval přístup z německého Slezska (Wroclaw) do Čech a Moravy. Proto zde ČSR soustředilo **nejvíce tvrzí a pěchotních srubů na nejmenší ploše**:

- **3 tvrze:** Bouda, Adam, Hůrka
- **cca 60 pěchotních srubů** v hustotě 1 objekt na 500–800 m
- **Více než 500 lehkých objektů** (řopíků) v druhé a třetí linii

Po Mnichovské dohodě byl Kladský klín **v říjnu 1938 zabrán Německem** spolu s ostatními Sudety. Objekty byly používány Wehrmachtem k testování (cílová střelba) a v letech 1939–1940 byly **pancéřové zvony stahovány** k použití v Atlantickém valu. Po válce objekty zůstaly v majetku čs. armády, z nichž větší část byla v 50.–70. letech **zasypána nebo zabetonována**. Jen několik zachovalých objektů se v 80.–90. letech dočkalo muzejní rekonstrukce.

## Související obsah

- [Top 10 fortifikačních výletů](/clanky/top-10-fortifikacnich-vyletu) — Betonová hranice je v celkovém TOP 10
- [Tvrz Bouda](/katalog/tvrz-bouda) — hlavní cíl stezky
- [Naučná stezka Dobrošov](/clanky/naucna-stezka-dobrosov) — sousední stezka v Orlických horách

**Máte konkrétní dotaz ke stezce? Napište nám — redakce stezku fyzicky navštěvuje a aktualizuje informace minimálně jednou ročně.**
