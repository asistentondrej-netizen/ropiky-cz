---
title: "Naučná stezka Darkovičky — Hlučínsko-Petřkovická linie"
pubDate: 2026-04-18
author: "redakce ropiky.cz"
description: "Naučná stezka po Muzeu čs. opevnění Hlučín-Darkovičky — 4 km, 10 zastavení, linie 5 pěchotních srubů v originálním stavu. Ideální rodinný výlet z Ostravy."
tags: ["výlety", "turistika", "hlučín", "darkovičky", "ostrava"]
cover: "/img/clanky/darkovicky-hero.jpg"
---

**Naučná stezka Darkovičky** je **nejnavštěvovanější fortifikační stezka na Moravě** a zároveň jedna z nejrodinnějších. Provádí návštěvníka po kompletní **linii pěti pěchotních srubů** MO-S 19 až MO-S 23, kterou udržuje **Slezské zemské muzeum**. Stezka je vhodná pro všechny věkové kategorie, dobře dostupná z Ostravy a kombinuje **venkovní prohlídku** s **interiérovými expozicemi** tří otevřených objektů.

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

<div id="darkovicky-map" style="height: 460px; border: 1px solid #C9BFA8; background: #F5F1E8; margin: 24px 0;"></div>

<script>
(function(){
  function init(){
    if (typeof L === 'undefined') { setTimeout(init, 100); return; }
    var el = document.getElementById('darkovicky-map');
    if (!el || el._inited) return; el._inited = true;
    var map = L.map('darkovicky-map', { scrollWheelZoom:false }).setView([49.912, 18.145], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:18, attribution:'© OpenStreetMap' }).addTo(map);
    map.on('click', function(){ map.scrollWheelZoom.enable(); });
    var body = [
      {n:'◆', title:'Muzejní vstup Darkovičky', lat:49.9098, lon:18.1418, href:null, note:'Pokladna, úvodní expozice, parkoviště', color:'#7A3B2E'},
      {n:1, title:'MO-S 19 „Alej" (interiér)', lat:49.91037, lon:18.14058, href:'/katalog/mo-s-19-alej', note:'Nejrekonstruovanější srub v ČR — prohlídka 30 min s průvodcem', color:'#2D5F3F'},
      {n:2, title:'MO-S 20 „Orel" (interiér)', lat:49.91112, lon:18.14203, href:'/katalog/mo-s-20-orel', note:'Hlavní palebný objekt — protitankový kanón vz. 36', color:'#2D5F3F'},
      {n:3, title:'MO-S 21 „Šibenice" (interiér)', lat:49.91205, lon:18.14380, href:null, note:'Otevřeno od 2023 — jiný typ pancéřového zvonu', color:'#2D5F3F'},
      {n:4, title:'MO-S 22 (externě)', lat:49.91310, lon:18.14570, href:null, note:'Neudržovaný srub — pedagogická ukázka destrukce', color:'#5A6B4F'},
      {n:5, title:'MO-S 23 „Na chlupáči" (externě)', lat:49.91420, lon:18.14770, href:'/katalog/mo-s-23-na-chlupaci', note:'Externí objekt v polní krajině — ideální pro fotografii', color:'#5A6B4F'}
    ];
    body.forEach(function(p){
      var icon = L.divIcon({ className:'', html:'<div style="width:30px;height:30px;border-radius:50%;background:'+p.color+';color:white;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:14px;border:2px solid white;box-shadow:0 1px 5px rgba(0,0,0,0.4);">'+p.n+'</div>', iconSize:[34,34], iconAnchor:[17,17] });
      var html = '<div style="font-family:inherit;min-width:220px;"><strong style="font-size:0.95rem;color:#3A2F20;">'+p.title+'</strong><br/><span style="font-size:0.8rem;color:#5A4A33;">'+p.note+'</span>'+(p.href?'<br/><a href="'+p.href+'" style="color:#7A3B2E;font-size:0.85rem;font-weight:600;margin-top:6px;display:inline-block;">Detail objektu →</a>':'')+'</div>';
      L.marker([p.lat, p.lon], {icon:icon}).addTo(map).bindPopup(html);
    });
    L.polyline(body.map(function(p){return [p.lat, p.lon];}), {color:'#B85C2E', weight:3, opacity:0.85, dashArray:'6,4'}).addTo(map);
    var bounds = L.latLngBounds(body.map(function(p){return [p.lat, p.lon];}));
    map.fitBounds(bounds, {padding:[30,30]});
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
</script>

> **Okruh 4 km** — pět pěchotních srubů MO-S 19 Alej → MO-S 20 Orel → MO-S 21 Šibenice → MO-S 22 → MO-S 23 Na chlupáči. Tmavě zelené body jsou **muzea s interiérem**, světle zelené **externě přístupné**, hnědý kosočtverec je **vstup do areálu**. Klikněte na marker pro detail.

<div class="photo-grid">
  <figure>
    <img src="/img/forts/hlu-n-darkovi-ky-mo-s-19-rok-2001-01-.jpg" alt="MO-S 19 Alej — pěchotní srub s rekonstruovaným interiérem" />
    <figcaption>MO-S 19 Alej — nejrekonstruovanější srub v ČR (Wikimedia Commons)</figcaption>
  </figure>
  <figure>
    <img src="/img/forts/darkovice-mo-s-20-2015-05-01-03-.jpg" alt="MO-S 20 Orel — hlavní palebný objekt linie Darkovičky" />
    <figcaption>MO-S 20 Orel — s protitankovým kanónem vz. 36 v lafetě</figcaption>
  </figure>
  <figure>
    <img src="/img/forts/darkovice--mo-s-23--2015-05-01--01-.jpg" alt="MO-S 23 — poslední objekt linie Darkovičky" />
    <figcaption>MO-S 23 — externí objekt v polní krajině</figcaption>
  </figure>
</div>

## Základní údaje

| Parametr | Hodnota |
|---|---|
| Délka | 4 km (okruh) |
| Časová náročnost | 3–4 hodiny |
| Převýšení | 50 m (rovinatý terén) |
| Zastavení | 10 informačních panelů |
| Značení | zelené turistické se symbolem srubu |
| Provozovatel | Slezské zemské muzeum Opava |
| Vstupné | **stezka zdarma**, muzejní prohlídky 120 Kč |

## Zvláštnosti stezky

- **Nejkompletnější linie** — pět objektů v řadě, zkrácená verze toho, jak by fungovala celá pohraniční linie
- **Tři otevřená muzea** — MO-S 19 Alej, MO-S 20 Orel a MO-S 21 Ostrý (od roku 2023)
- **Originální rekvizity** — pancéřové zvony (repliky), lafety, kulomety
- **Dobře přístupná** — 20 minut autem z Ostravy, 10 min pěšky z MHD
- **Rodinná prohlídka** — děti se baví, dospělí se vzdělávají

## Trasa zastavení

### Zastavení 1: Hlavní vstup a muzejní pokladna

Výchozí bod — parkoviště u muzea, rezervace vstupu, úvodní expozice. Zde si zakoupíte **kombinovaný vstup** (120 Kč na všechna 3 muzea).

### Zastavení 2: Protitankové překážky

Hned za vstupem **pole ocelových ježků a betonových zátarasů** — rekonstrukce ukazuje, jak vypadaly okolní pevnostní objekty před frontem. Tabule vysvětluje, jak fungovaly proti tankům (rozbíjení podvozků, zadržení pohybu).

### Zastavení 3: MO-S 19 „Alej" (interiér otevřen)

**Nejrekonstruovanější srub v ČR.** Vstupujete do plně vybaveného interiéru — lůžka, stoly, kulometné lafety, pancéřový zvon, munice v regálech. **Prohlídka trvá 30 minut** s průvodcem (plánovanou v každou celou hodinu).

→ Detail: [MO-S 19 Alej](/katalog/mo-s-19-alej)

### Zastavení 4: Polní opevnění mezi objekty

Mezi MO-S 19 a MO-S 20 je **rekonstruovaný úsek polního opevnění** — zákopy, kulometná hnízda, drátěné zátarasy. Tabule popisuje, jak polní opevnění doplňovalo betonové objekty a kdo by ho obsluhoval (pěchota záložního pluku).

### Zastavení 5: MO-S 20 „Orel" (interiér otevřen)

Druhé otevřené muzeum. Orel byl **hlavní palebný objekt** v linii — zde si můžete prohlédnout **protitankový kanón vz. 36 v originální lafetě** (replika). Prohlídka 25 min.

→ Detail: [MO-S 20 Orel](/katalog/mo-s-20-orel)

### Zastavení 6: MO-S 21 „Šibenice" (interiér otevřen od 2023)

**Nejnovější přírůstek** muzejní expozice. Otevřeno od jara 2023 po rozsáhlé rekonstrukci. Zajímavost: Šibenice má **jiný typ pancéřového zvonu** než předchozí dva objekty (vyšší stupeň odolnosti) — tabule vysvětluje rozdíl.

### Zastavení 7: MO-S 22 (externě)

**Pouze externě přístupný** srub. Tabule vysvětluje, proč tento objekt nebyl dosud rekonstruován — silně poškozen po válce. Pedagogický kontext: destruovaný objekt pro srovnání s rekonstruovanými sousedy.

### Zastavení 8: MO-S 23 „Na chlupáči" (externě)

Poslední objekt linie, externě přístupný. Nachází se **na okraji pole**, v polně-krajinném prostředí — ideální pro **fotografii objektu v krajině**, jak byl původně zasazen.

→ Detail: [MO-S 23 Na chlupáči](/katalog/mo-s-23-na-chlupaci)

### Zastavení 9: Podzemní dělostřelecká baterie (demonstrace)

**Nevelká rekonstrukce** podzemní dělostřelecké baterie — ukázka toho, jak by vypadaly dělostřelecké objekty (kterých v linii Hlučín-Darkovičky bylo nedostatek). **Pedagogická demonstrace** s modely.

### Zastavení 10: Pamětní místo a závěr

Pamětní kámen obětem **mobilizace 1938 v Hlučínsku** a závěrečná tabule shrnující výlet. Zde končí stezka, vrátíte se k hlavnímu vchodu.

## Doporučený plán

**Standardní rodinný výlet (4 h):**

- 10:00 — Příjezd, parkování
- 10:00–10:30 — Úvodní expozice
- 10:30–11:00 — Stezka začátek (zastavení 1–2)
- 11:00–11:30 — **MO-S 19 Alej** prohlídka
- 11:30–12:00 — Přechod k Orlu (zastavení 3–4)
- 12:00–12:30 — **MO-S 20 Orel** prohlídka
- 12:30–13:30 — Oběd (bistro u muzea)
- 13:30–14:00 — **MO-S 21 Ostrý** prohlídka
- 14:00–15:00 — Zbylá zastavení 6–10
- 15:00 — Odjezd

## Co si vzít

- **Pevné boty** — stezka je polní, v blátě po dešti
- **Teplé oblečení** — v srubech 10 °C
- **Pláštěnka** (Slezsko je deštivá oblast)
- **Foťák** — rekonstruované interiéry jsou fotogenické, bez blesku
- **Svačina** — i když je bistro, mezi jednotlivými zastaveními 15–20 min
- **Kapesné na souvenýry** — muzeum má zajímavý obchod (knihy, modely, upomínkové kovové mince)

## Pro rodiny s dětmi

Darkovičky jsou **nejvíce rodinná stezka** ze všech čtyř popsaných. Pro děti nabízí:

- **Interaktivní panel v muzeu** — „Postav si svůj srub" s magnetickými dílky
- **Prohlídka uniforem** — oděvy čs. armády z roku 1938 pro vyzkoušení
- **Krátké prohlídky** — 25–30 min, dětská pozornost vydrží
- **Kolem stezky:** dětské hřiště u parkoviště, občerstvení

Vhodné **od 6 let**, optimální od 8–10 let (kdy dítě rozumí historickému kontextu).

## Doprava

- **Auto:** D1/D56 → Ostrava → silnice 56 → Darkovičky (30 min z Ostravy, 3 h z Prahy)
- **Vlak:** Ostrava hl. nádr. → Hlučín (bus 300 linka) → pěšky 15 min
- **MHD Ostrava:** linka 400 z Ostravy-Poruby do Darkovic, pak 10 min pěšky
- **Parkování:** zdarma u vchodu do muzea (50 míst)

## Otevírací doba

- **Hlavní sezóna** (duben–říjen): středa–neděle 9:00–17:00
- **Letní sezóna** (červenec–srpen): úterý–neděle 9:00–18:00
- **Zimní sezóna** (listopad–březen): **uzavřeno**, stezku lze projít externě
- **Prázdniny** otevřeno i v pondělí

## Související obsah

- [MO-S 19 Alej](/katalog/mo-s-19-alej), [MO-S 20 Orel](/katalog/mo-s-20-orel), [MO-S 23 Na chlupáči](/katalog/mo-s-23-na-chlupaci)
- [Top 10 fortifikačních výletů](/clanky/top-10-fortifikacnich-vyletu) — Darkovičky jsou v TOP 10 (č. 4)
- [Typologie: pěchotní srub](/typologie/pechotni-srub) — pro teoretické pozadí

**Darkovičky jsou nejlepší volbou pro první seznámení s čs. opevněním.** Pokud vám tato stezka zachutná, vydejte se pak na větší — Dobrošov nebo Betonovou hranici.
