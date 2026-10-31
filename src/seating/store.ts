import { useEffect, useState } from 'react';

/*
 * Údaje plánovača sedenia. Ukladajú sa len do prehliadača (localStorage),
 * takže mená hostí sa nikdy nedostanú do verejného repozitára ani na web.
 * Prenos medzi zariadeniami: Export / Import súboru .json.
 *
 * Rozmery v priestore sú v centimetroch (sála 20 × 12 m = 2000 × 1200).
 */

export interface Group {
  id: string;
  name: string;
  color: string;
}

export type TableShape = 'round' | 'rect';

export interface Table {
  id: string;
  name: string;
  seats: number;
  shape: TableShape;
  /** Stred stola v sále (cm). */
  x: number;
  y: number;
  /** Otočenie obdĺžnikového stola (stupne). */
  rotation: number;
}

export type Age = 'adult' | 'child' | 'toddler';

export const AGES: { id: Age; label: string; short: string }[] = [
  { id: 'adult', label: 'Nad 12 rokov', short: '12+' },
  { id: 'child', label: 'Deti 3–12 rokov', short: '3–12' },
  { id: 'toddler', label: 'Deti 0–3 roky', short: '0–3' },
];

export type Diet = 'vegetarian' | 'vegan' | 'gluten' | 'lactose' | 'nuts' | 'other';

export const DIETS: { id: Diet; label: string }[] = [
  { id: 'vegetarian', label: 'Vegetariánska' },
  { id: 'vegan', label: 'Vegánska' },
  { id: 'gluten', label: 'Bezlepková' },
  { id: 'lactose', label: 'Bez laktózy' },
  { id: 'nuts', label: 'Bez orechov' },
  { id: 'other', label: 'Iné (v poznámke)' },
];

export interface Guest {
  id: string;
  name: string;
  groupId: string | null;
  tableId: string | null;
  age: Age;
  diet: Diet[];
  note: string;
}

export type RoomItemKind = 'dance' | 'music' | 'bar' | 'buffet' | 'cake' | 'entrance';

/** Pevné prvky sály a ich rozmery (cm). */
export const ROOM_ITEMS: Record<RoomItemKind, { label: string; width: number; height: number }> = {
  dance: { label: 'Parket', width: 500, height: 400 },
  music: { label: 'Hudba / DJ', width: 300, height: 200 },
  bar: { label: 'Bar', width: 400, height: 100 },
  buffet: { label: 'Bufet', width: 500, height: 100 },
  cake: { label: 'Torta', width: 120, height: 120 },
  entrance: { label: 'Vchod', width: 160, height: 40 },
};

export interface RoomItem {
  id: string;
  kind: RoomItemKind;
  x: number;
  y: number;
  rotation: number;
}

export interface Room {
  width: number;
  height: number;
  items: RoomItem[];
}

export interface Plan {
  version: 2;
  groups: Group[];
  tables: Table[];
  guests: Guest[];
  room: Room;
}

/** Ponúkané farby skupín (dá sa vybrať aj ľubovoľná iná). */
export const PALETTE = [
  '#c97b84',
  '#5b84b1',
  '#7fa36b',
  '#d4a24c',
  '#9b7bb8',
  '#4fa3a5',
  '#d9825b',
  '#b85c8a',
  '#3f6e5a',
  '#8a8a8a',
];

/** Farba hostí bez skupiny. */
export const NO_GROUP_COLOR = '#b9b4ab';

const STORAGE_KEY = 'svadba:sedenie';

export function uid() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Rozmer stola v sále (cm) – podľa počtu miest. */
export function tableSize(table: Pick<Table, 'seats' | 'shape'>) {
  if (table.shape === 'round') {
    const d = Math.max(90, Math.round((table.seats * 60) / Math.PI));
    return { width: d, height: d };
  }
  return { width: Math.max(120, Math.ceil(table.seats / 2) * 65), height: 80 };
}

/** Prvé voľné miesto v mriežke sály pre nový stôl. */
export function freeSpot(room: Room, tables: Pick<Table, 'x' | 'y'>[]) {
  const step = 330;
  for (let y = 250; y < room.height - 150; y += step) {
    for (let x = 250; x < room.width - 150; x += step) {
      if (tables.every((t) => Math.hypot(t.x - x, t.y - y) > step * 0.75)) return { x, y };
    }
  }
  return { x: room.width / 2, y: room.height / 2 };
}

