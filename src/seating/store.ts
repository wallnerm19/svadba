import { useEffect, useState } from 'react';

/*
 * Údaje plánovača sedenia. Ukladajú sa len do prehliadača (localStorage),
 * takže mená hostí sa nikdy nedostanú do verejného repozitára ani na web.
 * Prenos medzi zariadeniami: Export / Import súboru .json.
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
}

export interface Guest {
  id: string;
  name: string;
  groupId: string | null;
  tableId: string | null;
  note: string;
}

export interface Plan {
  version: 1;
  groups: Group[];
  tables: Table[];
  guests: Guest[];
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

export function emptyPlan(): Plan {
  return {
    version: 1,
    groups: [
      { id: uid(), name: 'Rodina nevesty', color: PALETTE[0] },
      { id: uid(), name: 'Rodina ženícha', color: PALETTE[1] },
      { id: uid(), name: 'Priatelia', color: PALETTE[2] },
      { id: uid(), name: 'Kolegovia', color: PALETTE[3] },
    ],
    tables: [],
    guests: [],
  };
}

const isString = (v: unknown): v is string => typeof v === 'string';
const isColor = (v: unknown): v is string => isString(v) && /^#[0-9a-f]{6}$/i.test(v);

/** Overí a vyčistí načítané údaje (zo súboru alebo z prehliadača). Pri chybe vráti null. */
export function parsePlan(value: unknown): Plan | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as Record<string, unknown>;
  if (!Array.isArray(v.groups) || !Array.isArray(v.tables) || !Array.isArray(v.guests)) return null;

  const groups: Group[] = v.groups.flatMap((g) =>
    g && isString(g.id) && isString(g.name)
      ? [{ id: g.id, name: g.name, color: isColor(g.color) ? g.color : PALETTE[0] }]
      : [],
  );
  const tables: Table[] = v.tables.flatMap((t) =>
    t && isString(t.id) && isString(t.name)
      ? [
          {
            id: t.id,
            name: t.name,
            seats: Number.isFinite(t.seats) ? Math.min(60, Math.max(1, Math.round(t.seats))) : 8,
            shape: t.shape === 'rect' ? 'rect' : 'round',
          } satisfies Table,
        ]
      : [],
  );
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
            note: isString(g.note) ? g.note : '',
          },
        ]
      : [],
  );
  return { version: 1, groups, tables, guests };
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
