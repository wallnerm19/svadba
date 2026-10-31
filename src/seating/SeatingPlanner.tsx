import { useEffect, useMemo, useRef, useState, type DragEvent, type ReactNode } from 'react';
import {
  Circle,
  Download,
  LayoutGrid,
  Map as MapIcon,
  Minus,
  Plus,
  Printer,
  RectangleHorizontal,
  RotateCw,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import FloorPlan from './FloorPlan';
import {
  AGES,
  DIETS,
  NO_GROUP_COLOR,
  PALETTE,
  freeSpot,
  parsePlan,
  uid,
  usePlan,
  type Age,
  type Diet,
  type Group,
  type Guest,
  type Plan,
  type Room,
  type RoomItem,
  type Table,
} from './store';
import { DIET_ICONS, DRAG_TYPE, GuestBadges, IconButton, Panel, ToolButton, ageShort, dietLabel } from './ui';

const collator = new Intl.Collator('sk');

/** Ktorých hostí zvýrazniť – podľa skupiny, veku, stravy a/alebo hľadaného mena. */
interface Highlight {
  groupId: string | null | undefined; // undefined = všetky skupiny, null = bez skupiny
  age: Age | undefined;
  diet: Diet | 'any' | undefined; // 'any' = akékoľvek obmedzenie
  query: string;
}

const NO_HIGHLIGHT: Highlight = { groupId: undefined, age: undefined, diet: undefined, query: '' };

type View = 'list' | 'floor';
const VIEW_KEY = 'svadba:sedenie:pohlad';

function loadView(): View {
  try {
    return localStorage.getItem(VIEW_KEY) === 'floor' ? 'floor' : 'list';
  } catch {
    return 'list';
  }
}

export default function SeatingPlanner() {
  const [plan, setPlan] = usePlan();
  const [highlight, setHighlight] = useState<Highlight>(NO_HIGHLIGHT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [view, setView] = useState<View>(loadView);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(VIEW_KEY, view);
    } catch {
      /* nevadí */
    }
  }, [view]);

  const groupIndex = useMemo(() => new Map(plan.groups.map((g, i) => [g.id, i])), [plan.groups]);
  const groupById = useMemo(() => new Map(plan.groups.map((g) => [g.id, g])), [plan.groups]);

  /** Hostia zoradení podľa skupín (v poradí skupín) a potom podľa mena. */
  const sortGuests = (list: Guest[]) =>
    [...list].sort(
      (a, b) =>
        (groupIndex.get(a.groupId ?? '') ?? 999) - (groupIndex.get(b.groupId ?? '') ?? 999) ||
        collator.compare(a.name, b.name),
    );

  const byTable = useMemo(() => {
    const map = new Map<string | null, Guest[]>();
    for (const guest of plan.guests) {
      const list = map.get(guest.tableId) ?? [];
      list.push(guest);
      map.set(guest.tableId, list);
    }
    return map;
  }, [plan.guests]);

  const guestsAt = (tableId: string) => sortGuests(byTable.get(tableId) ?? []);
  const unseated = sortGuests(byTable.get(null) ?? []);
  const totalSeats = plan.tables.reduce((sum, t) => sum + t.seats, 0);
  const seatedCount = plan.guests.length - unseated.length;

  const isDimmed = (guest: Guest) => {
    const h = highlight;
    if (h.groupId !== undefined && guest.groupId !== h.groupId) return true;
    if (h.age && guest.age !== h.age) return true;
    if (h.diet === 'any' && !guest.diet.length) return true;
    if (h.diet && h.diet !== 'any' && !guest.diet.includes(h.diet)) return true;
    const q = normalize(h.query.trim());
    return q !== '' && !normalize(guest.name).includes(q);
  };

  const colorOf = (guest: Guest) => groupById.get(guest.groupId ?? '')?.color ?? NO_GROUP_COLOR;

  // --- Úpravy plánu ---------------------------------------------------------

  const updateGuest = (id: string, patch: Partial<Guest>) =>
    setPlan((p) => ({ ...p, guests: p.guests.map((g) => (g.id === id ? { ...g, ...patch } : g)) }));

  const moveGuest = (id: string, tableId: string | null) => updateGuest(id, { tableId });

  const addGuests = (names: string[], groupId: string | null, age: Age) =>
    setPlan((p) => ({
      ...p,
      guests: [
        ...p.guests,
        ...names.map((name) => ({ id: uid(), name, groupId, tableId: null, age, diet: [], note: '' })),
      ],
    }));

  const removeGuest = (id: string) => setPlan((p) => ({ ...p, guests: p.guests.filter((g) => g.id !== id) }));

  const updateTable = (id: string, patch: Partial<Table>) =>
    setPlan((p) => ({ ...p, tables: p.tables.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));

  const addTable = () => {
    const id = uid();
    setPlan((p) => ({
      ...p,
      tables: [
        ...p.tables,
        {
          id,
          name: `Stôl ${p.tables.length + 1}`,
          seats: 8,
          shape: 'round',
          rotation: 0,
          ...freeSpot(p.room, [...p.tables, ...p.room.items]),
        },
      ],
    }));
    if (view === 'floor') setSelectedId(id);
  };

  const removeTable = (table: Table) => {
    const count = byTable.get(table.id)?.length ?? 0;
    if (count && !confirm(`Odstrániť „${table.name}“? ${count} hostí sa presunie medzi nezaradených.`)) return;
    setPlan((p) => ({
      ...p,
      tables: p.tables.filter((t) => t.id !== table.id),
      guests: p.guests.map((g) => (g.tableId === table.id ? { ...g, tableId: null } : g)),
    }));
  };

  const updateRoom = (patch: Partial<Room>) => setPlan((p) => ({ ...p, room: { ...p.room, ...patch } }));

  const updateItem = (id: string, patch: Partial<RoomItem>) =>
    updateRoom({ items: plan.room.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) });

  const addItem = (kind: RoomItem['kind']) => {
    const id = uid();
    updateRoom({
      items: [...plan.room.items, { id, kind, x: plan.room.width / 2, y: plan.room.height / 2, rotation: 0 }],
    });
    setSelectedId(id);
  };

  const updateGroup = (id: string, patch: Partial<Group>) =>
    setPlan((p) => ({ ...p, groups: p.groups.map((g) => (g.id === id ? { ...g, ...patch } : g)) }));

  const addGroup = () =>
    setPlan((p) => ({
      ...p,
      groups: [...p.groups, { id: uid(), name: 'Nová skupina', color: PALETTE[p.groups.length % PALETTE.length] }],
    }));

  const removeGroup = (group: Group) => {
    const count = plan.guests.filter((g) => g.groupId === group.id).length;
    if (count && !confirm(`Odstrániť skupinu „${group.name}“? ${count} hostí zostane bez skupiny.`)) return;
    if (highlight.groupId === group.id) setHighlight((h) => ({ ...h, groupId: undefined }));
    setPlan((p) => ({
      ...p,
      groups: p.groups.filter((g) => g.id !== group.id),
      guests: p.guests.map((g) => (g.groupId === group.id ? { ...g, groupId: null } : g)),
    }));
  };

  const guestChip = (guest: Guest) => (
    <GuestChip
      key={guest.id}
      guest={guest}
      color={colorOf(guest)}
      dimmed={isDimmed(guest)}
      onEdit={() => setEditingId(guest.id)}
    />
  );

  const tableCard = (table: Table) => (
    <TableCard
      key={table.id}
      table={table}
      guests={guestsAt(table.id)}
      unseated={unseated}
      colorOf={colorOf}
      isDimmed={isDimmed}
      renderChip={guestChip}
      onChange={(patch) => updateTable(table.id, patch)}
      onRemove={() => removeTable(table)}
      onSeat={(guestId) => moveGuest(guestId, table.id)}
    />
  );

  const editing = plan.guests.find((g) => g.id === editingId) ?? null;

  return (
    <div className="theme-sage paper min-h-screen print:bg-white print:bg-none">
      <Header plan={plan} setPlan={setPlan} seated={seatedCount} totalSeats={totalSeats} />

      <main className="container-page grid grid-cols-1 gap-8 py-8 lg:grid-cols-[20rem_minmax(0,1fr)] print:block print:py-0">
        <aside className="space-y-6 print:hidden lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto lg:pb-2">
          <Panel
            title="Skupiny"
            action={<IconButton label="Pridať skupinu" icon={<Plus size={16} />} onClick={addGroup} />}
          >
            <ul className="space-y-1.5">
              {plan.groups.map((group) => (
                <GroupRow
                  key={group.id}
                  group={group}
                  count={plan.guests.filter((g) => g.groupId === group.id).length}
                  onChange={(patch) => updateGroup(group.id, patch)}
                  onRemove={() => removeGroup(group)}
                />
              ))}
            </ul>
            <datalist id="seating-palette">
              {PALETTE.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Panel>

          <Panel title="Pridať hostí">
            <AddGuestsForm groups={plan.groups} onAdd={addGuests} />
          </Panel>

          <DropZone onDropGuest={(id) => moveGuest(id, null)}>
            {(over) => (
              <Panel title={`Nezaradení (${unseated.length})`} highlighted={over}>
                {unseated.length ? (
                  <div className="flex flex-wrap gap-1.5">{unseated.map(guestChip)}</div>
                ) : (
                  <p className="text-sm text-ink-soft">
                    {plan.guests.length ? 'Všetci hostia majú miesto. 🎉' : 'Zatiaľ žiadni hostia.'}
                  </p>
                )}
                <p className="mt-3 text-xs text-ink-soft/80">
                  Hostí presúvajte myšou na stoly. Na mobile kliknite na meno a vyberte stôl.
                </p>
              </Panel>
            )}
          </DropZone>

          <Panel title="Prehľad">
            <Overview guests={plan.guests} highlight={highlight} onChange={setHighlight} />
          </Panel>
        </aside>

        <section aria-label="Stoly" className="min-w-0">
          <div className="mb-5 flex flex-wrap gap-2 print:hidden">
            <ToolButton icon={<LayoutGrid size={16} />} active={view === 'list'} onClick={() => setView('list')}>
              Stoly
            </ToolButton>
            <ToolButton icon={<MapIcon size={16} />} active={view === 'floor'} onClick={() => setView('floor')}>
              Rozloženie sály
            </ToolButton>
          </div>

          <Toolbar groups={plan.groups} highlight={highlight} onChange={setHighlight} />

          {view === 'list' ? (
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-3 print:mt-0 print:grid-cols-2 print:gap-3">
              {plan.tables.map(tableCard)}

              <button
                type="button"
                onClick={addTable}
                className="flex min-h-56 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line text-ink-soft transition-colors hover:border-sage hover:bg-ivory/60 hover:text-ink print:hidden"
              >
                <Plus size={28} strokeWidth={1.5} />
                <span className="text-sm font-semibold uppercase tracking-[0.18em]">Pridať stôl</span>
              </button>
            </div>
          ) : (
            <div className="mt-5">
              <FloorPlan
                room={plan.room}
                tables={plan.tables}
                guestsAt={guestsAt}
                colorOf={colorOf}
                isDimmed={isDimmed}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onMoveTable={(id, x, y) => updateTable(id, { x, y })}
                onSeat={moveGuest}
                onAddTable={addTable}
                onRoomChange={updateRoom}
                onAddItem={addItem}
                onUpdateItem={updateItem}
                onRemoveItem={(id) => updateRoom({ items: plan.room.items.filter((i) => i.id !== id) })}
                renderTableCard={tableCard}
              />
            </div>
          )}
        </section>
      </main>

      <GuestDialog
        guest={editing}
        groups={plan.groups}
        tables={plan.tables}
        occupancy={(id) => byTable.get(id)?.length ?? 0}
        onChange={(patch) => editing && updateGuest(editing.id, patch)}
        onRemove={() => {
          if (editing && confirm(`Odstrániť hosťa „${editing.name}“?`)) {
            removeGuest(editing.id);
            setEditingId(null);
          }
        }}
        onClose={() => setEditingId(null)}
      />
    </div>
  );
}

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

