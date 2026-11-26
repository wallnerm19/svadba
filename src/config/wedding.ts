import type { WeddingConfig } from '../types/wedding.ts';

/**
 * ============================================================
 *  CENTRÁLNA KONFIGURÁCIA SVADOBNEJ STRÁNKY
 * ============================================================
 *  Všetky texty, dátumy, miesta, fotografie a odkazy sa menia
 *  výhradne tu. Komponenty si údaje berú z tohto súboru.
 *
 *  • Obrázky patria do priečinka /public/images a uvádzajú sa
 *    bez úvodnej lomky, napr. "images/hero.jpg".
 *  • Časy sa zadávajú v miestnom čase svadby (pole date.timeZone).
 *  • Návod nájdete v README.md.
 * ============================================================
 */
export const wedding: WeddingConfig = {
  couple: {
    bride: 'Veronika',
    groom: 'Marek',
    separator: '&',
    order: 'bride-first',
  },

  date: {
    start: '2027-04-30T15:00',
    end: '2027-05-01T02:00',
    timeZone: 'Europe/Bratislava',
  },

  location: 'Bašta Pajštún · Borinka',

  seo: {
    title: 'Veronika & Marek · Svadba 30. apríla 2027',
    description:
      'Svadobné oznámenie Veroniky a Mareka. Všetko o našom veľkom dni – miesto, harmonogram, ubytovanie a potvrdenie účasti.',
    ogImage: 'og-image.png',
    siteUrl: '',
  },

  sections: {
    story: true,
    schedule: true,
    gallery: false,
    info: true,
    gifts: false,
    rsvp: true,
  },

  navigation: [
    { id: 'uvod', label: 'Úvod' },
    { id: 'o-nas', label: 'O nás' },
    { id: 'svadba', label: 'Svadba' },
    { id: 'harmonogram', label: 'Harmonogram' },
    { id: 'informacie', label: 'Informácie' },
    { id: 'rsvp', label: 'Potvrdenie účasti' },
  ],

  envelope: {
    enabled: true,
    eyebrow: 'Svadobné oznámenie',
    openLabel: 'Otvorte pozvánku',
    cardText: 'Srdečne vás pozývame',
  },

  hero: {
    eyebrow: 'Berieme sa!',
    headline: 'Pozývame vás na našu svadbu',
    quote: 'Najkrajšie príbehy sú tie, ktoré píšeme spolu.',
    image: {
      src: 'images/hero.svg',
      alt: 'Veronika a Marek pri západe slnka',
      width: 2400,
      height: 1600,
      focus: '50% 40%',
    },
  },

  countdown: {
    title: 'Do nášho veľkého dňa zostáva',
    afterTitle: 'Sme svoji!',
    afterMessage: 'Ďakujeme, že ste boli pri tom. Tento deň si budeme pamätať navždy.',
  },

  story: {
    eyebrow: 'O nás',
    title: 'Jedno áno už odznelo, teraz si ho povieme navzájom',
    text: 'Z priateľstva sa stala láska, z lásky spoločný príbeh a teraz nastal čas spečatiť ho sľubom na celý život.',
    image: {
      src: 'images/zasnuby.webp',
      alt: 'Veronika a Marek tesne po zásnubách – Veronika si od dojatia zakrýva ústa rukou so zásnubným prsteňom',
      width: 683,
      height: 911,
      focus: '50% 30%',
    },
    childhood: {
      caption: 'Tieto dve deti sa budú brať',
      image: {
        src: 'images/detstvo/spolu.webp',
        label: 'Veronika & Marek',
        alt: 'Čiernobiele detské fotky vedľa seba: vľavo sa smeje malá Veronika, vpravo sedí malý Marek s kockami stavebnice',
        width: 1600,
        height: 1000,
      },
    },
  },

  details: {
    eyebrow: 'Kedy a kde?',
    title: 'Svadobný deň',
    venue: {
      label: 'Obrad aj svadobná hostina sa budú konať na jednom mieste.',
      name: 'Bašta Pajštún',
      times: [
        { label: 'Svadobný obrad', time: '15:00' },
      ],
      address: '900 32 Borinka · GPS 48.27419, 17.070555',
      mapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=48.27419,17.070555',
      description: 'Hneď po obrade nasleduje slávnostná večera a program.',
      image: {
        src: 'images/ceremony.svg',
        alt: 'Bašta Pajštún – miesto obradu aj hostiny',
        width: 1400,
        height: 1000,
      },
    },
    calendar: {
      title: 'Uložte si dátum',
      eventTitle: 'Svadba Veroniky a Mareka',
      description: 'Pridajte si našu svadbu do kalendára, aby vám nič neušlo.',
      eventDescription:
        'Svadba Veroniky a Mareka. Obrad o 15:00 a hostina od 17:00 v Bašte Pajštún v Borinke. Viac informácií na našej svadobnej stránke.',
    },
    map: {
      enabled: true,
      title: 'Ako sa dostanem na svadobnú hostinu',
      description: 'Baštu Pajštún nájdete nad obcou Borinka, neďaleko hradu Pajštún.',
      lat: 48.27419,
      lng: 17.070555,
      zoom: 15,
    },
  },

  schedule: {
    eyebrow: 'Harmonogram',
    title: 'Priebeh dňa',
    intro: 'Aby ste vedeli, čo vás čaká. Kedy si pripraviť vreckovky a kedy tanečné topánky.',
    items: [
      { time: '14:00', title: 'Príchod hostí', description: 'Privítanie a ubytovanie hostí.', icon: 'arrival' },
      { time: '14:45', title: 'Usadenie hostí', description: 'Usadenie sa hostí na miesto konania obradu.', icon: 'heart' },
      { time: '15:00', title: 'Svadobný obrad', icon: 'rings' },
      { time: '15:30', title: 'Gratulácie a fotografovanie', icon: 'camera' },
      { time: '16:30', title: 'Rozbíjanie taniera', icon: 'sparkles' },
      {
        time: '17:00',
        title: 'Svadobná hostina',
        description: 'Oficiálne privítanie hostí, príhovory a slávnostná večera.',
        icon: 'dinner',
      },
      { time: '19:00', title: 'Prvý tanec novomanželov', description: 'A následná zábava.', icon: 'dance' },
      { time: '22:00', title: 'Krájanie svadobnej torty', icon: 'cake' },
      { time: '00:00', title: 'Čepčenie', icon: 'moon' },
      { time: '00:30', title: 'Voľná zábava', icon: 'music' },
    ],
  },

  rsvp: {
    eyebrow: 'Potvrdenie účasti',
    title: 'Prídete?',
    intro:
      'Budeme nesmierne radi, ak tento deň strávite s nami. Prosíme, dajte nám vedieť, či prídete – pomôže nám to so všetkými prípravami.',
    // Google formulár na potvrdenie účasti (odpovede sa ukladajú do Google Tabuľky).
    formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScVc9ZBYkGXMXj3pX1dQ09oZ2BY42nKmm2yQ62akptzHJ2oCw/viewform',
    deadline: '2027-03-31',
    instructions: [
      'Vyplňte krátky formulár – zaberie to menej ako dve minúty.',
      'Každý hosť alebo pár vyplní formulár iba raz.',
      'Uveďte, prosím, aj stravovacie obmedzenia či alergie.',
      'Ak sa vaše plány zmenia, napíšte nám alebo zavolajte.',
    ],
    buttonLabel: 'Potvrdiť účasť',
    embed: false,
    note: 'Formulár sa otvorí v novom okne (Google Forms).',
  },

  gallery: {
    eyebrow: 'Fotogaléria',
    title: 'Naše momenty',
    intro: 'Pár spomienok z našej spoločnej cesty.',
    // Fotky galérie boli odstránené (sekcia je vypnutá). Nájdete ich v histórii gitu, commit 9898f36.
    images: [],
  },

  info: {
    eyebrow: 'Užitočné informácie',
    title: 'Všetko, čo potrebujete vedieť',
    intro: 'Praktické rady, aby ste si náš deň mohli užiť naplno a bez starostí.',
    accommodation: {
      title: 'Ubytovanie',
      text: 'Ubytovať sa bude možné priamo na mieste, nemusíte sa tak po oslave už nikam presúvať. Prosíme všetkých hostí, ktorí majú záujem o ubytovanie priamo v mieste konania oslavy, aby to uviedli pri vypĺňaní dotazníka.',
    },
    cards: [
      {
        icon: 'parking',
        title: 'Parkovanie',
        paragraphs: ['Parkovať sa dá priamo na mieste konania svadby. Nemusíte mať preto obavy prísť autom.'],
      },
      {
        icon: 'bus',
        title: 'Doprava',
        paragraphs: [
          'Dopravu si hostia zabezpečujú sami. V areáli je možné bez problémov parkovať.',
          'Možnosťou je aj autobus SAD na zastávku Borinka a odtiaľ taxík do Bašty Pajštún.',
          'Ak potrebujete s dopravou poradiť, neváhajte sa na nás obrátiť.',
        ],
      },
      {
        icon: 'shirt',
        title: 'Dress code',
        paragraphs: [
          'Elegantne a slávnostne. Oblečte sa však predovšetkým tak, aby ste sa cítili dobre a mohli s nami tancovať až do rána.',
          'Ak by sme vás predsa mohli poprosiť, vyhnite sa bielym šatám a bielym oblekom.',
          'Koncom apríla býva večer chladnejšie, nezabudnite si preto pribaliť niečo teplé.',
        ],
      },
      {
        icon: 'gift',
        title: 'Dary',
        paragraphs: [
          'Najväčším darom pre nás je, že budete s nami.',
          'Ak by ste nás predsa len chceli niečím potešiť, domácnosť máme už zariadenú. Namiesto vecných darov nás poteší finančný príspevok, ktorý využijeme na spoločné zážitky.',
        ],
      },
    ],
    faqTitle: 'Časté otázky',
    faq: [
      {
        question: 'Do kedy mám potvrdiť účasť?',
        answer: 'Najneskôr do 31. marca 2027. Pomôže nám to s finálnym počtom hostí a menu.',
      },
      {
        question: 'Môžem fotiť počas obradu?',
        answer:
          'Počas obradu vás prosíme o „unplugged“ obrad – nechajte telefóny vo vrecku a užite si chvíľu s nami. Fotograf zachytí všetko podstatné a fotografie sa s vami radi podelíme.',
      },
      {
        question: 'Čo ak mám alergiu alebo špeciálnu diétu?',
        answer: 'Napíšte nám to do formulára. Kuchyňa pripraví vegetariánske, bezlepkové aj iné alternatívy.',
      },
      {
        question: 'Bude na mieste možnosť prespať?',
        answer: 'Áno – ubytovanie bude len na mieste, priamo v priestoroch Bašty Pajštún.',
      },
    ],
    contactsTitle: 'Kontakty',
    contacts: [
      { name: 'Veronika', role: 'Nevesta', phone: '+421 911 244 186', email: 'veronikazichova97@gmail.com' },
      { name: 'Marek', role: 'Ženích', phone: '+421 904 117 880', email: 'wallnerm19@gmail.com' },
    ],
  },

  gifts: {
    eyebrow: 'Svadobné dary',
    title: 'Váš úsmev je najkrajší dar',
    intro: 'Najväčším darom pre nás je, že budete s nami.',
    message:
      'Ak by ste nás predsa len chceli niečím potešiť, domácnosť máme už zariadenú. Radi by sme si však splnili sen o spoločnej ceste – každý príspevok nám pomôže vytvoriť spomienky na celý život.',
    options: [
      {
        icon: 'plane',
        title: 'Príspevok na svadobnú cestu',
      },
      {
        icon: 'gift',
        title: 'Finančný dar',
      },
      {
        icon: 'flower',
        title: 'Kvety netreba',
      },
    ],
    signature: 'S láskou, Veronika & Marek',
  },

  closing: {
    eyebrow: 'Tešíme sa na vás',
    title: 'Ďakujeme',
    message: 'Najväčšou radosťou pre nás bude, keď tento výnimočný deň oslávite spolu s nami.',
    image: {
      src: 'images/closing.svg',
      alt: 'Veronika a Marek kráčajú ruka v ruke pri západe slnka',
      width: 2400,
      height: 1600,
    },
  },

  footer: {
    note: 'Vytvorené s láskou pre našich najbližších.',
  },
};
