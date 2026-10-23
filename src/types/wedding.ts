/**
 * Typy pre centrálnu konfiguráciu svadobnej stránky (src/config/wedding.ts).
 * Vďaka nim TypeScript upozorní na chýbajúce alebo zle zadané údaje.
 */

/** Identifikátory sekcií – používajú sa ako HTML kotvy (#nas-pribeh …). */
export type SectionId =
  'uvod' | 'nas-pribeh' | 'svadba' | 'harmonogram' | 'fotogaleria' | 'informacie' | 'dary' | 'rsvp';

/** Názvy ikon, ktoré je možné použiť v konfigurácii (mapované na Lucide ikony). */
export type IconName =
  | 'arrival'
  | 'rings'
  | 'camera'
  | 'dinner'
  | 'dance'
  | 'music'
  | 'cake'
  | 'moon'
  | 'heart'
  | 'champagne'
  | 'gift'
  | 'plane'
  | 'home'
  | 'car'
  | 'bus'
  | 'parking'
  | 'shirt'
  | 'child'
  | 'phone'
  | 'mail'
  | 'sparkles'
  | 'map'
  | 'coffee'
  | 'flower';

export interface ImageAsset {
  /** Cesta k obrázku v priečinku /public, napr. "images/hero.jpg" (bez úvodnej lomky). */
  src: string;
  /** Popis obrázka pre čítačky obrazovky a vyhľadávače. */
  alt: string;
  /** Rozmery v pixeloch – zabraňujú „poskakovaniu“ stránky pri načítaní. */
  width?: number;
  height?: number;
  /** Zaostrenie výrezu (CSS object-position), napr. "50% 30%". */
  focus?: string;
}

export interface Venue {
  /** Krátky nadpis karty, napr. „Svadobný obrad“. */
  label: string;
  name: string;
  /** Čas začiatku vo formáte HH:MM (miestny čas svadby). */
  time: string;
  address: string;
  description?: string;
  /** Vlastný odkaz na Google Maps. Ak chýba, vytvorí sa automaticky z adresy. */
  mapsUrl?: string;
  image?: ImageAsset;
}

export interface StoryChapter {
  /** Malý nadpis nad kapitolou, napr. rok alebo „Prvé stretnutie“. */
  eyebrow: string;
  title: string;
  paragraphs: string[];
  image: ImageAsset;
}

export interface Milestone {
  date: string;
  title: string;
  description?: string;
}

export interface ScheduleItem {
  /** Čas vo formáte HH:MM. */
  time: string;
  title: string;
  description?: string;
  icon: IconName;
}

export interface GalleryImage extends ImageAsset {
  caption?: string;
}

export interface Accommodation {
  name: string;
  address: string;
  description?: string;
  distance?: string;
  bookingUrl?: string;
  phone?: string;
}

export interface InfoCard {
  icon: IconName;
  title: string;
  paragraphs: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Contact {
  name: string;
  role: string;
  phone?: string;
  email?: string;
}

export interface GiftOption {
  icon: IconName;
  title: string;
  description: string;
}

export interface SectionHeading {
  eyebrow: string;
  title: string;
  intro?: string;
}

export interface WeddingConfig {
  couple: {
    bride: string;
    groom: string;
    /** Spojka medzi menami – zvyčajne „&“. */
    separator: string;
    /** Poradie mien na stránke: 'bride-first' (nevesta & ženích) alebo 'groom-first' (ženích & nevesta). */
    order: 'bride-first' | 'groom-first';
  };

  date: {
    /** Začiatok svadby v miestnom čase: "RRRR-MM-DDTHH:MM". Odpočet beží do tohto okamihu. */
    start: string;
    /** Predpokladaný koniec osláv (pre kalendár), tiež v miestnom čase. */
    end: string;
    /** IANA časové pásmo miesta svadby, napr. "Europe/Bratislava". */
    timeZone: string;
  };

  /** Mesto / oblasť zobrazená v úvode. */
  location: string;

  seo: {
    title: string;
    description: string;
    /** Obrázok pre náhľad pri zdieľaní (ideálne 1200 × 630 px, JPG/PNG). */
    ogImage: string;
    /** Plná verejná adresa stránky, napr. "https://meno.github.io/svadba/". Voliteľné. */
    siteUrl?: string;
  };

  /** Ktoré voliteľné sekcie sa majú zobraziť. */
  sections: {
    story: boolean;
    storyTimeline: boolean;
    schedule: boolean;
    gallery: boolean;
    info: boolean;
    gifts: boolean;
    rsvp: boolean;
  };

  /** Položky navigácie v poradí, v akom sa zobrazia. Skryté sekcie sa vynechajú automaticky. */
  navigation: { id: SectionId; label: string }[];

  /** Úvodná animácia – stránka sa najprv ukáže ako zapečatená obálka. */
  envelope: {
    enabled: boolean;
    /** Malý nadpis nad obálkou. */
    eyebrow: string;
    /** Text tlačidla na otvorenie. */
    openLabel: string;
    /** Text na pozvánke, ktorá sa vysunie z obálky. */
    cardText: string;
  };

  hero: {
    eyebrow: string;
    headline: string;
    quote: string;
    image: ImageAsset;
  };

  countdown: {
    title: string;
    /** Text, ktorý nahradí odpočet po začiatku svadby. */
    afterTitle: string;
    afterMessage: string;
  };

  story: SectionHeading & {
    chapters: StoryChapter[];
    timelineTitle: string;
    timeline: Milestone[];
  };

  details: SectionHeading & {
    ceremony: Venue;
    reception: Venue;
    calendar: {
      title: string;
      /** Názov udalosti v kalendári hosťa, napr. „Svadba Michaely a Martina“. */
      eventTitle: string;
      description: string;
      /** Popis udalosti v kalendári hosťa. */
      eventDescription: string;
    };
  };

  schedule: SectionHeading & {
    items: ScheduleItem[];
  };

  rsvp: SectionHeading & {
    /** Odkaz na Google formulár (tvar https://docs.google.com/forms/d/e/…/viewform). */
    formUrl: string;
    /** Termín potvrdenia účasti vo formáte RRRR-MM-DD. */
    deadline: string;
    instructions: string[];
    buttonLabel: string;
    /** Zobraziť formulár aj priamo vložený v stránke (iframe) pod tlačidlom. */
    embed: boolean;
    note?: string;
  };

  gallery: SectionHeading & {
    images: GalleryImage[];
  };

  info: SectionHeading & {
    accommodation: {
      title: string;
      intro: string;
      places: Accommodation[];
      note?: string;
    };
    cards: InfoCard[];
    dressCode: {
      title: string;
      description: string;
      palette: { name: string; hex: string }[];
    };
    faqTitle: string;
    faq: FaqItem[];
    contactsTitle: string;
    contacts: Contact[];
  };

  gifts: SectionHeading & {
    message: string;
    options: GiftOption[];
    signature: string;
  };

  closing: {
    eyebrow: string;
    title: string;
    message: string;
    image: ImageAsset;
  };

  footer: {
    note: string;
  };
}
