import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'outline' | 'light' | 'ghost';

const base =
  'group relative inline-flex min-h-12 items-center justify-center gap-2.5 overflow-hidden rounded-full px-7 py-3 ' +
  'text-[0.78rem] font-semibold uppercase tracking-[0.18em] transition-[color,background-color,border-color,box-shadow,transform] ' +
  'duration-500 ease-elegant active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-ivory shadow-soft hover:bg-sage-dark hover:shadow-lg',
  outline: 'border border-ink/25 text-ink hover:border-gold hover:bg-champagne/40',
  light: 'border border-ivory/60 bg-ivory/10 text-ivory backdrop-blur-sm hover:bg-ivory hover:text-ink',
  ghost: 'px-0 text-gold-deep hover:text-ink',
};

function classes(variant: Variant, className = '') {
  return `${base} ${variants[variant]} ${className}`;
}

/** Jemný lesk, ktorý prebehne tlačidlom pri prejdení myšou. */
function Shine({ variant }: { variant: Variant }) {
  if (variant === 'ghost') return null;
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-700 ease-elegant group-hover:left-[120%] group-hover:opacity-100"
    />
  );
}

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  children: ReactNode;
  external?: boolean;
}

export function ButtonLink({ variant = 'primary', className, children, external, ...props }: LinkProps) {
  const ext = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
    <a className={classes(variant, className)} {...ext} {...props}>
      <Shine variant={variant} />
      {children}
    </a>
  );
}

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

export function Button({ variant = 'primary', className, children, type = 'button', ...props }: BtnProps) {
  return (
    <button type={type} className={classes(variant, className)} {...props}>
      <Shine variant={variant} />
      {children}
    </button>
  );
}
