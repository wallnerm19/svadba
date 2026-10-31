import { useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { Plus, RotateCw, Trash2 } from 'lucide-react';
import { ROOM_ITEMS, tableSize, type Guest, type Room, type RoomItem, type RoomItemKind, type Table } from './store';
import { DRAG_TYPE, IconButton, ToolButton } from './ui';

/** Presúvaný stôl alebo prvok sály (súradnice v cm). */
interface Drag {
  kind: 'table' | 'item';
  id: string;
  dx: number;
  dy: number;
  x: number;
  y: number;
  startX: number;
  startY: number;
  moved: boolean;
}

const SNAP = 10;
const PAD = 60;

export default function FloorPlan({
  room,
  tables,
  guestsAt,
  colorOf,
  isDimmed,
  selectedId,
  onSelect,
  onMoveTable,
  onSeat,
  onAddTable,
  onRoomChange,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  renderTableCard,
}: {
  room: Room;
  tables: Table[];
  guestsAt: (tableId: string) => Guest[];
  colorOf: (g: Guest) => string;
  isDimmed: (g: Guest) => boolean;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onMoveTable: (id: string, x: number, y: number) => void;
  onSeat: (guestId: string, tableId: string) => void;
  onAddTable: () => void;
  onRoomChange: (patch: Partial<Room>) => void;
  onAddItem: (kind: RoomItemKind) => void;
  onUpdateItem: (id: string, patch: Partial<RoomItem>) => void;
  onRemoveItem: (id: string) => void;
  renderTableCard: (table: Table) => ReactNode;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  const fontSize = Math.max(30, room.width / 55);
  const clamp = (v: number, max: number) => Math.min(max, Math.max(0, Math.round(v / SNAP) * SNAP));

  const toRoom = (e: PointerEvent) => {
    const ctm = svgRef.current!.getScreenCTM()!.inverse();
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm);
    return { x: p.x, y: p.y };
  };

  const startDrag = (e: PointerEvent, kind: Drag['kind'], id: string, x: number, y: number) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    svgRef.current!.setPointerCapture(e.pointerId);
    const p = toRoom(e);
    setDrag({ kind, id, dx: p.x - x, dy: p.y - y, x, y, startX: x, startY: y, moved: false });
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!drag) return;
    const p = toRoom(e);
    const x = clamp(p.x - drag.dx, room.width);
    const y = clamp(p.y - drag.dy, room.height);
    setDrag({ ...drag, x, y, moved: drag.moved || Math.hypot(x - drag.startX, y - drag.startY) > 15 });
  };

  const onPointerUp = () => {
    if (!drag) return;
    if (drag.moved) {
      if (drag.kind === 'table') onMoveTable(drag.id, drag.x, drag.y);
      else onUpdateItem(drag.id, { x: drag.x, y: drag.y });
    }
    onSelect(drag.id);
    setDrag(null);
  };

  const pos = (id: string, x: number, y: number) => (drag?.id === id ? { x: drag.x, y: drag.y } : { x, y });

  const selectedTable = tables.find((t) => t.id === selectedId);
  const selectedItem = room.items.find((i) => i.id === selectedId);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 print:hidden">
        <ToolButton icon={<Plus size={16} />} onClick={onAddTable}>
          Pridať stôl
        </ToolButton>
        <select
          value=""
          onChange={(e) => e.target.value && onAddItem(e.target.value as RoomItemKind)}
          aria-label="Pridať prvok sály"
          className="rounded-full border border-ink/20 bg-ivory px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink focus:border-sage focus:outline-none"
        >
          <option value="">+ Prvok sály…</option>
          {Object.entries(ROOM_ITEMS).map(([kind, item]) => (
            <option key={kind} value={kind}>
              {item.label}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2 text-sm text-ink-soft">
          Sála
          <MetersInput label="Šírka sály" value={room.width} onChange={(width) => onRoomChange({ width })} />×
          <MetersInput label="Hĺbka sály" value={room.height} onChange={(height) => onRoomChange({ height })} />m
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft print:shadow-none">
        <svg
          ref={svgRef}
          viewBox={`${-PAD} ${-PAD} ${room.width + PAD * 2} ${room.height + PAD * 2}`}
          className="block h-auto w-full select-none"
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => setDrag(null)}
          onPointerDown={() => onSelect(null)}
          role="img"
          aria-label="Rozloženie stolov v sále"
        >
          <defs>
            <pattern id="floor-grid" width={100} height={100} patternUnits="userSpaceOnUse">
              <path d="M100 0H0V100" fill="none" stroke="var(--color-line)" strokeWidth={1.5} opacity={0.6} />
            </pattern>
          </defs>
          <rect
            width={room.width}
            height={room.height}
            fill="url(#floor-grid)"
            stroke="var(--color-ink-soft)"
            strokeWidth={6}
          />

          {room.items.map((item) => {
            const meta = ROOM_ITEMS[item.kind];
            const p = pos(item.id, item.x, item.y);
            const selected = item.id === selectedId;
            return (
              <g
                key={item.id}
                transform={`translate(${p.x} ${p.y})`}
                onPointerDown={(e) => startDrag(e, 'item', item.id, item.x, item.y)}
                style={{ touchAction: 'none', cursor: drag?.id === item.id ? 'grabbing' : 'grab' }}
              >
                <rect
                  transform={`rotate(${item.rotation})`}
                  x={-meta.width / 2}
                  y={-meta.height / 2}
                  width={meta.width}
                  height={meta.height}
                  rx={12}
                  fill={item.kind === 'dance' ? '#efe7d6' : 'var(--color-cream)'}
                  stroke={selected ? 'var(--color-ink)' : 'var(--color-sand)'}
                  strokeWidth={selected ? 6 : 3}
                  strokeDasharray={selected ? undefined : '14 10'}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={fontSize * 0.85}
                  className="fill-ink-soft font-sans font-semibold uppercase"
                  letterSpacing={4}
                >
                  {meta.label}
                </text>
              </g>
            );
          })}

          {tables.map((table) => {
            const p = pos(table.id, table.x, table.y);
            const guests = guestsAt(table.id);
            return (
              <g
                key={table.id}
                transform={`translate(${p.x} ${p.y})`}
                onPointerDown={(e) => startDrag(e, 'table', table.id, table.x, table.y)}
                onDragOver={(e) => {
                  if (!e.dataTransfer.types.includes(DRAG_TYPE)) return;
                  e.preventDefault();
                  setDropTarget(table.id);
                }}
                onDragLeave={() => setDropTarget(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDropTarget(null);
                  const id = e.dataTransfer.getData(DRAG_TYPE);
                  if (id) onSeat(id, table.id);
                }}
                style={{ touchAction: 'none', cursor: drag?.id === table.id ? 'grabbing' : 'grab' }}
              >
                <TableShape
                  table={table}
                  guests={guests}
                  colorOf={colorOf}
                  isDimmed={isDimmed}
                  selected={table.id === selectedId}
                  dropping={table.id === dropTarget}
                />
                <text
                  textAnchor="middle"
                  y={-fontSize * 0.35}
                  fontSize={fontSize}
                  className="pointer-events-none fill-ink font-serif"
                >
                  {table.name}
                </text>
                <text
                  textAnchor="middle"
                  y={fontSize * 0.75}
                  fontSize={fontSize * 0.75}
                  className={`pointer-events-none font-sans font-semibold ${guests.length > table.seats ? 'fill-[#a4505b]' : 'fill-ink-soft'}`}
                >
                  {guests.length}/{table.seats}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <p className="text-xs text-ink-soft/80 print:hidden">
        Stoly a prvky presúvajte myšou alebo prstom (mriežka = 1 m). Kliknutím stôl vyberiete a nižšie ho upravíte.
        Hostí zo zoznamu nezaradených môžete pustiť priamo na stôl v pláne.
      </p>

      {selectedTable && <div className="max-w-md print:hidden">{renderTableCard(selectedTable)}</div>}

      {selectedItem && (
        <div className="flex max-w-md items-center gap-2 rounded-2xl border border-line bg-ivory p-4 shadow-soft print:hidden">
          <span className="flex-1 font-serif text-2xl text-ink">{ROOM_ITEMS[selectedItem.kind].label}</span>
          <IconButton
            label="Otočiť o 90°"
            icon={<RotateCw size={16} />}
            onClick={() => onUpdateItem(selectedItem.id, { rotation: (selectedItem.rotation + 90) % 180 })}
          />
          <IconButton
            label="Odstrániť prvok"
            icon={<Trash2 size={15} />}
            onClick={() => {
              onRemoveItem(selectedItem.id);
              onSelect(null);
            }}
          />
        </div>
      )}
    </div>
  );
}

function MetersInput({ label, value, onChange }: { label: string; value: number; onChange: (cm: number) => void }) {
  return (
    <input
      type="number"
      aria-label={label}
      min={4}
      max={100}
      step={0.5}
      value={value / 100}
      onChange={(e) => {
        const m = Number(e.target.value);
        if (m >= 4 && m <= 100) onChange(Math.round(m * 100));
      }}
      className="w-16 rounded-lg border border-line bg-white px-2 py-1 text-sm text-ink focus:border-sage focus:outline-none"
    />
  );
}

/** Stôl so stoličkami v mierke sály; stoličky majú farbu skupiny hosťa. */
function TableShape({
  table,
  guests,
  colorOf,
  isDimmed,
  selected,
  dropping,
}: {
  table: Table;
  guests: Guest[];
  colorOf: (g: Guest) => string;
  isDimmed: (g: Guest) => boolean;
  selected: boolean;
  dropping: boolean;
}) {
  const { width, height } = tableSize(table);
  const n = table.seats;
  const gap = 30;
  let chairs: { x: number; y: number }[];
  let chairR: number;

  if (table.shape === 'round') {
    const ring = width / 2 + gap;
    chairR = Math.min(24, ((Math.PI * ring) / n) * 0.42);
    chairs = Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      return { x: Math.cos(a) * ring, y: Math.sin(a) * ring };
    });
  } else {
    const top = Math.ceil(n / 2);
    const step = width / top;
    chairR = Math.min(24, step * 0.4);
    const row = (count: number, y: number) =>
      Array.from({ length: count }, (_, i) => ({ x: -width / 2 + step * (i + 0.5), y }));
    chairs = [...row(top, -height / 2 - gap), ...row(n - top, height / 2 + gap)];
  }

  const surface = {
    fill: dropping ? 'var(--color-sage-light)' : 'var(--color-ivory)',
    stroke: selected || dropping ? 'var(--color-ink)' : 'var(--color-sage)',
    strokeWidth: selected || dropping ? 7 : 4,
  };

  return (
    <g transform={table.shape === 'rect' ? `rotate(${table.rotation})` : undefined}>
      {chairs.map((c, i) => {
        const guest = guests[i];
        return (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r={chairR}
            fill={guest ? colorOf(guest) : 'white'}
            stroke={guest ? 'white' : 'var(--color-sand)'}
            strokeWidth={3}
            opacity={guest && isDimmed(guest) ? 0.25 : 1}
          >
            {guest && <title>{guest.name}</title>}
          </circle>
        );
      })}
      {table.shape === 'round' ? (
        <circle r={width / 2} {...surface} />
      ) : (
        <rect x={-width / 2} y={-height / 2} width={width} height={height} rx={10} {...surface} />
      )}
    </g>
  );
}
