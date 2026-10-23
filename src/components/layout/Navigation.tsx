import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { wedding } from '../../config/wedding';
import { isSectionVisible, longDate } from '../../lib/wedding';
import { useActiveSection, useScrolled } from '../../hooks/useActiveSection';

const items = wedding.navigation.filter((item) => isSectionVisible(item.id));
const links = items.filter((item) => item.id !== 'rsvp');
const rsvpItem = items.find((item) => item.id === 'rsvp');
const monogram = `${wedding.couple.bride[0]}${wedding.couple.separator}${wedding.couple.groom[0]}`;

export function Navigation() {
  const scrolled = useScrolled(60);
  const active = useActiveSection(items.map((i) => i.id));
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Zatvorenie klávesom Esc, zamknutie posúvania a udržanie fokusu v menu.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('a')?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = [toggleRef.current, ...panelRef.current.querySelectorAll<HTMLElement>('a')].filter(
          Boolean,
        ) as HTMLElement[];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Pri zväčšení okna na desktop menu zavrieme.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Odkaz v mobilnom menu: najprv menu zavrieť (a odomknúť posúvanie), potom plynulo prejsť na sekciu.
  const navigateFromMenu = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    setOpen(false);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
        history.replaceState(null, '', `#${id}`);
      }),
    );
  };

  const solid = scrolled || open;
  const tone = solid ? 'text-ink' : 'text-ivory';

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ease-elegant ${
          solid ? 'bg-ivory/90 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <nav
          aria-label="Hlavná navigácia"
          className={`container-page flex items-center justify-between transition-[height] duration-500 ${
            scrolled ? 'h-16' : 'h-20'
          }`}
        >
          <a
            href="#uvod"
            className={`font-serif text-2xl tracking-wide transition-colors duration-500 ${tone}`}
            aria-label={`${wedding.couple.bride} a ${wedding.couple.groom} – späť na úvod`}
            onClick={() => setOpen(false)}
          >
            {monogram}
          </a>

          {/* Desktop */}
          <ul className="hidden items-center gap-8 lg:flex">
            {links.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id} className="relative">
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`py-2 text-[0.72rem] font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${
                      solid
                        ? isActive
                          ? 'text-ink'
                          : 'text-ink-soft hover:text-ink'
                        : isActive
                          ? 'text-ivory'
                          : 'text-ivory/75 hover:text-ivory'
                    }`}
                  >
                    {item.label}
                  </a>
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-0 h-px w-full bg-gold"
                      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                    />
                  )}
                </li>
              );
            })}
            {rsvpItem && (
              <li>
                <a
                  href="#rsvp"
                  aria-current={active === 'rsvp' ? 'true' : undefined}
                  className={`inline-flex items-center rounded-full border px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] transition-all duration-500 ${
                    solid
                      ? 'border-ink bg-ink text-ivory hover:border-sage-dark hover:bg-sage-dark'
                      : 'border-ivory/70 text-ivory hover:bg-ivory hover:text-ink'
                  }`}
                >
                  {rsvpItem.label}
                </a>
              </li>
            )}
          </ul>

          {/* Mobil */}
          <button
            ref={toggleRef}
            type="button"
            className={`-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors lg:hidden ${tone}`}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Zavrieť menu' : 'Otvoriť menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} strokeWidth={1.25} /> : <Menu size={24} strokeWidth={1.25} />}
          </button>
        </nav>
      </header>

      {/* Panel je mimo <header>, lebo backdrop-filter by obmedzil jeho „fixed“ pozíciu. */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id="mobile-menu"
            className="paper fixed inset-0 z-40 flex flex-col bg-ivory px-8 pt-28 pb-10 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ul className="flex flex-1 flex-col justify-center gap-1">
              {items.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => navigateFromMenu(e, item.id)}
                    aria-current={active === item.id ? 'true' : undefined}
                    className={`flex items-baseline gap-4 py-2 font-serif text-[2.1rem] leading-tight transition-colors ${
                      active === item.id ? 'text-ink' : 'text-ink-soft'
                    }`}
                  >
                    <span className="w-6 font-sans text-[0.65rem] tracking-[0.2em] text-gold-deep">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.p
              className="border-t border-line pt-6 text-center text-[0.7rem] uppercase tracking-[0.3em] text-ink-soft"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {longDate} · {wedding.location}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