// --- Hlavička ---------------------------------------------------------------

function Header({
  plan,
  setPlan,
  seated,
  totalSeats,
}: {
  plan: Plan;
  setPlan: (plan: Plan) => void;
  seated: number;
  totalSeats: number;
}) {
  const fileInput = useRef<HTMLInputElement>(null);

  const exportPlan = () => {
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sedenie-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importPlan = async (file: File) => {
    try {
      const next = parsePlan(JSON.parse(await file.text()));
      if (!next) throw new Error('invalid');
      if (
        confirm(
          `Nahradiť aktuálny plán súborom „${file.name}“ (${next.guests.length} hostí, ${next.tables.length} stolov)?`,
        )
      )
        setPlan(next);
    } catch {
      alert('Súbor sa nepodarilo načítať. Vyberte súbor exportovaný z tohto plánovača.');
    }
  };

  const stats: [string, string | number][] = [
    ['Hostia', plan.guests.length],
    ['Usadení', `${seated} / ${plan.guests.length}`],
    ['Stoly', plan.tables.length],
    ['Miesta', totalSeats],
  ];

  return (
    <header className="border-b border-line bg-ivory/70 backdrop-blur print:border-none print:bg-transparent">
      <div className="container-page flex flex-wrap items-end justify-between gap-x-8 gap-y-5 py-6">
        <div>
          <p className="eyebrow print:hidden">Interné · len pre nás</p>
          <h1 className="mt-1 text-4xl text-ink sm:text-5xl">Plán sedenia</h1>
        </div>

        <dl className="flex flex-wrap gap-x-7 gap-y-2 print:hidden">
          {stats.map(([label, value]) => (
            <div key={label}>
              <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-ink-soft">{label}</dt>
              <dd className="font-serif text-2xl leading-tight text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap gap-2 print:hidden">
          <ToolButton icon={<Download size={16} />} onClick={exportPlan}>
            Export
          </ToolButton>
          <ToolButton icon={<Upload size={16} />} onClick={() => fileInput.current?.click()}>
            Import
          </ToolButton>
          <ToolButton icon={<Printer size={16} />} onClick={() => window.print()}>
            Tlačiť
          </ToolButton>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void importPlan(file);
              e.target.value = '';
            }}
          />
        </div>
      </div>
      <p className="container-page pb-3 text-xs text-ink-soft/80 print:hidden">
        Plán sa ukladá automaticky, ale len v tomto prehliadači. Na prenos do iného zariadenia použite Export a Import.
      </p>
    </header>
  );
}

// --- Skupiny ----------------------------------------------------------------

function GroupRow({
  group,
  count,
  onChange,
  onRemove,
}: {
  group: Group;
  count: number;
  onChange: (patch: Partial<Group>) => void;
  onRemove: () => void;
}) {
  return (
    <li className="flex items-center gap-2">
      <label
        className="relative size-7 shrink-0 cursor-pointer rounded-full ring-2 ring-ivory ring-offset-1 ring-offset-line"
        style={{ backgroundColor: group.color }}
        title="Zmeniť farbu"
      >
        <span className="sr-only">Farba skupiny {group.name}</span>
        <input
          type="color"
          value={group.color}
          onChange={(e) => onChange({ color: e.target.value })}
          className="absolute inset-0 cursor-pointer opacity-0"
          list="seating-palette"
        />
      </label>
      <input
        value={group.name}
        onChange={(e) => onChange({ name: e.target.value })}
        aria-label="Názov skupiny"
        className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-1.5 py-1 text-sm text-ink hover:border-line focus:border-sage focus:bg-white focus:outline-none"
      />
      <span className="w-6 text-right text-sm tabular-nums text-ink-soft">{count}</span>
      <IconButton label={`Odstrániť skupinu ${group.name}`} icon={<Trash2 size={15} />} onClick={onRemove} />
    </li>
  );
}

// --- Prehľad veku a stravy --------------------------------------------------

function Overview({
  guests,
  highlight,
  onChange,
}: {
  guests: Guest[];
  highlight: Highlight;
  onChange: (h: Highlight) => void;
}) {
  const row = (key: string, label: ReactNode, count: number, active: boolean, toggle: () => void) => (
    <li key={key}>
      <button
        type="button"
        aria-pressed={active}
        onClick={toggle}
        className={`flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left text-sm transition-colors ${
          active ? 'bg-ink text-ivory' : 'text-ink hover:bg-champagne/50'
        }`}
      >
        <span className="flex flex-1 items-center gap-2">{label}</span>
        <span className="tabular-nums">{count}</span>
      </button>
    </li>
  );

  const withDiet = guests.filter((g) => g.diet.length).length;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-1 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">Vek</h3>
        <ul>
          {AGES.map((a) =>
            row(a.id, a.label, guests.filter((g) => g.age === a.id).length, highlight.age === a.id, () =>
              onChange({ ...highlight, age: highlight.age === a.id ? undefined : a.id }),
            ),
          )}
        </ul>
      </div>
      <div>
        <h3 className="mb-1 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">Strava</h3>
        <ul>
          {row('any', 'Akékoľvek obmedzenie', withDiet, highlight.diet === 'any', () =>
            onChange({ ...highlight, diet: highlight.diet === 'any' ? undefined : 'any' }),
          )}
          {DIETS.map((d) => {
            const Icon = DIET_ICONS[d.id];
            return row(
              d.id,
              <>
                <Icon size={14} className="shrink-0" /> {d.label}
              </>,
              guests.filter((g) => g.diet.includes(d.id)).length,
              highlight.diet === d.id,
              () => onChange({ ...highlight, diet: highlight.diet === d.id ? undefined : d.id }),
            );
          })}
        </ul>
      </div>
      <p className="text-xs text-ink-soft/80">Kliknutím zvýrazníte týchto hostí pri stoloch.</p>
    </div>
  );
}

// --- Pridávanie hostí -------------------------------------------------------

const fieldLabel = 'text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft';

function AddGuestsForm({
  groups,
  onAdd,
}: {
  groups: Group[];
  onAdd: (names: string[], groupId: string | null, age: Age) => void;
}) {
  const [text, setText] = useState('');
  const [groupId, setGroupId] = useState<string>(groups[0]?.id ?? '');
  const [age, setAge] = useState<Age>('adult');
  const validGroup = groups.some((g) => g.id === groupId) ? groupId : '';

  const submit = () => {
    const names = text
      .split(/\r?\n/)
      .map((n) => n.trim())
      .filter(Boolean);
    if (!names.length) return;
    onAdd(names, validGroup || null, age);
    setText('');
  };

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <label className="block">
        <span className={fieldLabel}>Mená</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              submit();
            }
          }}
          rows={3}
          placeholder={'Jana Nováková\nPeter Novák'}
          className="mt-1 block w-full resize-y rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-soft/50 focus:border-sage focus:outline-none"
        />
        <span className="mt-1 block text-xs text-ink-soft/80">
          Každé meno na nový riadok – môžete vložiť celý zoznam.
        </span>
      </label>
      <label className="block">
        <span className={fieldLabel}>Skupina</span>
        <GroupSelect groups={groups} value={validGroup} onChange={setGroupId} />
      </label>
      <div>
        <span className={fieldLabel}>Vek</span>
        <AgePicker value={age} onChange={setAge} />
      </div>
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-sage-dark"
      >
        <Plus size={16} /> Pridať
      </button>
    </form>
  );
}

