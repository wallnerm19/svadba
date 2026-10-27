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
    order: 'groom-first',
  },

  date: {
    start: '2027-04-30T15:00',
    end: '2027-05-01T02:00',
    timeZone: 'Europe/Bratislava',
  },

  location: 'Bašta Pajštún · Borinka',

  seo: {
    title: 'Marek & Veronika · Svadba 30. apríla 2027',
    description:
      'Svadobné oznámenie Mareka a Veroniky. Všetko o našom veľkom dni – miesto, harmonogram, ubytovanie a potvrdenie účasti.',
    ogImage: 'og-image.png',
    siteUrl: '',
  },

  sections: {
    story: true,
    schedule: true,
    gallery: true,
    info: true,
    gifts: true,
    rsvp: true,
  },

  navigation: [
    { id: 'uvod', label: 'Úvod' },
    { id: 'o-nas', label: 'O nás' },
    { id: 'svadba', label: 'Svadba' },
    { id: 'harmonogram', label: 'Harmonogram' },
    { id: 'informacie', label: 'Informácie' },
    { id: 'fotogaleria', label: 'Fotogaléria' },
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
      alt: 'Marek a Veronika pri západe slnka',
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
    title: 'Povedali sme áno',
    text: 'Spoznali sme sa na jeseň 2019 na firemnej akcii plnej ľudí – a v tom dave sme si našli práve jeden druhého. V lete 2026 prišla žiadosť o ruku a Veronika povedala „áno“ skôr, než Marek stihol dokončiť otázku. Teraz by sme radi, aby ste ten najkrajší deň oslávili s nami.',
    image: {
      src: 'images/zasnuby.webp',
      alt: 'Marek a Veronika tesne po zásnubách – Veronika si od dojatia zakrýva ústa rukou so zásnubným prsteňom',
      width: 683,
      height: 911,
      focus: '50% 30%',
    },
  },

  details: {
    eyebrow: 'Kedy a kde?',
    title: 'Svadobný deň',
    intro: 'Obrad aj oslava sa uskutočnia na jednom mieste – v Bašte Pajštún v Borinke.',
    venue: {
      label: 'Obrad a hostina',
      name: 'Bašta Pajštún',
      times: [
        { label: 'Svadobný obrad', time: '15:00' },
        { label: 'Svadobná hostina', time: '17:00' },
      ],
      address: '900 32 Borinka · GPS 48.27419, 17.070555',
      mapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=48.27419,17.070555',
      description:
        'Obrad sa uskutoční v areáli Bašty Pajštún (v prípade nepriaznivého počasia vo vnútri). Hneď potom nasleduje slávnostná večera, tanec a zábava až do skorých ranných hodín – bez presunov, na tom istom mieste.',
      image: {
        src: 'images/ceremony.svg',
        alt: 'Bašta Pajštún – miesto obradu aj hostiny',
        width: 1400,
        height: 1000,
      },
    },
    calendar: {
      title: 'Uložte si dátum',
      eventTitle: 'Svadba Mareka a Veroniky',
      description: 'Pridajte si našu svadbu do kalendára, aby vám nič neušlo.',
      eventDescription:
        'Svadba Mareka a Veroniky. Obrad o 15:00 a hostina od 17:00 v Bašte Pajštún v Borinke. Viac informácií na našej svadobnej stránke.',
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
    intro: 'Aby ste vedeli, čo vás čaká – a kedy si pripraviť vreckovky aj tanečné topánky.',
    items: [
      {
        time: '14:00',
        title: 'Príchod hostí',
        description: 'Privítanie s pohárom sektu v Bašte Pajštún.',
        icon: 'arrival',
      },
      { time: '15:00', title: 'Svadobný obrad', description: 'Chvíľa, na ktorú sme čakali.', icon: 'rings' },
      {
        time: '16:00',
        title: 'Gratulácie a fotografovanie',
        description: 'Spoločné fotografie so všetkými hosťami.',
        icon: 'camera',
      },
      {
        time: '17:00',
        title: 'Svadobná hostina',
        description: 'Slávnostná večera v Bašte Pajštún.',
        icon: 'dinner',
      },
      { time: '19:00', title: 'Prvý tanec', description: 'Prvý tanec novomanželov.', icon: 'dance' },
      { time: '20:00', title: 'Zábava', description: 'Živá hudba, DJ a tanec do rána.', icon: 'music' },
      {
        time: '00:00',
        title: 'Polnočné tradície',
        description: 'Čepčenie, redový tanec a polnočné prekvapenie.',
        icon: 'moon',
      },
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
    images: [
      {
        src: 'images/galeria/lanovka.webp',
        alt: 'Marek a Veronika v lyžiarskych prilbách a okuliaroch na sedačkovej lanovke',
        width: 563,
        height: 751,
        caption: 'Spolu aj na svahu',
      },
      {
        src: 'images/galeria/hokej.webp',
        alt: 'Marek a Veronika na hokejovom zápase, za nimi maskot orla',
        width: 683,
        height: 911,
        caption: 'Na hokeji s maskotom',
      },
      {
        src: 'images/galeria/chata.webp',
        alt: 'Marek v kostýme líšky a Veronika v kostýme opičky pred drevenou chatou na horách',
        width: 684,
        height: 911,
        caption: 'Líška a opička na chate',
      },
      {
        src: 'images/galeria/za-plotom.webp',
        alt: 'Marek a Veronika so smutnými grimasami za kovovým plotom',
        width: 684,
        height: 911,
        caption: 'Keď nás nikam nepustili',
      },
      {
        src: 'images/galeria/leto.webp',
        alt: 'Marek a Veronika popíjajú pod stromami letný drink',
        width: 683,
        height: 911,
        caption: 'Letné osvieženie',
      },
    ],
  },

  info: {
    eyebrow: 'Užitočné informácie',
    title: 'Všetko, čo potrebujete vedieť',
    intro: 'Praktické rady, aby ste si náš deň mohli užiť naplno a bez starostí.',
    accommodation: {
      title: 'Ubytovanie',
      text: 'Ubytovanie bude len na mieste – prespíme priamo v priestoroch Bašty Pajštún. Po oslave sa tak už nemusíte nikam presúvať.',
    },
    cards: [
      {
        icon: 'parking',
        title: 'Parkovanie',
        paragraphs: [
          'Bezplatné parkovanie je k dispozícii priamo pri Bašte Pajštún.',
          'Auto môžete pokojne nechať pri hostine cez noc a vyzdvihnúť si ho na druhý deň.',
        ],
      },
      {
        icon: 'bus',
        title: 'Doprava',
        paragraphs: [
          'Obrad aj hostina sú na jednom mieste, takže sa počas dňa nikam nepresúvame.',
          'Ubytovanie bude len na mieste – v priestoroch Bašty, takže po oslave už nikam necestujete.',
        ],
      },
      {
        icon: 'map',
        title: 'Ako sa k nám dostanete',
        paragraphs: [
          'Z Bratislavy po diaľnici D2 (výjazd Stupava) a ďalej cez Stupavu do Borinky – približne 25 minút.',
          'Vlakom do Stupavy, odkiaľ vás radi vyzdvihneme.',
          'Do navigácie zadajte GPS súradnice 48.27419, 17.070555 – alebo použite tlačidlo „Navigovať“ v sekcii Svadba.',
        ],
      },
      {
        icon: 'child',
        title: 'Deti',
        paragraphs: [
          'Deti sú srdečne vítané! Na hostine pre ne pripravíme detský kútik s animátorkou.',
          'Prosíme, uveďte počet a vek detí vo formulári, aby sme vedeli pripraviť detské menu.',
        ],
      },
    ],
    dressCode: {
      title: 'Dress code',
      description:
        'Elegantne a slávnostne – oblečte sa tak, aby ste sa cítili dobre a mohli tancovať až do rána. Koncom apríla býva večer chladnejšie, pribaľte si niečo teplé.',
    },
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
      { name: 'Zuzana Kováčová', role: 'Svedkyňa', phone: '+421 900 111 222', email: 'zuzana@example.com' },
      { name: 'Tomáš Horváth', role: 'Svedok', phone: '+421 900 333 444', email: 'tomas@example.com' },
      { name: 'Marek & Veronika', role: 'Ženích a nevesta', email: 'svadba@example.com' },
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
    signature: 'S láskou, Marek & Veronika',
  },

  closing: {
    eyebrow: 'Tešíme sa na vás',
    title: 'Ďakujeme',
    message: 'Najväčšou radosťou pre nás bude, keď tento výnimočný deň oslávite spolu s nami.',
    image: {
      src: 'images/closing.svg',
      alt: 'Marek a Veronika kráčajú ruka v ruke pri západe slnka',
      width: 2400,
      height: 1600,
    },
  },

  footer: {
    note: 'Vytvorené s láskou pre našich najbližších.',
  },
};
