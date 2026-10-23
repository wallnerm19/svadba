# Svadobná stránka – Marek & Veronika

Elegantná svadobná stránka (digitálne oznámenie a informačný portál pre hostí), ktorú je možné **zadarmo** zverejniť na GitHub Pages. Nepotrebuje server, databázu ani platený hosting.

**Technológie:** React · TypeScript · Vite · Tailwind CSS · Motion · Lucide ikony

Sekcie stránky: Úvod s odpočtom · Náš príbeh · Kedy a kde (+ pridanie do kalendára) · Harmonogram · Fotogaléria · Užitočné informácie · Svadobné dary · Potvrdenie účasti (Google Forms) · Záver.

---

## Obsah

1. [Lokálny vývoj](#1-lokálny-vývoj)
2. [Úprava stránky pre vašu svadbu](#2-úprava-stránky-pre-vašu-svadbu)
3. [Nastavenie RSVP cez Google Forms](#3-nastavenie-rsvp-cez-google-forms)
4. [Zverejnenie na GitHub Pages](#4-zverejnenie-na-github-pages)
5. [Údržba a aktualizácie](#5-údržba-a-aktualizácie)
6. [Súkromie a bezpečnosť](#6-súkromie-a-bezpečnosť)
7. [Štruktúra projektu](#7-štruktúra-projektu)

---

## 1. Lokálny vývoj

### Potrebný softvér

| Nástroj | Verzia | Na čo |
| --- | --- | --- |
| [Node.js](https://nodejs.org/) | 22 alebo novší (odporúčané 24 LTS) | spúšťanie a zostavenie stránky |
| [Git](https://git-scm.com/) | ľubovoľná aktuálna | správa verzií |
| [GitHub CLI](https://cli.github.com/) (`gh`) | voliteľné | pohodlné vytvorenie repozitára |

### Inštalácia

```bash
npm install
```

### Spustenie na počítači

```bash
npm run dev
```

Stránka sa otvorí na adrese **http://localhost:5173/svadba/**. Zmeny v kóde alebo v konfigurácii sa prejavia okamžite.

### Produkčné zostavenie

```bash
npm run build
```

Hotová stránka sa vytvorí v priečinku `dist/`. Na kontrolu zostavenej verzie (presne tak, ako pobeží na GitHub Pages):

```bash
npm run preview
```

a otvorte **http://localhost:4173/svadba/**.

---

## 2. Úprava stránky pre vašu svadbu

**Všetok obsah sa mení na jednom mieste: [`src/config/wedding.ts`](src/config/wedding.ts).** Komponenty neobsahujú žiadne svadobné údaje natvrdo. Súbor je typovo kontrolovaný – ak zabudnete povinný údaj alebo urobíte preklep v názve poľa, `npm run build` vás upozorní.

### Mená

```ts
couple: { bride: 'Veronika', groom: 'Marek', separator: '&', order: 'groom-first' },
```

Nezabudnite upraviť aj `seo.title` a `seo.description` (názov v záložke prehliadača a pri zdieľaní) a `details.calendar.eventTitle` (v správnom páde, napr. „Svadba Mareka a Veroniky“). Pole `order` určuje poradie mien na stránke (`'groom-first'` = Marek & Veronika, `'bride-first'` = Veronika & Marek).

### Dátum a čas

```ts
date: {
  start: '2027-04-30T15:00',   // začiatok obradu – do tohto okamihu beží odpočet
  end:   '2027-05-01T02:00',   // koniec osláv (pre kalendár)
  timeZone: 'Europe/Bratislava',
},
```

Časy sa zadávajú v **miestnom čase svadby**. Odpočet aj kalendár ich správne prepočítajú pre hostí v ľubovoľnom časovom pásme (vrátane letného času). Po začiatku svadby sa odpočet automaticky nahradí textom z `countdown.afterTitle` a `countdown.afterMessage`.

### Miesta obradu a hostiny

V `details.ceremony` a `details.reception` zmeňte `name`, `time`, `address` a `description`. Tlačidlo **Navigovať** automaticky otvorí Google Maps s navigáciou na zadanú adresu. Ak chcete presný bod (napr. konkrétny vchod), vložte vlastný odkaz do `mapsUrl`:

1. Otvorte miesto v [Google Maps](https://maps.google.com) → **Zdieľať** → **Kopírovať odkaz**.
2. Vložte ho: `mapsUrl: 'https://maps.app.goo.gl/…'`.

### Harmonogram

Pole `schedule.items` – každá položka má `time`, `title`, voliteľný `description` a `icon`. Dostupné ikony: `arrival`, `rings`, `camera`, `dinner`, `dance`, `music`, `cake`, `moon`, `heart`, `champagne`, `gift`, `plane`, `home`, `car`, `bus`, `parking`, `shirt`, `child`, `phone`, `mail`, `sparkles`, `map`, `coffee`, `flower` (definované v [`src/components/ui/Icon.tsx`](src/components/ui/Icon.tsx)).

### Fotografie

Momentálne sú na stránke **ilustračné obrázky** (`public/images/*.svg`). Nahradenie vlastnými fotkami:

1. Skopírujte fotografie do `public/images/` (napr. `hero.jpg`, `story-1.jpg`, `gallery-01.jpg`…).
2. V `wedding.ts` zmeňte `src` (napr. `'images/hero.jpg'`), `alt` (popis fotky) a `width` / `height` (skutočné rozmery v pixeloch).
3. Voliteľne `focus: '50% 30%'` určí, ktorá časť fotky zostane viditeľná pri orezaní (napr. tváre).

**Odporúčania pre rýchle načítanie:**

| Použitie | Odporúčaná šírka | Formát |
| --- | --- | --- |
| Úvodná a záverečná fotka (`hero`, `closing`) | 2000–2400 px | JPG/WebP, kvalita ~80 % |
| Príbeh, miesta | 1200–1400 px | JPG/WebP |
| Galéria | 1400–1600 px (dlhšia strana) | JPG/WebP |
| Náhľad na sociálnych sieťach (`public/og-image.png`) | 1200 × 630 px | JPG/PNG |

Fotky zmenšíte zadarmo napr. cez [Squoosh](https://squoosh.app/). Galéria sa načítava postupne (lazy loading), takže aj väčší počet fotiek stránku nespomalí. Ilustračné SVG súbory, ktoré už nepoužívate, môžete zmazať.

### Príbeh, informácie, dary, kontakty

Všetko sú bežné texty v `wedding.ts`: `story`, `info.accommodation`, `info.cards`, `info.dressCode`, `info.faq`, `info.contacts`, `gifts`, `closing`.

### Skrytie voliteľných sekcií

```ts
sections: {
  story: true,
  storyTimeline: true,   // časová os míľnikov v sekcii Náš príbeh
  schedule: true,
  gallery: true,
  info: true,
  gifts: false,          // ← sekcia Svadobné dary sa nezobrazí
  rsvp: true,
},
```

Skryté sekcie sa automaticky odstránia aj z navigácie. Poradie a názvy položiek menu upravíte v poli `navigation`.

### Farby a písma

Stránka používa **tmavú šalviovú zelenú** so svetlým textom a šampanskými akcentmi (rovnako ako sekcia RSVP). Farby sú v [`src/index.css`](src/index.css):

- trieda **`.theme-sage`** – farby obsahových sekcií (Príbeh, Svadba, Harmonogram, Galéria, Informácie, Dary), navigácie a mobilného menu:

  ```css
  --color-ivory: #56654c;      /* plocha sekcií a kariet */
  --color-cream: #4c5a43;      /* tmavší odtieň pre striedanie sekcií */
  --color-ink: #fbf8f2;        /* hlavný (svetlý) text */
  --color-ink-soft: #e0e3d8;   /* vedľajší text */
  --color-gold-deep: #ecdfc9;  /* šampanské nadpisy a akcenty */
  ```

- blok **`@theme`** – základné farby (sekcia RSVP `--color-sage-dark`, text na fotografiách, galéria).

Ak by ste sa chceli vrátiť k svetlej (slonovinovej) verzii, stačí odstrániť triedu `theme-sage` z jednotlivých sekcií.

Písma sú uložené priamo v projekte (bez Google Fonts – rýchlejšie a bez sledovania hostí):

- nadpisy: **Cormorant Garamond**
- text: **Manrope**

Iné písmo nainštalujete z [Fontsource](https://fontsource.org/), napr. `npm install @fontsource-variable/playfair-display`, importujete ho v [`src/main.tsx`](src/main.tsx) a zmeníte `--font-serif` v `index.css`.

---

## 3. Nastavenie RSVP cez Google Forms

Stránka je statická, preto odpovede hostí zbiera **Google Forms** a ukladá ich do **Google Sheets**. Na stránke je tlačidlo, ktoré formulár otvorí.

### Vytvorenie formulára

1. Otvorte [forms.google.com](https://forms.google.com) → **Prázdny formulár**.
2. Názov: napr. „Potvrdenie účasti – Marek & Veronika“.
3. Pridajte otázky:

   | Otázka | Typ | Povinná |
   | --- | --- | --- |
   | Meno | Krátka odpoveď | áno |
   | Priezvisko | Krátka odpoveď | áno |
   | Prídete na našu svadbu? (Áno, rád/a prídem / Žiaľ, nemôžem prísť) | Výber z možností | áno |
   | Počet osôb (vrátane vás) | Rozbaľovací zoznam 1–5 | nie |
   | Počet a vek detí | Krátka odpoveď | nie |
   | Stravovacie obmedzenia alebo alergie | Odsek | nie |
   | Odkaz pre nás | Odsek | nie |

   Tip: pri otázke o účasti cez **⋮ → Prejsť na sekciu podľa odpovede** môžete hosťov, ktorí neprídu, poslať rovno na koniec formulára.
4. **Nastavenia** → vypnite „Obmedziť na používateľov…“ / „Vyžadovať prihlásenie“, aby formulár mohli vyplniť aj hostia bez Google účtu.
5. Kliknite **Odoslať** → ikona odkazu 🔗 → **Kopírovať**.
6. Odkaz vložte do `wedding.ts`:

   ```ts
   rsvp: {
     formUrl: 'https://docs.google.com/forms/d/e/1FAIpQL…/viewform',
     deadline: '2027-03-31',
     …
   }
   ```

7. Voliteľne `embed: true` zobrazí formulár aj priamo na stránke pod tlačidlom.

### Prepojenie s Google Sheets

1. Vo formulári otvorte záložku **Odpovede**.
2. Kliknite **Prepojiť s Tabuľkami** → **Vytvoriť novú tabuľku**.
3. Každá nová odpoveď sa automaticky objaví ako nový riadok. V Tabuľkách si môžete pridať filtre, súčty hostí (`=SUMIF(…)`) či zoznam alergií pre catering.
4. Upozornenia na nové odpovede: **Odpovede → ⋮ → Dostávať e-mailové upozornenia na nové odpovede**.

---

## 4. Zverejnenie na GitHub Pages

Výsledná adresa bude **`https://VASE-POUZIVATELSKE-MENO.github.io/svadba/`**.

### 4.1 Prihlásenie cez GitHub CLI

Nainštalujte [GitHub CLI](https://cli.github.com/) (Windows: `winget install --id GitHub.cli`), potom:

```bash
gh auth login
```

Zvoľte **GitHub.com → HTTPS → Login with a web browser**.

### 4.2 Vytvorenie repozitára a nahratie projektu

V priečinku projektu:

```bash
git init -b main
git add .
git commit -m "Svadobná stránka"
gh repo create svadba --public --source=. --remote=origin --push
```

> GitHub Pages je na bezplatnom účte dostupné len pre **verejné** repozitáre. Bez `gh` vytvorte repozitár `svadba` na [github.com/new](https://github.com/new) a potom:
> `git remote add origin https://github.com/VASE-MENO/svadba.git` a `git push -u origin main`.

### 4.3 Zapnutie GitHub Pages

Cez príkazový riadok:

```bash
gh api -X POST repos/{owner}/svadba/pages -f build_type=workflow
```

alebo ručne: **Repozitár → Settings → Pages → Build and deployment → Source: GitHub Actions**.

### 4.4 Prvé nasadenie

Nasadenie sa spustí automaticky pri každom pushi do `main`. Ak ste Pages zapli až po prvom pushi, spustite ho ručne:

```bash
gh workflow run deploy.yml
gh run watch
```

alebo v záložke **Actions → Nasadenie na GitHub Pages → Run workflow**.

### 4.5 Ako funguje automatické nasadenie

Súbor [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) pri každom pushi do `main`:

1. stiahne kód, nainštaluje Node.js a závislosti (`npm ci`),
2. zistí správnu základnú cestu (napr. `/svadba/`) – funguje to aj po premenovaní repozitára alebo s vlastnou doménou,
3. zostaví stránku (`npm run build`),
4. nahrá priečinok `dist` a zverejní ho na GitHub Pages.

Stav nasadenia uvidíte v záložke **Actions**; adresa stránky je v **Settings → Pages**.

---

## 5. Údržba a aktualizácie

1. Upravte `src/config/wedding.ts` (alebo fotky v `public/images/`).
2. Skontrolujte lokálne: `npm run dev`.
3. Zverejnite:

   ```bash
   git add .
   git commit -m "Aktualizácia harmonogramu"
   git push
   ```

O 1–2 minúty je nová verzia online. Ak sa zmena hneď nezobrazí, obnovte stránku (Ctrl + F5).

---

## 6. Súkromie a bezpečnosť

- **Stránka na GitHub Pages je verejná.** Ktokoľvek, kto pozná adresu, ju môže otvoriť. Zdrojový kód (vrátane `wedding.ts`) je vo verejnom repozitári viditeľný tiež.
- Heslo v JavaScripte na statickej stránke **nič nezabezpečí** – obsah sa dá vždy prečítať zo zdrojového kódu. Preto na stránku nedávajte citlivé údaje (rodné čísla, presné adresy bydliska, čísla účtov, ak ich nechcete zverejniť).
- Stránka obsahuje `<meta name="robots" content="noindex, nofollow">`, takže ju vyhľadávače nebudú zobrazovať vo výsledkoch. Ak chcete, aby sa dala nájsť cez Google, odstráňte tento riadok z `index.html`.
- Do repozitára nikdy neukladajte heslá ani API kľúče. Súbor `.gitignore` vylučuje `node_modules`, `dist` a súbory `.env`.
- Odpovede hostí sú uložené vo vašom Google účte (Forms/Sheets), nie na stránke.

---

## 7. Štruktúra projektu

```
├── .github/workflows/deploy.yml   automatické nasadenie na GitHub Pages
├── public/                        statické súbory (fotky, favicon, náhľad na zdieľanie)
│   └── images/
├── src/
│   ├── config/wedding.ts          ★ všetok obsah svadby
│   ├── types/wedding.ts           typy konfigurácie
│   ├── components/
│   │   ├── layout/                navigácia, pätička
│   │   ├── sections/              jednotlivé sekcie stránky
│   │   ├── ui/                    tlačidlá, nadpisy, animácie, obrázky
│   │   ├── Countdown.tsx          odpočet
│   │   ├── Lightbox.tsx           celoobrazovková galéria
│   │   ├── Accordion.tsx          časté otázky
│   │   └── AddToCalendar.tsx      Google Kalendár + .ics
│   ├── hooks/                     odpočet, aktívna sekcia v menu
│   ├── lib/                       dátumy a časové pásma, kalendár, odkazy
│   ├── index.css                  dizajnový systém (farby, písma)
│   └── main.tsx
├── index.html                     SEO a Open Graph (dopĺňa sa z wedding.ts)
└── vite.config.ts                 základná cesta /svadba/ pre GitHub Pages
```

### Prístupnosť a výkon

- ovládanie klávesnicou (menu, galéria – šípky a Esc, akordeón), viditeľný fokus, odkaz „Preskočiť na obsah“,
- rešpektuje systémové nastavenie **obmedziť pohyb** (animácie a paralaxa sa vypnú),
- obrázky s popismi (`alt`), pevnými rozmermi a postupným načítaním,
- písma sú súčasťou stránky, stránka nepoužíva žiadne sledovacie skripty.
