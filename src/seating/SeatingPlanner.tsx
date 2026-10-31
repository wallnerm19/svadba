import { useEffect, useMemo, useRef, useState, type DragEvent, type ReactNode } from 'react';
import { Circle, Download, Minus, Plus, Printer, RectangleHorizontal, Search, Trash2, Upload, X } from 'lucide-react';
import {
  NO_GROUP_COLOR,
  PALETTE,
  parsePlan,
  uid,
  usePlan,
  type Group,
  type Guest,
  type Plan,
  type Table,
} from './store';

const collator = new Intl.Collator('sk');
const DRAG_TYPE = 'text/plain';

/** Ktoré hostí zvýrazniť – podľa skupiny a/alebo hľadaného mena. */
interface Highlight {
  groupId: string | null | undefined; // undefined = všetky skupiny, null = bez skupiny
  query: string;
}

export default function SeatingPlanner() {
  const [plan, setPlan] = usePlan();
  const [highlight, setHighlight] = useState<Highlight>({ groupId: undefined, query: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const unseated = sortGuests(byTable.get(null) ?? []);
  const totalSeats = plan.tables.reduce((sum, t) => sum + t.seats, 0);
  const seatedCount = plan.guests.length - unseated.length;

  const isDimmed = (guest: Guest) => {
    if (highlight.groupId !== undefined && guest.groupId !== highlight.groupId) return true;
    const q = normalize(highlight.query.trim());
    return q !== '' && !normalize(guest.name).includes(q);
  };

  const colorOf = (guest: Guest) => groupById.get(guest.groupId ?? '')?.color ?? NO_GROUP_COLOR;

  // --- Úpravy plánu ---------------------------------------------------------

  const updateGuest = (id: string, patch: Partial<Guest>) =>
    setPlan((p) => ({ ...p, guests: p.guests.map((g) => (g.id === id ? { ...g, ...patch } : g)) }));

  const moveGuest = (id: string, tableId: string | null) => updateGuest(id, { tableId });

  const addGuests = (names: string[], groupId: string | null) =>
    setPlan((p) => ({
      ...p,
      guests: [...p.guests, ...names.map((name) => ({ id: uid(), name, groupId, tableId: null, note: '' }))],
    }));

  const removeGuest = (id: string) => setPlan((p) => ({ ...p, guests: p.guests.filter((g) => g.id !== id) }));

  const updateTable = (id: string, patch: Partial<Table>) =>
    setPlan((p) => ({ ...p, tables: p.tables.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));

  const addTable = () =>
    setPlan((p) => ({
      ...p,
      tables: [...p.tables, { id: uid(), name: `Stôl ${p.tables.length + 1}`, seats: 8, shape: 'round' }],
    }));

  const removeTable = (table: Table) => {
    const count = byTable.get(table.id)?.length ?? 0;
    if (count && !confirm(`Odstrániť „${table.name}“? ${count} hostí sa presunie medzi nezaradených.`)) return;
    setPlan((p) => ({
      ...p,
      tables: p.tables.filter((t) => t.id !== table.id),
      guests: p.guests.map((g) => (g.tableId === table.id ? { ...g, tableId: null } : g)),
    }));
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
        </aside>

        <section aria-label="Stoly" className="min-w-0">
          <Toolbar groups={plan.groups} highlight={highlight} onChange={setHighlight} />

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-3 print:mt-0 print:grid-cols-2 print:gap-3">
            {plan.tables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                guests={sortGuests(byTable.get(table.id) ?? [])}
                unseated={unseated}
                colorOf={colorOf}
                isDimmed={isDimmed}
                renderChip={guestChip}
                onChange={(patch) => updateTable(table.id, patch)}
                onRemove={() => removeTable(table)}
                onSeat={(guestId) => moveGuest(guestId, table.id)}
              />
            ))}

            <button
              type="button"
              onClick={addTable}
              className="flex min-h-56 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line text-ink-soft transition-colors hover:border-sage hover:bg-ivory/60 hover:text-ink print:hidden"
            >
              <Plus size={28} strokeWidth={1.5} />
              <span className="text-sm font-semibold uppercase tracking-[0.18em]">Pridať stôl</span>
            </button>
          </div>
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

function ToolButton({ icon, onClick, children }: { icon: ReactNode; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-ivory px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:border-sage hover:bg-champagne/50"
    >
      {icon}
      {children}
    </button>
  );
}

function IconButton({
  label,
  icon,
  onClick,
  className = '',
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-champagne/60 hover:text-ink ${className}`}
    >
      {icon}
    </button>
  );
}

function Panel({
  title,
  action,
  highlighted = false,
  children,
}: {
  title: string;
  action?: ReactNode;
  highlighted?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={`rounded-2xl border bg-ivory p-5 shadow-soft transition-colors ${highlighted ? 'border-sage bg-sage-light' : 'border-line'}`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-2xl text-ink">{title}</h2>
        {action}
      </div>
      {children}
    </section>
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

// --- Pridávanie hostí -------------------------------------------------------

function AddGuestsForm({
  groups,
  onAdd,
}: {
  groups: Group[];
  onAdd: (names: string[], groupId: string | null) => void;
}) {
  const [text, setText] = useState('');
  const [groupId, setGroupId] = useState<string>(groups[0]?.id ?? '');
  const validGroup = groups.some((g) => g.id === groupId) ? groupId : '';

  const submit = () => {
    const names = text
      .split(/\r?\n/)
      .map((n) => n.trim())
      .filter(Boolean);
    if (!names.length) return;
    onAdd(names, validGroup || null);
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
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">Mená</span>
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
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">Skupina</span>
        <GroupSelect groups={groups} value={validGroup} onChange={setGroupId} />
      </label>
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
  const pill = (key: string, label: string, groupId: string | null | undefined, color?: string) => {
    const active = highlight.groupId === groupId;
    return (
      <button
        key={key}
        type="button"
        aria-pressed={active}
        onClick={() => onChange({ ...highlight, groupId: active ? undefined : groupId })}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors ${
          active ? 'border-ink bg-ink text-ivory' : 'border-line bg-ivory text-ink hover:border-sage'
        }`}
      >
        {color && <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} />}
        {label}
      </button>
    );
  };

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
        {pill('all', 'Všetci', undefined)}
        {groups.map((g) => pill(g.id, g.name, g.id, g.color))}
        {pill('none', 'Bez skupiny', null, NO_GROUP_COLOR)}
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
  return (
    <button
      type="button"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(DRAG_TYPE, guest.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onClick={onEdit}
      title={guest.note ? `${guest.name} – ${guest.note}` : guest.name}
      className={`inline-flex max-w-full cursor-grab items-center gap-1.5 rounded-full border px-2.5 py-1 text-left text-sm text-ink transition-opacity active:cursor-grabbing print:border-none print:p-0 ${
        dimmed ? 'opacity-25' : ''
      }`}
      style={{ borderColor: `${color}80`, backgroundColor: `${color}22` }}
    >
      <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      <span className="truncate">{guest.name}</span>
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
  const label = 'text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft';

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="theme-sage m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-line p-0 shadow-soft backdrop:bg-ink/30 backdrop:backdrop-blur-sm"
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
            <span className={label}>Meno</span>
            <input value={guest.name} onChange={(e) => onChange({ name: e.target.value })} className={field} />
          </label>
          <label className="block">
            <span className={label}>Skupina</span>
            <GroupSelect
              groups={groups}
              value={guest.groupId ?? ''}
              onChange={(id) => onChange({ groupId: id || null })}
            />
          </label>
          <label className="block">
            <span className={label}>Stôl</span>
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
            <span className={label}>Poznámka</span>
            <textarea
              value={guest.note}
              onChange={(e) => onChange({ note: e.target.value })}
              rows={2}
              placeholder="napr. vegetarián, detská stolička…"
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
