---
title: "Tip na výlet: Valticko — řopíky pod UNESCO zámky"
pubDate: 2026-04-18
author: "redakce ropiky.cz"
description: "Jednodenní i víkendový výlet na Valticko — kombinace lehkého opevnění linie B-4 s UNESCO Lednicko-valtickým areálem. Interaktivní mapa, GPS body, trasa, tipy na víno a ubytování."
tags: ["výlety", "valticko", "lednicko-valtický areál", "cyklo", "jižní morava", "unesco"]
cover: "/img/clanky/valticko-hero.jpg"
---

**Valticko je nejzvláštnější fortifikační region ČR** — kde jinde stojí betonový řopík 200 metrů od barokní Kolonády nebo uprostřed UNESCO krajinného parku? Úsek **B-4 Úvaly — Břeclav** se staval v letech 1937–1938 proti tehdejšímu Rakousku a dodnes nabízí nejlepší poměr **opevnění : kultura : vinařství** na celé jižní Moravě.

Tento průvodce obsahuje **interaktivní mapu trasy s 9 řopíky a 4 zámky**, tři varianty výletu (auto/cyklo/rodina), praktické info o ubytování a vinných sklepech.

## Mapa trasy — 9 řopíků + zámky Lednicko-valtického areálu

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

<div id="valticko-map" style="height: 520px; border: 1px solid #C9BFA8; background: #F5F1E8; margin: 24px 0;"></div>

<div class="map-legend-article" style="display:flex; flex-wrap:wrap; gap:16px 24px; font-size:0.85rem; color:#5A4A33; margin-top: -8px; margin-bottom: 28px;">
  <span><span style="display:inline-block; width:14px; height:14px; border-radius:50%; background:#5A6B4F; border:2px solid white; box-shadow:0 0 0 1px #444; vertical-align:-3px; margin-right:4px;"></span> Řopík LO vz. 37 (9 bodů)</span>
  <span><span style="display:inline-block; width:14px; height:14px; background:#7A3B2E; border:2px solid white; box-shadow:0 0 0 1px #444; vertical-align:-3px; margin-right:4px;"></span> Zámek / památka UNESCO</span>
  <span><span style="display:inline-block; width:20px; height:3px; background:#B85C2E; vertical-align:3px; margin-right:4px;"></span> Doporučená trasa (Var. A, auto)</span>
</div>

