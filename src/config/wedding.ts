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
    bride: 'Michaela',
    groom: 'Martin',
    separator: '&',
  },

  date: {
    start: '2027-06-20T15:00',
    end: '2027-06-21T02:00',
    timeZone: 'Europe/Bratislava',
  },

  location: 'Modra · Malé Karpaty',

  seo: {
    title: 'Michaela & Martin · Svadba 20. júna 2027',
    description:
      'Svadobné oznámenie Michaely a Martina. Všetko o našom veľkom dni – miesto, harmonogram, ubytovanie a potvrdenie účasti.',
    ogImage: 'og-image.png',
    siteUrl: '',
  },

  sections: {
    story: true,
    storyTimeline: true,
    schedule: true,
    gallery: true,
    info: true,
    gifts: true,
    rsvp: true,
  },

  navigation: [
    { id: 'uvod', label: 'Úvod' },
    { id: 'nas-pribeh', label: 'Náš príbeh' },
    { id: 'svadba', label: 'Svadba' },
    { id: 'harmonogram', label: 'Harmonogram' },
    { id: 'fotogaleria', label: 'Fotogaléria' },
    { id: 'informacie', label: 'Informácie' },
    { id: 'rsvp', label: 'RSVP' },
  ],

  hero: {
    eyebrow: 'Berieme sa!',
    headline: 'Pozývame vás na našu svadbu',
    quote: 'Najkrajšie príbehy sú tie, ktoré píšeme spolu.',
    image: {
      src: 'images/hero.svg',
      alt: 'Michaela a Martin pri západe slnka vo vinohrade',
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
    eyebrow: 'Náš príbeh',
    title: 'Ako sa to všetko začalo',
    intro:
      'Niektoré stretnutia sa nedajú naplánovať. Ten náš sa začal celkom obyčajne – a odvtedy je každý deň trochu výnimočnejší.',
    chapters: [
      {
        eyebrow: 'Jeseň 2019',
        title: 'Prvé stretnutie',
        paragraphs: [
          'Spoznali sme sa na svadbe spoločných priateľov. Martin sedel pri vedľajšom stole a celý večer sa nevedel odhodlať prísť sa predstaviť.',
          'Keď napokon hudba zahrala pomalú pieseň, vyzval Michaelu do tanca. Nikto z nás vtedy netušil, že jedného dňa budeme pozývať na vlastnú svadbu.',
        ],
        image: {
          src: 'images/story-1.svg',
          alt: 'Michaela a Martin pri prvom spoločnom tanci',
          width: 1200,
          height: 1500,
        },
      },
      {
        eyebrow: '2020 – 2026',
        title: 'Spoločná cesta',
        paragraphs: [
          'Nasledovali dlhé prechádzky po Malých Karpatoch, nedeľné raňajky, prvý spoločný byt a pes Bruno, ktorý si nás oboch okamžite omotal okolo labky.',
          'Precestovali sme kus sveta, no najradšej sa vždy vraciame domov – k sebe.',
        ],
        image: {
          src: 'images/story-2.svg',
          alt: 'Michaela a Martin na turistike v Malých Karpatoch',
          width: 1200,
          height: 1500,
        },
      },
      {
        eyebrow: 'Leto 2026',
        title: 'Žiadosť o ruku',
        paragraphs: [
          'Na mieste, kde sme sa prvýkrát pobozkali, pri západe slnka nad vinohradmi, si Martin kľakol na jedno koleno.',
          'Michaela povedala „áno“ skôr, než stihol dokončiť otázku. A teraz by sme radi, aby ste ten najkrajší deň oslávili s nami.',
        ],
        image: {
          src: 'images/story-3.svg',
          alt: 'Zásnubný prsteň pri západe slnka',
          width: 1200,
          height: 1500,
        },
      },
    ],
    timelineTitle: 'Naše míľniky',
    timeline: [
      { date: 'Október 2019', title: 'Prvý tanec', description: 'Svadba Lucie a Petra v Trnave' },
      { date: 'Máj 2020', title: 'Prvé rande', description: 'Piknik nad Modrou' },
      { date: 'September 2022', title: 'Spoločný domov', description: 'Prvý byt a prvé vlastné kvety' },
      { date: 'Marec 2024', title: 'Prišiel Bruno', description: 'Najlepší pes na svete' },
      { date: 'August 2026', title: 'Zásnuby', description: 'Pri západe slnka vo vinohrade' },
      { date: 'Jún 2027', title: 'Svadba', description: 'A príbeh pokračuje…' },
    ],
  },

  details: {
    eyebrow: 'Kedy a kde?',
    title: 'Svadobný deň',
    intro: 'Obrad aj oslava sa uskutočnia v malebnom prostredí Malých Karpát, len pár minút od seba.',
    ceremony: {
      label: 'Svadobný obrad',
      name: 'Kaštieľ Lipová alej',
      time: '15:00',
      address: 'Lipová 12, 900 01 Modra',
      description: 'Obrad sa uskutoční v zámockej záhrade. V prípade nepriaznivého počasia vo veľkej sále kaštieľa.',
      image: {
        src: 'images/ceremony.svg',
        alt: 'Zámocká záhrada kaštieľa s kamenným oblúkom',
        width: 1400,
        height: 1000,
      },
    },
    reception: {
      label: 'Svadobná hostina',
      name: 'Vinársky dvor Stará Hora',
      time: '17:00',
      address: 'Vinohradnícka 45, 900 01 Modra',
      description: 'Večera, tanec a zábava až do skorých ranných hodín na terase s výhľadom na vinohrady.',
      image: {
        src: 'images/reception.svg',
        alt: 'Terasa vinárskeho dvora s výhľadom na vinohrady',
        width: 1400,
        height: 1000,
      },
    },
    calendar: {
      title: 'Uložte si dátum',
      eventTitle: 'Svadba Michaely a Martina',
      description: 'Pridajte si našu svadbu do kalendára, aby vám nič neušlo.',
      eventDescription:
        'Svadba Michaely a Martina. Obrad o 15:00 v Kaštieli Lipová alej, hostina od 17:00 vo Vinárskom dvore Stará Hora. Viac informácií na našej svadobnej stránke.',
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
        description: 'Privítanie s pohárom sektu v zámockej záhrade.',
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
        description: 'Presun do Vinárskeho dvora a slávnostná večera.',
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
    // ⚠️ Nahraďte odkazom na váš Google formulár (pozri README → „Nastavenie RSVP“).
    formUrl: 'https://docs.google.com/forms/d/e/VLOZTE-ID-FORMULARA/viewform',
    deadline: '2027-04-30',
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
        src: 'images/gallery-01.svg',
        alt: 'Prechádzka v jesennom parku',
        width: 1200,
        height: 1600,
        caption: 'Prvá spoločná jeseň',
      },
      {
        src: 'images/gallery-02.svg',
        alt: 'Výhľad z vrcholu Vysokej',
        width: 1600,
        height: 1100,
        caption: 'Malé Karpaty',
      },
      {
        src: 'images/gallery-03.svg',
        alt: 'Michaela pod kamenným oblúkom',
        width: 1200,
        height: 1500,
        caption: 'Toskánsko, 2023',
      },
      { src: 'images/gallery-04.svg', alt: 'Detail zásnubných prsteňov', width: 1200, height: 1200, caption: 'Áno!' },
      { src: 'images/gallery-05.svg', alt: 'Martin s psom Brunom v lese', width: 1200, height: 1700, caption: 'Bruno' },
      {
        src: 'images/gallery-06.svg',
        alt: 'Západ slnka pri mori',
        width: 1600,
        height: 1100,
        caption: 'Chorvátsko, 2024',
      },
      { src: 'images/gallery-07.svg', alt: 'Piknik na lúke', width: 1200, height: 1600, caption: 'Nedeľný piknik' },
      {
        src: 'images/gallery-08.svg',
        alt: 'Kytica poľných kvetov',
        width: 1200,
        height: 1500,
        caption: 'Kvety z lúky',
      },
      {
        src: 'images/gallery-09.svg',
        alt: 'Večerné svetlá nad vinohradom',
        width: 1600,
        height: 1100,
        caption: 'Večer v Modre',
      },
      {
        src: 'images/gallery-10.svg',
        alt: 'Michaela a Martin v starom meste',
        width: 1200,
        height: 1600,
        caption: 'Spolu',
      },
    ],
  },

  info: {
    eyebrow: 'Užitočné informácie',
    title: 'Všetko, čo potrebujete vedieť',
    intro: 'Praktické rady, aby ste si náš deň mohli užiť naplno a bez starostí.',
    accommodation: {
      title: 'Ubytovanie',
      intro:
        'Pre hostí, ktorí prichádzajú z diaľky, sme predbežne rezervovali izby. Pri rezervácii uveďte heslo „Svadba M&M“.',
      places: [
        {
          name: 'Hotel Majolika',
          address: 'Štúrova 54, 900 01 Modra',
          distance: '5 min autom od miesta hostiny',
          description: 'Útulný hotel v centre mesta s raňajkami.',
          bookingUrl: 'https://www.booking.com/',
          phone: '+421 900 123 456',
        },
        {
          name: 'Penzión Vinohrad',
          address: 'Dolná 8, 900 01 Modra',
          distance: '3 min pešo od Vinárskeho dvora',
          description: 'Rodinný penzión priamo medzi vinohradmi.',
          bookingUrl: 'https://www.booking.com/',
        },
        {
          name: 'Apartmány Harmónia',
          address: 'Harmónia 3, 900 01 Modra – Harmónia',
          distance: '10 min autom',
          description: 'Apartmány v lese – ideálne pre rodiny s deťmi.',
          bookingUrl: 'https://www.booking.com/',
        },
      ],
      note: 'Izby sú pre vás držané do 31. marca 2027. Potom ich hotel uvoľní do bežného predaja.',
    },
    cards: [
      {
        icon: 'parking',
        title: 'Parkovanie',
        paragraphs: [
          'Bezplatné parkovanie je k dispozícii priamo pri kaštieli aj pri Vinárskom dvore.',
          'Auto môžete pokojne nechať pri hostine cez noc a vyzdvihnúť si ho na druhý deň.',
        ],
      },
      {
        icon: 'bus',
        title: 'Doprava',
        paragraphs: [
          'Medzi obradom a hostinou zabezpečíme kyvadlovú dopravu mikrobusom.',
          'Po polnoci budú pre hostí v hoteloch pripravené odvozy – stačí sa ozvať svedkom.',
        ],
      },
      {
        icon: 'map',
        title: 'Ako sa k nám dostanete',
        paragraphs: [
          'Z Bratislavy po ceste I/502 cez Pezinok približne 35 minút.',
          'Vlakom do stanice Šenkvice, odkiaľ vás radi vyzdvihneme.',
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
        'Elegantne a letne. Pánom odporúčame oblek (kravata nie je povinná), dámam šaty v jemných pastelových či zemitých tónoch. Obrad bude na tráve – zvážte pohodlnejšie podpätky.',
      palette: [
        { name: 'Šampanská', hex: '#E8D9BF' },
        { name: 'Šalviová', hex: '#A3AF94' },
        { name: 'Púdrová', hex: '#E5CFC3' },
        { name: 'Piesková', hex: '#D4BFA0' },
        { name: 'Olivová', hex: '#6F7A5B' },
      ],
    },
    faqTitle: 'Časté otázky',
    faq: [
      {
        question: 'Môžem prísť so sprievodom?',
        answer:
          'Ak je vo vašom pozvaní uvedené „s partnerom/partnerkou“, určite áno. Počet osôb, prosím, uveďte vo formulári na potvrdenie účasti.',
      },
      {
        question: 'Do kedy mám potvrdiť účasť?',
        answer: 'Najneskôr do 30. apríla 2027. Pomôže nám to s finálnym počtom hostí a menu.',
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
        answer: 'Áno, v okolí sme rezervovali niekoľko ubytovaní – pozrite si časť Ubytovanie vyššie.',
      },
    ],
    contactsTitle: 'Kontakty',
    contacts: [
      { name: 'Zuzana Kováčová', role: 'Svedkyňa', phone: '+421 900 111 222', email: 'zuzana@example.com' },
      { name: 'Tomáš Horváth', role: 'Svedok', phone: '+421 900 333 444', email: 'tomas@example.com' },
      { name: 'Michaela & Martin', role: 'Nevesta a ženích', email: 'svadba@example.com' },
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
        description: 'Snívame o Japonsku – o čajových záhradách, horách a dobrom jedle.',
      },
      {
        icon: 'gift',
        title: 'Finančný dar',
        description: 'Diskrétne v obálke – na svadbe pre ňu bude pripravená krabička.',
      },
      {
        icon: 'flower',
        title: 'Kvety netreba',
        description: 'Namiesto kytice nás poteší vaše milé slovo alebo kniha s venovaním.',
      },
    ],
    signature: 'S láskou, Michaela & Martin',
  },

  closing: {
    eyebrow: 'Tešíme sa na vás',
    title: 'Ďakujeme',
    message: 'Najväčšou radosťou pre nás bude, keď tento výnimočný deň oslávite spolu s nami.',
    image: {
      src: 'images/closing.svg',
      alt: 'Michaela a Martin kráčajú ruka v ruke pri západe slnka',
      width: 2400,
      height: 1600,
    },
  },

  footer: {
    note: 'Vytvorené s láskou pre našich najbližších.',
  },
};
