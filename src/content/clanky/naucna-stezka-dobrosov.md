---
title: "Naučná stezka Dobrošovem — okruh kolem nedostavěné tvrze"
pubDate: 2026-04-18
author: "redakce ropiky.cz"
description: "Naučná stezka okolo dělostřelecké tvrze Dobrošov u Náchoda — 12 zastavení, 8 km, doprovází hlavní muzeum tvrze a ukazuje další objekty v okolí. Praktický průvodce s mapou."
tags: ["výlety", "turistika", "dobrošov", "náchod", "stezky"]
cover: "/img/clanky/dobrosov-hero.jpg"
---

**Naučná stezka Dobrošovem** je doprovodný okruh kolem [dělostřelecké tvrze Dobrošov](/katalog/tvrz-dobrosov) v okrese Náchod. Na rozdíl od velké Betonové hranice u Králík je tato stezka **kompaktnější** (8 km, 12 zastavení) a tím je ideální pro **jednodenní výlet z Náchoda nebo Hradce Králové**. Stezka kombinuje hlavní atrakci — tvrz Dobrošov — s dalšími objekty, panoramatickými výhledy a místy bojů z let 1938–1945.

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

<div id="dobrosov-map" style="height: 460px; border: 1px solid #C9BFA8; background: #F5F1E8; margin: 24px 0;"></div>