<script>
(function(){
  function init(){
    if (typeof L === 'undefined') { setTimeout(init, 100); return; }
    var mapEl = document.getElementById('valticko-map');
    if (!mapEl || mapEl._inited) return;
    mapEl._inited = true;

    var map = L.map('valticko-map', { scrollWheelZoom: false }).setView([48.748, 16.795], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap'
    }).addTo(map);
    map.on('click', function(){ map.scrollWheelZoom.enable(); });

    var ropiky = [
      {n:1, title:'8/X/A-140 Úvaly', slug:'lo-vz-37-uvaly-u-valtic', lat:48.7180, lon:16.7710, note:'Nejjižnější řopík Moravy, v polích u hranice'},
      {n:2, title:'8/13/A-160 Boří dvůr', slug:'lo-vz-37-bori-dvur', lat:48.7286, lon:16.7030, note:'Samota s vlastní kaplí a studnou'},
      {n:3, title:'8/12/A-140 Katzelsdorfská cesta', slug:'lo-vz-37-katzelsdorfska-cesta', lat:48.7325, lon:16.7372, note:'V Bořím lese jižně od Valtic'},
      {n:4, title:'8/12/A-180 Rajstna', slug:'lo-vz-37-rajstna', lat:48.7338, lon:16.7510, note:'Klíčový bod — přímo pod barokní Kolonádou'},
      {n:5, title:'8/10/A-140 Hlohovec', slug:'lo-vz-37-hlohovec', lat:48.7837, lon:16.7632, note:'U Hlohoveckého rybníka'},
      {n:6, title:'8/9/A-160 Janohrad', slug:'lo-vz-37-lednice-janohrad', lat:48.7962, lon:16.8292, note:'V lužním lese pod novogotickou zříceninou'},
      {n:7, title:'8/7/A-160 Charvátská NV', slug:'lo-vz-37-charvatska-nova-ves', lat:48.7685, lon:16.8553, note:'Na břehu Dyje'},
      {n:8, title:'8/5/A-140 Poštorná', slug:'lo-vz-37-poestorna', lat:48.7446, lon:16.8796, note:'Jižní okraj Břeclavi, rozpadlý'},
      {n:9, title:'8/2/A-140 Ranšpurk', slug:'lo-vz-37-ranspurk', lat:48.6725, lon:16.9421, note:'NPR, soutok Dyje a Moravy'}
    ];

    var pamatky = [
      {title:'Zámek Valtice (UNESCO)', lat:48.7403, lon:16.7572, link:'https://www.zamek-valtice.cz', note:'Rezidence Lichtenštejnů, Národní salon vín ČR'},
      {title:'Kolonáda Rajstna', lat:48.7345, lon:16.7510, link:null, note:'Klasicistní kolonáda z r. 1817 s výhledem na Pálavu'},
      {title:'Zámek Lednice (UNESCO)', lat:48.8017, lon:16.8051, link:'https://www.zamek-lednice.com', note:'Novogotický zámek, Minaret, francouzský park'},
      {title:'Janův hrad', lat:48.7973, lon:16.8256, link:null, note:'Novogotická umělá zřícenina z r. 1810'}
    ];

    ropiky.forEach(function(r){
      var icon = L.divIcon({
        className:'',
        html:'<div style="width:28px;height:28px;border-radius:50%;background:#5A6B4F;color:white;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:13px;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);">'+r.n+'</div>',
        iconSize:[32,32], iconAnchor:[16,16]
      });
      L.marker([r.lat, r.lon], {icon:icon}).addTo(map).bindPopup(
        '<div style="font-family:inherit;min-width:220px;">'+
          '<strong style="font-size:0.95rem;color:#3A2F20;">'+r.n+'. '+r.title+'</strong><br/>'+
          '<span style="font-size:0.8rem;color:#5A4A33;">'+r.note+'</span><br/>'+
          '<a href="/katalog/'+r.slug+'" style="color:#7A3B2E;font-size:0.85rem;font-weight:600;margin-top:6px;display:inline-block;">Detail objektu →</a>'+
        '</div>'
      );
    });

    pamatky.forEach(function(p){
      var icon = L.divIcon({
        className:'',
        html:'<div style="width:22px;height:22px;background:#7A3B2E;color:white;display:flex;align-items:center;justify-content:center;font-size:14px;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);">★</div>',
        iconSize:[26,26], iconAnchor:[13,13]
      });
      L.marker([p.lat, p.lon], {icon:icon}).addTo(map).bindPopup(
        '<div style="font-family:inherit;min-width:200px;">'+
          '<strong style="font-size:0.95rem;color:#3A2F20;">'+p.title+'</strong><br/>'+
          '<span style="font-size:0.8rem;color:#5A4A33;">'+p.note+'</span>'+
          (p.link ? '<br/><a href="'+p.link+'" target="_blank" rel="noopener" style="color:#7A3B2E;font-size:0.85rem;font-weight:600;margin-top:6px;display:inline-block;">Web památky ↗</a>' : '')+
        '</div>'
      );
    });

    // Doporučená trasa (Varianta A) — Valtice → Rajstna → Boří dvůr → Úvaly → Lednice → Janohrad → Valtice
    var trasaA = [
      [48.7403, 16.7572], // Zámek Valtice
      [48.7338, 16.7510], // Rajstna 4
      [48.7286, 16.7030], // Boří dvůr 2
      [48.7180, 16.7710], // Úvaly 1
      [48.8017, 16.8051], // Lednice
      [48.7962, 16.8292], // Janohrad 6
      [48.7403, 16.7572]  // zpět Valtice
    ];
    L.polyline(trasaA, {color:'#B85C2E', weight:3, opacity:0.85, dashArray:'8,4'}).addTo(map);

    var bounds = L.latLngBounds(ropiky.map(function(r){return [r.lat, r.lon];}));
    pamatky.forEach(function(p){ bounds.extend([p.lat, p.lon]); });
    map.fitBounds(bounds, {padding:[30,30]});
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>

> **Tip:** Klikněte na číslo v mapě pro detail řopíku nebo na ★ pro zámky a památky. Oranžová čárkovaná čára znázorňuje doporučenou jednodenní trasu autem (Varianta A).

## Proč právě Valticko

Klasická jihomoravská fortifikační destinace — jenže s **třemi unikátními vlastnostmi** navíc:

1. **UNESCO kontext.** Lednicko-valtický areál (zápis 1996) je barokní a novogotický park Liechtensteinů. Řopíky v jeho krajině tvoří nečekanou vrstvu.
2. **Cyklostezky prvotřídní kvality.** Moravská vinařská stezka, Lichtenštejnské stezky, Mikulovská cyklostezka — všechny procházejí okolo řopíků.
3. **Vinařská infrastruktura.** Největší koncentrace vinařů a sklepů v ČR. Po výletu degustace bez komplikací.

Nikde jinde v Evropě nenajdete řadu lehkých opevnění procházející přímo UNESCO parkem.

<figure>
  <img src="/img/forts/hnanice-gnadlersdorf-lo-vz.-37.jpg" alt="Typický řopík LO vz. 37 — srovnatelná konstrukce jako v úseku B-4 u Valtic" />
  <figcaption>Řopík LO vz. 37 na jižní Moravě — typická konstrukce, která se v úseku B-4 opakuje 200×. Foto: Wikimedia Commons (CC BY-SA)</figcaption>
</figure>

## 9 konkrétních řopíků — seřazeno podle trasy

Čísla odpovídají značení v mapě nahoře. Řazeno od jihu k severu (tak, jak projíždíte po cyklostezce nebo autem od Mikulova).

| # | Objekt | Lokalita | GPS | Stav |
|---|---|---|---|---|
| **1** | [8/X/A-140 Úvaly](/katalog/lo-vz-37-uvaly-u-valtic) | nejjižnější bod Moravy | 48.7180°N, 16.7710°E | přístupný |
| **2** | [8/13/A-160 Boří dvůr](/katalog/lo-vz-37-bori-dvur) | samota s kaplí | 48.7286°N, 16.7030°E | přístupný |
| **3** | [8/12/A-140 Katzelsdorfská](/katalog/lo-vz-37-katzelsdorfska-cesta) | Boří les | 48.7325°N, 16.7372°E | přístupný |
| **4** | [8/12/A-180 Rajstna](/katalog/lo-vz-37-rajstna) | **pod Kolonádou** ★ | 48.7338°N, 16.7510°E | přístupný |
| **5** | [8/10/A-140 Hlohovec](/katalog/lo-vz-37-hlohovec) | u Hlohoveckého rybníka | 48.7837°N, 16.7632°E | přístupný |
| **6** | [8/9/A-160 Janohrad](/katalog/lo-vz-37-lednice-janohrad) | **lužní les u Janova hradu** ★ | 48.7962°N, 16.8292°E | přístupný |
| **7** | [8/7/A-160 Charvátská NV](/katalog/lo-vz-37-charvatska-nova-ves) | břeh Dyje | 48.7685°N, 16.8553°E | přístupný |
| **8** | [8/5/A-140 Poštorná](/katalog/lo-vz-37-poestorna) | jižní okraj Břeclavi | 48.7446°N, 16.8796°E | rozpadlý |
| **9** | [8/2/A-140 Ranšpurk](/katalog/lo-vz-37-ranspurk) | NPR, soutok Dyje/Moravy | 48.6725°N, 16.9421°E | přístupný |

★ *Nejlepší body pro první návštěvu — kombinují opevnění s výjimečnou kulisou.*

V úseku B-4 stálo původně přes 200 řopíků — dochovaných je cca 80, přístupných a fotogenických kolem 20. Těchto 9 jsou ty nejlepší, k nimž se lze dostat bez terénní orientace.

## Doporučená trasa — 3 varianty

### Varianta A: Jednodenní auto-výlet (8 hodin)

Ideální kombinace **zámek + řopík + vinný sklep**. Trasa v mapě nahoře (oranžová čárkovaná linie).

| Čas | Místo | Aktivita |
|---|---|---|
| **9:00** | Valtice, zámek | Parkování, prohlídka zámku (75 min, 180 Kč). [zamek-valtice.cz](https://www.zamek-valtice.cz) |
| **10:30** | Kolonáda Rajstna | Pěšky 1,5 km ze zámku. **Řopík č. 4 Rajstna** přímo u kolonády. |
| **11:30** | Boří dvůr | Auto 5 min. **Řopík č. 2 Boří dvůr** v polích, historická samota s kaplí. |
| **12:30** | Valtice, oběd | U Kapličky (200–350 Kč) nebo Hotel Hubertus (vyšší gastronomie). |
| **14:00** | Úvaly u Valtic | Auto 10 min. **Řopík č. 1 Úvaly** — nejjižnější bod, fotogenický v polích. |
| **15:00** | Lednice, zámek | Auto 15 min. Prohlídka zámku (60 min, 220 Kč), park, Minaret. |
| **17:00** | Janohrad | Pěšky 30 min. **Řopík č. 6** uprostřed lužního lesa — nejatmosféričtější objekt trasy. |
| **18:30** | Valtice, vinný sklep | **Národní salon vín ČR** v křížové chodbě zámku — degustace 100 vzorků (400 Kč). [salonvin.cz](https://www.salonvin.cz) |
| **20:00** | Odjezd | Návrat do Brna/Prahy nebo přenocování. |

### Varianta B: Víkendový cyklo-výlet (2 dny, 60 km)

Základna: **Penzion v Lednici** nebo **Hotel Galant Mikulov**.

**Den 1 — Valtice a okolí (30 km)**

Valtice (zámek) → Kolonáda Rajstna (řopík **4**) → Boří dvůr (řopík **2**) → Úvaly u Valtic (řopík **1**) → Hlohovec (řopík **5**) → Apollonův chrám → zpět do Valtic.

**Den 2 — Lednice a Dyje (30 km)**

Lednice (zámek, Minaret) → Janohrad (řopík **6**) → cyklostezka podél Dyje → Charvátská NV (řopík **7**) → Břeclav (Poštorná, řopík **8**) → NPR Ranšpurk (řopík **9**) → vlakem zpět do Břeclavi.

### Varianta C: Rodinný krátký výlet (4 hodiny)

Stručná trasa pro rodiny s dětmi — jen to nejlepší:

Zámek Valtice (prohlídka) → Kolonáda Rajstna + řopík **4** → Lednice (zámek, park) → Minaret

Bez cykla, autem. Vhodné pro děti od 6 let.

## Kdy jet

| Období | Doporučení |
|---|---|
| **Duben — červen** | nejlepší — kvetou louky, vinná réva se probouzí, řopíky nejsou zarostlé |
| **Červenec — srpen** | vrchol sezóny — hodně turistů, rezervace nutná, ale začíná burčák a první vinobraní |
| **Září — říjen** | fantastické — vinobraní v plném proudu, krajina barevná, optimální kombinace |
| **Listopad — březen** | klid, zámky zavřené, ale krajina fotogenická; řopíky lépe vidět (bez listí) |

## Praktické informace

### Doprava

- **Autem z Brna:** D2 → Břeclav exit → Valtice (60 km, 50 min)
- **Autem z Prahy:** D1 → Brno → D2 → Břeclav (250 km, 3 h)
- **Vlakem:** Brno → Břeclav (40 min) → Valtice (lokálka, 10 min) → Lednice bus
- **Kolem:** půjčovny v Břeclavi, Lednici, Valticích (150–250 Kč/den)

### Ubytování

| Místo | Hotel | Cena/os. | Web |
|---|---|---|---|
| Valtice | Hotel Hubertus | 1500 Kč | [hotelhubertus.cz](https://www.hotelhubertus.cz) |
| Lednice | Penzion U Tří Mušketýrů | 800 Kč | [penzion-lednice.cz](https://www.penzion-lednice.cz) |
| Mikulov (20 km) | Hotel Galant ★★★★ | 2200 Kč | — |

### Vinné sklepy

- **Národní salon vín ČR** — Valtice, křížová chodba zámku, nejvyšší kvalita (degustace 400 Kč).
- **Vinařství Tanzberg Mikulov** — prémiová vína, mezinárodní ocenění.
- **Sklep Nové Mlýny** — autentický soukromý, cena přátelská.

### Gastronomie

- **U Kapličky Valtice** — tradiční jihomoravská, 200–350 Kč.
- **Restaurace Galant Mikulov** — fine dining, 500–800 Kč.
- **Bistro Plant Food Lednice** — vegetariánské, 180–280 Kč.

## Pro koho je trasa vhodná

**Ideální pro:**
rodiny s dětmi (zámky + příroda), cyklisty (stezky první třídy), fotografy (unikátní kombinace historických vrstev), vinaře a gurmány (Pálava, Mikulovsko).

**Méně vhodné pro:**
vyznavače „extrémního" opevnění — na Valticku nejsou tvrze jako Bouda nebo Hanička, jen lehké objekty. Také některé řopíky jsou v terénu mimo zpevněné cesty — návštěvníkům s omezenou mobilitou doporučujeme držet se Varianty C.

## Srovnání s dalšími fortifikačními regiony

| Kritérium | **Valticko** | Orlické hory | Králicko | Ostravsko |
|---|---|---|---|---|
| Typ opevnění | LO vz. 37 | LO + tvrz | LO + 2 tvrze | TO linie |
| Pevnostní obsah | ★★ | ★★★★ | ★★★★★ | ★★★★ |
| Kulturní bonus | ★★★★★ (UNESCO) | ★★ | ★★★ | ★★ |
| Gastronomie / víno | ★★★★★ | ★★ | ★★★ | ★★★ |
| Cyklo infrastruktura | ★★★★★ | ★★★ | ★★★ | ★★ |
| **„Všechno v jednom"** | **★★★★★** | ★★★ | ★★★★ | ★★★ |

Valticko je **první volbou** pro ty, kdo chtějí **spojit opevnění s kulturou, jídlem a vínem**. Pokud hledáte jen „čisté" pevnostní zážitky, směřujte do Orlických hor nebo na Králicko.

## Doporučené zdroje

- [Typologie řopíku LO vz. 37](/typologie/lo-vz-37) — konstrukce, odolnost, výzbroj
- [Top 10 fortifikačních výletů](/clanky/top-10-fortifikacnich-vyletu) — žebříček destinací
- [Lednicko-valtický areál — UNESCO](https://lednicko-valticky-areal.cz) — oficiální stránka
- [KVH Valtice](http://kvhvaltice.cz) — spolek, který udržuje řopíky na lince B-4

---

**Závěr:** Valticko je **nejlepší volba pro všestranný víkend** — kde si pán domu užije řopíky, paní zámky, děti Minaret a babička víno. Tak bohaté kombinace najdete málokde v Evropě.