export function emptyPlan(): Plan {
  return {
    version: 2,
    groups: [
      { id: uid(), name: 'Rodina nevesty', color: PALETTE[0] },
      { id: uid(), name: 'Rodina ženícha', color: PALETTE[1] },
      { id: uid(), name: 'Priatelia', color: PALETTE[2] },
      { id: uid(), name: 'Kolegovia', color: PALETTE[3] },
    ],
    tables: [],
    guests: [],
    room: { width: 2000, height: 1200, items: [] },
  };
}

const isString = (v: unknown): v is string => typeof v === 'string';
const isColor = (v: unknown): v is string => isString(v) && /^#[0-9a-f]{6}$/i.test(v);
const num = (v: unknown, min: number, max: number, fallback: number) =>
  typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : fallback;
const isAge = (v: unknown): v is Age => AGES.some((a) => a.id === v);
const isDiet = (v: unknown): v is Diet => DIETS.some((d) => d.id === v);
const isItemKind = (v: unknown): v is RoomItemKind => isString(v) && v in ROOM_ITEMS;

/** Overí a vyčistí načítané údaje (zo súboru alebo z prehliadača). Pri chybe vráti null. */
export function parsePlan(value: unknown): Plan | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as Record<string, unknown>;
  if (!Array.isArray(v.groups) || !Array.isArray(v.tables) || !Array.isArray(v.guests)) return null;

  const r = (v.room && typeof v.room === 'object' ? v.room : {}) as Record<string, unknown>;
  const room: Room = {
    width: num(r.width, 400, 10000, 2000),
    height: num(r.height, 400, 10000, 1200),
    items: (Array.isArray(r.items) ? r.items : []).flatMap((i) =>
      i && isString(i.id) && isItemKind(i.kind)
        ? [
            {
              id: i.id,
              kind: i.kind,
              x: num(i.x, 0, 10000, 300),
              y: num(i.y, 0, 10000, 300),
              rotation: num(i.rotation, 0, 359, 0),
            },
          ]
        : [],
    ),
  };

  const groups: Group[] = v.groups.flatMap((g) =>
    g && isString(g.id) && isString(g.name)
      ? [{ id: g.id, name: g.name, color: isColor(g.color) ? g.color : PALETTE[0] }]
      : [],
  );

  // Staršie uloženia (verzia 1) nemajú polohu stolov – rozmiestnime ich do mriežky.
  const tables: Table[] = [];
  for (const t of v.tables) {
    if (!t || !isString(t.id) || !isString(t.name)) continue;
    const spot = typeof t.x === 'number' && typeof t.y === 'number' ? null : freeSpot(room, tables);
    tables.push({
      id: t.id,
      name: t.name,
      seats: num(t.seats, 1, 60, 8),
      shape: t.shape === 'rect' ? 'rect' : 'round',
      x: spot ? spot.x : num(t.x, 0, 10000, 300),
      y: spot ? spot.y : num(t.y, 0, 10000, 300),
      rotation: num(t.rotation, 0, 359, 0),
    });
  }

  const groupIds = new Set(groups.map((g) => g.id));
  const tableIds = new Set(tables.map((t) => t.id));
  const guests: Guest[] = v.guests.flatMap((g) =>
    g && isString(g.id) && isString(g.name)
      ? [
          {
            id: g.id,
            name: g.name,
            groupId: groupIds.has(g.groupId) ? g.groupId : null,
            tableId: tableIds.has(g.tableId) ? g.tableId : null,
            age: isAge(g.age) ? g.age : 'adult',
            diet: Array.isArray(g.diet) ? [...new Set<Diet>(g.diet.filter(isDiet))] : [],
            note: isString(g.note) ? g.note : '',
          },
        ]
      : [],
  );
  return { version: 2, groups, tables, guests, room };
}

function loadPlan(): Plan {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return parsePlan(JSON.parse(raw)) ?? emptyPlan();
  } catch {
    /* poškodené alebo nedostupné úložisko – začneme odznova */
  }
  return emptyPlan();
}

/** Stav plánu, ktorý sa priebežne ukladá a synchronizuje medzi otvorenými kartami. */
export function usePlan() {
  const [plan, setPlan] = useState<Plan>(loadPlan);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    } catch {
      /* úložisko je plné alebo zablokované */
    }
  }, [plan]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        const next = parsePlan(JSON.parse(e.newValue));
        if (next) setPlan(next);
      } catch {
        /* ignorujeme */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return [plan, setPlan] as const;
}