function GroupSelect({ groups, value, onChange }: { groups: Group[]; value: string; onChange: (id: string) => void }) {
  const color = groups.find((g) => g.id === value)?.color ?? NO_GROUP_COLOR;
  return (
    <div className="relative mt-1">
      <span
        className="pointer-events-none absolute top-1/2 left-3 size-3 -translate-y-1/2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-lg border border-line bg-white py-2 pr-3 pl-8 text-sm text-ink focus:border-sage focus:outline-none"
      >
        {groups.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
        <option value="">Bez skupiny</option>
      </select>
    </div>
  );
}

function AgePicker({ value, onChange }: { value: Age; onChange: (age: Age) => void }) {
  return (
    <div role="radiogroup" className="mt-1 grid grid-cols-3 gap-1 rounded-lg border border-line bg-white p-1">
      {AGES.map((a) => (
        <button
          key={a.id}
          type="button"
          role="radio"
          aria-checked={value === a.id}
          title={a.label}
          onClick={() => onChange(a.id)}
          className={`rounded-md py-1.5 text-sm transition-colors ${
            value === a.id ? 'bg-ink text-ivory' : 'text-ink hover:bg-champagne/50'
          }`}
        >
          {a.short} r.
        </button>
      ))}
    </div>
  );
}

// --- Filter -----------------------------------------------------------------

function Toolbar({
  groups,
  highlight,
  onChange,
}: {
  groups: Group[];
  highlight: Highlight;
  onChange: (h: Highlight) => void;
}) {
  const pillClass = (active: boolean) =>
    `inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors ${
      active ? 'border-ink bg-ink text-ivory' : 'border-line bg-ivory text-ink hover:border-sage'
    }`;

  const pill = (key: string, label: string, groupId: string | null, color: string) => {
    const active = highlight.groupId === groupId;
    return (
      <button
        key={key}
        type="button"
        aria-pressed={active}
        onClick={() => onChange({ ...highlight, groupId: active ? undefined : groupId })}
        className={pillClass(active)}
      >
        <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
        {label}
      </button>
    );
  };

  const nothingActive = highlight.groupId === undefined && !highlight.age && !highlight.diet && !highlight.query.trim();

  return (
    <div className="flex flex-wrap items-center gap-3 print:hidden">
      <label className="relative w-full sm:w-64">
        <span className="sr-only">Hľadať hosťa</span>
        <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-soft" />
        <input
          type="search"
          value={highlight.query}
          onChange={(e) => onChange({ ...highlight, query: e.target.value })}
          placeholder="Hľadať hosťa…"
          className="block w-full rounded-full border border-line bg-white py-2 pr-4 pl-9 text-sm text-ink focus:border-sage focus:outline-none"
        />
      </label>
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          aria-pressed={nothingActive}
          onClick={() => onChange(NO_HIGHLIGHT)}
          className={pillClass(nothingActive)}
        >
          Všetci
        </button>
        {groups.map((g) => pill(g.id, g.name, g.id, g.color))}
        {pill('none', 'Bez skupiny', null, NO_GROUP_COLOR)}
        {highlight.age && (
          <button type="button" onClick={() => onChange({ ...highlight, age: undefined })} className={pillClass(true)}>
            {ageShort(highlight.age)} r. <X size={12} />
          </button>
        )}
        {highlight.diet && (
          <button type="button" onClick={() => onChange({ ...highlight, diet: undefined })} className={pillClass(true)}>
            {highlight.diet === 'any' ? 'Obmedzenie stravy' : dietLabel(highlight.diet)} <X size={12} />
          </button>
        )}
      </div>
    </div>
  );
}

// --- Hostia -----------------------------------------------------------------

function GuestChip({
  guest,
  color,
  dimmed,
  onEdit,
}: {
  guest: Guest;
  color: string;
  dimmed: boolean;
  onEdit: () => void;
}) {
  const details = [
    guest.age !== 'adult' && `${ageShort(guest.age)} r.`,
    ...guest.diet.map(dietLabel),
    guest.note,
  ].filter(Boolean);

  return (
    <button
      type="button"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(DRAG_TYPE, guest.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onClick={onEdit}
      title={details.length ? `${guest.name} – ${details.join(', ')}` : guest.name}
      className={`inline-flex max-w-full cursor-grab items-center gap-1.5 rounded-full border px-2.5 py-1 text-left text-sm text-ink transition-opacity active:cursor-grabbing print:border-none print:p-0 ${
        dimmed ? 'opacity-25' : ''
      }`}
      style={{ borderColor: `${color}80`, backgroundColor: `${color}22` }}
    >
      <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      <span className="truncate">{guest.name}</span>
      <GuestBadges guest={guest} />
      {guest.note && <span className="text-ink-soft">*</span>}
    </button>
  );
}

/** Oblasť, na ktorú sa dá pustiť presúvaný hosť. */
function DropZone({
  onDropGuest,
  children,
  className,
}: {
  onDropGuest: (guestId: string) => void;
  children: (over: boolean) => ReactNode;
  className?: string;
}) {
  const [over, setOver] = useState(false);
  const hasGuest = (e: DragEvent) => e.dataTransfer.types.includes(DRAG_TYPE);

  return (
    <div
      className={className}
      onDragOver={(e) => {
        if (!hasGuest(e)) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const id = e.dataTransfer.getData(DRAG_TYPE);
        if (id) onDropGuest(id);
      }}
    >
      {children(over)}
    </div>
  );
}

// --- Stoly ------------------------------------------------------------------

/** Súhrn pre kuchyňu: počet detí a obmedzení stravy pri stole. */
function TableSummary({ guests }: { guests: Guest[] }) {
  const parts: ReactNode[] = [];
  for (const age of AGES) {
    const count = guests.filter((g) => g.age === age.id).length;
    if (age.id !== 'adult' && count)
      parts.push(
        <span key={age.id}>
          {count}× {age.short} r.
        </span>,
      );
  }
  for (const diet of DIETS) {
    const count = guests.filter((g) => g.diet.includes(diet.id)).length;
    if (!count) continue;
    const Icon = DIET_ICONS[diet.id];
    parts.push(
      <span key={diet.id} className="inline-flex items-center gap-1" title={diet.label}>
        {count}× <Icon size={13} aria-label={diet.label} />
      </span>,
    );
  }
  if (!parts.length) return null;
  return <div className="flex flex-wrap gap-x-3 gap-y-1 px-1.5 text-xs text-ink-soft">{parts}</div>;
}

function TableCard({
  table,
  guests,
  unseated,
  colorOf,
  isDimmed,
  renderChip,
  onChange,
  onRemove,
  onSeat,
}: {
  table: Table;
  guests: Guest[];
  unseated: Guest[];
  colorOf: (g: Guest) => string;
  isDimmed: (g: Guest) => boolean;
  renderChip: (g: Guest) => ReactNode;
  onChange: (patch: Partial<Table>) => void;
  onRemove: () => void;
  onSeat: (guestId: string) => void;
}) {
  const over = guests.length > table.seats;
  const full = guests.length >= table.seats;

  return (
    <DropZone onDropGuest={onSeat} className="break-inside-avoid">
      {(dragOver) => (
        <article
          className={`flex h-full flex-col rounded-2xl border bg-ivory p-4 shadow-soft transition-colors print:shadow-none ${
            dragOver ? 'border-sage bg-sage-light' : over ? 'border-[#c97b84]' : 'border-line'
          }`}
        >
          <div className="flex items-start gap-1">
            <input
              value={table.name}
              onChange={(e) => onChange({ name: e.target.value })}
              aria-label="Názov stola"
              className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-1.5 py-0.5 font-serif text-2xl text-ink hover:border-line focus:border-sage focus:bg-white focus:outline-none print:p-0"
            />
            {table.shape === 'rect' && (
              <IconButton
                label="Otočiť v sále o 90°"
                icon={<RotateCw size={15} />}
                onClick={() => onChange({ rotation: (table.rotation + 90) % 180 })}
                className="print:hidden"
              />
            )}
            <IconButton
              label={table.shape === 'round' ? 'Zmeniť na obdĺžnikový stôl' : 'Zmeniť na okrúhly stôl'}
              icon={table.shape === 'round' ? <RectangleHorizontal size={16} /> : <Circle size={16} />}
              onClick={() => onChange({ shape: table.shape === 'round' ? 'rect' : 'round' })}
              className="print:hidden"
            />
            <IconButton
              label={`Odstrániť ${table.name}`}
              icon={<Trash2 size={15} />}
              onClick={onRemove}
              className="print:hidden"
            />
          </div>

          <div className="mt-1 flex items-center gap-2 px-1.5 text-sm text-ink-soft">
            <span className={over ? 'font-semibold text-[#a4505b]' : ''}>
              {guests.length} / {table.seats} miest
            </span>
            {over && <span className="text-xs text-[#a4505b]">· prekročená kapacita</span>}
            <span className="ml-auto flex items-center gap-0.5 print:hidden">
              <IconButton
                label="Ubrať miesto"
                icon={<Minus size={14} />}
                onClick={() => onChange({ seats: Math.max(1, table.seats - 1) })}
              />
              <IconButton
                label="Pridať miesto"
                icon={<Plus size={14} />}
                onClick={() => onChange({ seats: Math.min(60, table.seats + 1) })}
              />
            </span>
          </div>

          <TableSummary guests={guests} />

          <TableDiagram table={table} guests={guests} colorOf={colorOf} isDimmed={isDimmed} />

          <div className="flex flex-1 flex-wrap content-start gap-1.5 print:block print:columns-2 print:text-sm">
            {guests.length ? (
              guests.map((g) => (
                <div key={g.id} className="contents print:block">
                  {renderChip(g)}
                </div>
              ))
            ) : (
              <p className="w-full rounded-xl border border-dashed border-line py-4 text-center text-sm text-ink-soft/80 print:hidden">
                Sem pretiahnite hostí
              </p>
            )}
          </div>

          {unseated.length > 0 && !full && (
            <select
              value=""
              onChange={(e) => e.target.value && onSeat(e.target.value)}
              aria-label={`Usadiť hosťa za ${table.name}`}
              className="mt-3 block w-full rounded-lg border border-line bg-white px-3 py-1.5 text-sm text-ink-soft focus:border-sage focus:outline-none print:hidden"
            >
              <option value="">+ Usadiť hosťa…</option>
              {unseated.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          )}
        </article>
      )}
    </DropZone>
  );
}

/** Nákres stola: stoličky sú vyfarbené farbou skupiny hosťa, ktorý na nich sedí. */
function TableDiagram({
  table,
  guests,
  colorOf,
  isDimmed,
}: {
  table: Table;
  guests: Guest[];
  colorOf: (g: Guest) => string;
  isDimmed: (g: Guest) => boolean;
}) {
  const W = 220;
  const H = 130;
  const n = table.seats;
  let seats: { x: number; y: number }[];
  let seatR: number;
  let surface: ReactNode;

  if (table.shape === 'round') {
    const ring = 52;
    seatR = Math.min(10, ((Math.PI * ring) / n) * 0.8);
    seats = Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      return { x: W / 2 + Math.cos(a) * ring, y: H / 2 + Math.sin(a) * ring };
    });
    surface = <circle cx={W / 2} cy={H / 2} r={ring - seatR - 5} />;
  } else {
    const top = Math.ceil(n / 2);
    const bottom = n - top;
    const width = 180;
    const step = width / top;
    seatR = Math.min(10, step * 0.38);
    const row = (count: number, y: number) =>
      Array.from({ length: count }, (_, i) => ({ x: (W - width) / 2 + step * (i + 0.5), y }));
    seats = [...row(top, H / 2 - 30), ...row(bottom, H / 2 + 30)];
    surface = <rect x={(W - width) / 2} y={H / 2 - 17} width={width} height={34} rx={6} />;
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto my-3 block h-auto w-full max-w-[15rem]" aria-hidden="true">
      <g fill="var(--color-cream)" stroke="var(--color-line)" strokeWidth={1.5}>
        {surface}
      </g>
      {seats.map((s, i) => {
        const guest = guests[i];
        return (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={seatR}
            fill={guest ? colorOf(guest) : 'white'}
            stroke={guest ? 'white' : 'var(--color-line)'}
            strokeWidth={1.5}
            opacity={guest && isDimmed(guest) ? 0.25 : 1}
          >
            {guest && <title>{guest.name}</title>}
          </circle>
        );
      })}
      <text
        x={W / 2}
        y={H / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-ink-soft font-sans text-[13px] font-semibold"
      >
        {guests.length}/{n}
      </text>
    </svg>
  );
}

// --- Úprava hosťa -----------------------------------------------------------

function GuestDialog({
  guest,
  groups,
  tables,
  occupancy,
  onChange,
  onRemove,
  onClose,
}: {
  guest: Guest | null;
  groups: Group[];
  tables: Table[];
  occupancy: (tableId: string) => number;
  onChange: (patch: Partial<Guest>) => void;
  onRemove: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (guest && !dialog.open) dialog.showModal();
    if (!guest && dialog.open) dialog.close();
  }, [guest]);

  const field =
    'mt-1 block w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-sage focus:outline-none';

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="theme-sage m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md rounded-2xl border border-line p-0 shadow-soft backdrop:bg-ink/30 backdrop:backdrop-blur-sm"
    >
      {guest && (
        <form
          method="dialog"
          className="space-y-4 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            onClose();
          }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-3xl text-ink">Hosť</h2>
            <IconButton label="Zavrieť" icon={<X size={18} />} onClick={onClose} />
          </div>
          <label className="block">
            <span className={fieldLabel}>Meno</span>
            <input value={guest.name} onChange={(e) => onChange({ name: e.target.value })} className={field} />
          </label>
          <label className="block">
            <span className={fieldLabel}>Skupina</span>
            <GroupSelect
              groups={groups}
              value={guest.groupId ?? ''}
              onChange={(id) => onChange({ groupId: id || null })}
            />
          </label>
          <div>
            <span className={fieldLabel}>Vek</span>
            <AgePicker value={guest.age} onChange={(age) => onChange({ age })} />
          </div>
          <fieldset>
            <legend className={fieldLabel}>Strava</legend>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {DIETS.map((d) => {
                const Icon = DIET_ICONS[d.id];
                const checked = guest.diet.includes(d.id);
                return (
                  <label
                    key={d.id}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors has-focus-visible:outline-2 has-focus-visible:outline-gold-deep ${
                      checked ? 'border-ink bg-ink text-ivory' : 'border-line bg-white text-ink hover:border-sage'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() =>
                        onChange({ diet: checked ? guest.diet.filter((x) => x !== d.id) : [...guest.diet, d.id] })
                      }
                    />
                    <Icon size={14} /> {d.label}
                  </label>
                );
              })}
            </div>
          </fieldset>
          <label className="block">
            <span className={fieldLabel}>Stôl</span>
            <select
              value={guest.tableId ?? ''}
              onChange={(e) => onChange({ tableId: e.target.value || null })}
              className={field}
            >
              <option value="">Nezaradený</option>
              {tables.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({occupancy(t.id)}/{t.seats})
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={fieldLabel}>Poznámka</span>
            <textarea
              value={guest.note}
              onChange={(e) => onChange({ note: e.target.value })}
              rows={2}
              placeholder="napr. alergia na jahody, detská stolička…"
              className={`${field} resize-y placeholder:text-ink-soft/50`}
            />
          </label>
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-1.5 text-sm text-[#a4505b] hover:underline"
            >
              <Trash2 size={15} /> Odstrániť hosťa
            </button>
            <button
              type="submit"
              className="rounded-full bg-ink px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-sage-dark"
            >
              Hotovo
            </button>
          </div>
        </form>
      )}
    </dialog>
  );
}
