import type { ReactNode } from 'react';
import { Leaf, MilkOff, NutOff, Sprout, TriangleAlert, WheatOff, type LucideIcon } from 'lucide-react';
import { AGES, DIETS, type Diet, type Guest } from './store';

/** Typ dát pri presúvaní hosťa myšou (obsahuje id hosťa). */
export const DRAG_TYPE = 'text/plain';

export const DIET_ICONS: Record<Diet, LucideIcon> = {
  vegetarian: Leaf,
  vegan: Sprout,
  gluten: WheatOff,
  lactose: MilkOff,
  nuts: NutOff,
  other: TriangleAlert,
};

export const dietLabel = (diet: Diet) => DIETS.find((d) => d.id === diet)!.label;
export const ageShort = (age: Guest['age']) => AGES.find((a) => a.id === age)!.short;

/** Malé značky pri mene hosťa: vek dieťaťa a obmedzenia stravy. */
export function GuestBadges({ guest }: { guest: Guest }) {
  return (
    <>
      {guest.age !== 'adult' && (
        <span className="rounded-full bg-ink/10 px-1.5 text-[0.65rem] font-semibold leading-4 text-ink-soft">
          {ageShort(guest.age)}
        </span>
      )}
      {guest.diet.map((d) => {
        const Icon = DIET_ICONS[d];
        return <Icon key={d} size={13} className="shrink-0 text-ink-soft" aria-label={dietLabel(d)} />;
      })}
    </>
  );
}

export function ToolButton({
  icon,
  onClick,
  active = false,
  children,
}: {
  icon: ReactNode;
  onClick: () => void;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
        active
          ? 'border-ink bg-ink text-ivory'
          : 'border-ink/20 bg-ivory text-ink hover:border-sage hover:bg-champagne/50'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

export function IconButton({
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

export function Panel({
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