<script>
(function(){
  function init(){
    if (typeof L === 'undefined') { setTimeout(init, 100); return; }
    var el = document.getElementById('dobrosov-map');
    if (!el || el._inited) return; el._inited = true;
    var map = L.map('dobrosov-map', { scrollWheelZoom:false }).setView([50.417, 16.19], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:18, attribution:'© OpenStreetMap' }).addTo(map);
    map.on('click', function(){ map.scrollWheelZoom.enable(); });
    var body = [
      {n:'◆', title:'Vojenské muzeum Náchod', lat:50.4156, lon:16.1639, href:null, note:'Výchozí bod stezky, parkování, úvodní expozice', color:'#7A3B2E'},
      {n:1, title:'Tvrz Dobrošov', lat:50.4106, lon:16.1856, href:'/katalog/tvrz-dobrosov', note:'Hlavní cíl — nedokončená dělostřelecká tvrz, muzeum', color:'#2D5F3F'},
      {n:2, title:'N-S 75 „Zelený"', lat:50.4145, lon:16.1820, href:null, note:'Povrchový srub tvrze Dobrošov', color:'#5A6B4F'},
      {n:3, title:'Vyhlídka Skalka', lat:50.4189, lon:16.1920, href:null, note:'Panoramatický výhled na Náchod a hraniční hřeben', color:'#7A3B2E'},
      {n:4, title:'N-S 80 „Jirásek"', lat:50.41141, lon:16.19974, href:'/katalog/n-s-80-jirasek', note:'Izolovaný TO chránící křižovatku Náchod–Police', color:'#5A6B4F'}
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

> **Okruh 8 km, 12 zastavení** — výchozí bod Vojenské muzeum Náchod → tvrz Dobrošov → srub N-S 75 → vyhlídka Skalka → N-S 80 Jirásek → zpět. Žlutá turistická značka.

<figure>
  <img src="/img/forts/nachod--dobrosov--n-s-80--rok-2002-.jpg" alt="Pěchotní srub N-S 80 Jirásek — závěrečný bod naučné stezky u Náchoda" />
  <figcaption>N-S 80 „Jirásek" — izolovaný TO chránící křižovatku Náchod–Police. Foto: Wikimedia Commons</figcaption>
</figure>

## Základní údaje

| Parametr | Hodnota |
|---|---|
| Délka okruhu | 8 km |
| Časová náročnost | 4–5 hodin (s prohlídkou tvrze) |
| Převýšení | 200 m |
| Značení | žluté turistické se symbolem srubu |
| Zastavení | 12 informačních tabulí |
| Provozovatel | Klub vojenské historie Náchod |
| Vstupné | zdarma (jen tvrz Dobrošov 150 Kč) |

## Trasa a zastavení

Stezka začíná v **Náchodě u Vojenského muzea** (zastávka MHD Vojenská), je **kruhová** a vrátí se do výchozího bodu. Můžete ji projít pěšky nebo (s opatrností) na trekkingovém kole.

### Zastavení 1: Vojenské muzeum Náchod

Výchozí bod stezky. Vojenské muzeum Náchod je menší expozice věnovaná **historii pěšího pluku 18. ČSR** a **událostem září 1938** v Náchodsku. Vstupné 50 Kč, otevřeno pondělí–pátek 9:00–16:00.

### Zastavení 2: Pěchotní srub N-S 75 „Závoz"

První bunkrový objekt na trase, vzdálený 1 km od muzea. Externě prohlížitelný, **dva pancéřové zvony zachovány v originálním stavu**. Tabule vysvětluje princip křížové palby s navazujícím srubem.

### Zastavení 3: Hřbitov Padlých 1938

Pamětní místo věnované obětem **bojů při všeobecné mobilizaci 1938** — i když nedošlo k velké válce, regulační konflikty na hranici si vyžádaly oběti. Místo je **klidné a kontemplativní**, vhodné pro krátkou pauzu.

### Zastavení 4: Pozorovatelna „Skalka"

Přírodní vyhlídka cca 250 m. n. m. s panoramatickým výhledem do **Polska a Kladské kotliny**. Tabule vysvětluje strategický význam tohoto bodu — odtud pozorovatelé čs. armády hlídali německé pohyby v září 1938.

### Zastavení 5: Pěchotní srub N-S 76 „Skalka"

Sousední bunkrový objekt **integrovaný do scenérie skály** — dnes externě přístupný, vchod uzavřen. Tabule popisuje, jak byly objekty maskované krycími barvami a falešnými cestami.

### Zastavení 6: Tvrz Dobrošov — Vstupní srub

**Hlavní atrakce stezky.** Vstupní srub tvrze Dobrošov, otevřená muzejní expozice. Prohlídka s průvodcem trvá 90 minut. Bezpodmínečně **rezervujte předem** — o víkendech jsou termíny vyprodány týden dopředu.

→ Detail: [Dělostřelecká tvrz Dobrošov](/katalog/tvrz-dobrosov)

### Zastavení 7: Tvrz Dobrošov — Pěchotní srub č. 1

Externě navštívitelný součást tvrze — zde se ukazuje, jak vypadal nedokončený srub na konci roku 1938. Zachované jsou betonové stěny, ale bez pancéřového vybavení (zvony nebyly osazeny).

### Zastavení 8: Pěchotní srub č. 2

Druhý nedokončený srub tvrze. Zde tabule ukazuje **plán dostavby**, jak by měla tvrz vypadat do roku 1942 (kdyby k Mnichovu nedošlo).

### Zastavení 9: Polní opevnění z roku 1938

Doprovodné opevnění k tvrzi — **zákopy, drátěné zátarasy, kulometná hnízda**. Pamětní rekonstrukce z roku 2018 ukazuje, jak vypadalo polní opevnění mezi betonovými objekty.

### Zastavení 10: Lesní cesta „Kolejová"

Stará vojenská zásobovací trasa, dnes **lesní cesta vhodná pro pěší a kolo**. Tabule vysvětluje logistiku — jak se k tvrzi dopravovala munice a stavební materiál v letech 1937–1938.

### Zastavení 11: Pěchotní srub N-S 80 „Jirásek"

Závěrečný betonový objekt na trase. **Slavný izolovaný TO** chránící křižovatku silnic z Náchoda do Police nad Metují a do Trutnova. Externě prohlížitelný, vchod uzavřen.

### Zastavení 12: Návrat do Vojenského muzea

Závěrečná tabule, **shrnutí výletu** a doporučení dalších cílů (Hanička, Stachelberg, Bouda).

## Doporučený harmonogram

**Klasický jednodenní okruh (z Náchoda):**

- 9:00 — Sraz u Vojenského muzea
- 9:00–10:00 — Prohlídka muzea
- 10:00–12:00 — Stezka (zastavení 2–5)
- 12:00–14:00 — **Tvrz Dobrošov** s prohlídkou (rezervovat termín 11:30!)
- 14:00–14:30 — Oběd v restauraci u tvrze
- 14:30–17:00 — Pokračování stezky (zastavení 7–11)
- 17:00 — Návrat do Náchoda

## Co si vzít

- **Pevné turistické boty** — terén je místy hrubý
- **Teplé oblečení** — i v létě v tvrzi 9 °C
- **Pláštěnka** — Náchodsko je dešťová oblast
- **Svačina + voda** (1,5 l)
- **Mapa nebo GPX track** — zdarma na webu Vojenského muzea
- **Foťák** — povolen, blesk v tvrzi zakázán

## Doprava

- **Auto:** D11 → exit Hradec Králové → silnice 33 → Náchod (cca 1 h z Prahy)
- **Vlak:** Praha → Hradec Králové → Náchod (2 h)
- **MHD:** v Náchodě linka 1 do zastávky **Vojenská**
- **Parkování:** zdarma u Vojenského muzea (15 míst)

## Pro koho

**Vhodné:**
- pěší turisté všech věkových kategorií od 10 let
- rodiny s dětmi (zastavení mají i interaktivní prvky pro děti)
- školní výlety (Klub vojenské historie nabízí výklad ve spec. tarifu)
- fotografy (panoramatický výhled u zastavení 4)

**Méně vhodné:**
- vozíčkáři (terén nepřístupný)
- v zimním období (stezka je špatně značená pod sněhem)

## Související obsah

- [Dělostřelecká tvrz Dobrošov](/katalog/tvrz-dobrosov) — hlavní cíl
- [Tvrz Hanička](/katalog/tvrz-hanicka) — pokračování ve stejné oblasti (50 km severně)
- [Top 10 fortifikačních výletů](/clanky/top-10-fortifikacnich-vyletu) — kontext

**Praktická poznámka:** v letní sezóně doporučujeme **vyrážet brzy ráno** — tvrz Dobrošov je o víkendech přeplněná a parkoviště se zaplní do 10:00.
