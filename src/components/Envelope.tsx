import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { wedding } from '../config/wedding';
import { firstName, longDate, secondName } from '../lib/wedding';

/**
 * Úvodná obálka: zapečatená pozvánka cez celú obrazovku.
 * Po kliknutí sa pečať rozlomí, chlopňa otvorí, pozvánka vysunie
 * a obálka sa plynulo prelnie do úvodnej sekcie stránky.
 */

type Phase = 'closed' | 'opening' | 'letter' | 'reveal';

const ease = [0.22, 1, 0.36, 1] as const;
const monogram = `${firstName[0]}${wedding.couple.separator}${secondName[0]}`;

/** Nepravidelný okraj voskovej pečate. */
function waxPath(cx: number, cy: number, r: number): string {
  const points = Array.from({ length: 72 }, (_, i) => {
    const a = (i / 72) * Math.PI * 2;
    const k = 1 + 0.035 * Math.sin(7 * a) + 0.025 * Math.sin(11 * a + 1.3) + 0.015 * Math.sin(17 * a + 0.4);
    return [cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k];
  });
  return points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`).join(' ') + 'Z';
}

const WAX = waxPath(50, 50, 46);

function Seal({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_4px_6px_rgb(30_38_26/0.35)]">
      <defs>
        <radialGradient id={`${id}-wax`} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#7d8d70" />
          <stop offset="0.55" stopColor="#5a6a4f" />
          <stop offset="1" stopColor="#3f4b37" />
        </radialGradient>
      </defs>
      <path d={WAX} fill={`url(#${id}-wax)`} />
      <circle cx="50" cy="50" r="33" fill="none" stroke="rgb(255 255 255 / 0.22)" strokeWidth="1.2" />
      <circle cx="50" cy="50" r="30" fill="none" stroke="rgb(0 0 0 / 0.18)" strokeWidth="0.8" />
      <text
        x="50"
        y="51"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Cormorant Garamond Variable', Georgia, serif"
        fontStyle="italic"
        fontSize="25"
        fill="rgb(0 0 0 / 0.28)"
        dx="0.6"
        dy="0.8"
      >
        {monogram}
      </text>
      <text
        x="50"
        y="51"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Cormorant Garamond Variable', Georgia, serif"
        fontStyle="italic"
        fontSize="25"
        fill="#ece4cf"
      >
        {monogram}
      </text>
    </svg>
  );
}

interface EnvelopeProps {
  /** Volá sa, keď sa obálka začne prelínať do stránky (spustia sa animácie úvodu). */
  onReveal: () => void;
  /** Volá sa po skončení animácie – obálka sa odstráni. */
  onDone: () => void;
}

export function Envelope({ onReveal, onDone }: EnvelopeProps) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('closed');
  const [flapBehind, setFlapBehind] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timers = useRef<number[]>([]);
  const { envelope } = wedding;

  // Obálka vždy začína na vrchu stránky a stránka pod ňou sa neposúva.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    buttonRef.current?.focus({ preventScroll: true });
    const pending = timers.current;
    return () => {
      document.body.style.overflow = previousOverflow;
      pending.forEach(clearTimeout);
    };
  }, []);

  const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

  const reveal = (fadeMs: number) => {
    setPhase('reveal');
    onReveal();
    at(fadeMs, onDone);
  };

  const open = () => {
    if (phase !== 'closed') return;
    if (reduce) {
      reveal(500);
      return;
    }
    setPhase('opening'); // pečať sa rozlomí, chlopňa sa otvára
    at(650, () => setFlapBehind(true)); // chlopňa prejde za pozvánku
    at(1050, () => setPhase('letter')); // pozvánka sa vysúva
    at(2150, () => reveal(1100)); // prelínanie do stránky
  };

  const skip = () => {
    if (phase === 'reveal') return;
    timers.current.forEach(clearTimeout);
    reveal(500);
  };

  const closed = phase === 'closed';
  const flapOpen = phase !== 'closed';
  const letterOut = phase === 'letter' || phase === 'reveal';
  const revealing = phase === 'reveal';

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${envelope.eyebrow} – ${firstName} a ${secondName}`}
      className="theme-sage paper fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden px-6"
      initial={{ opacity: 1 }}
      animate={{ opacity: revealing ? 0 : 1 }}
      transition={{ duration: reduce ? 0.5 : 1.1, ease }}
      style={{ pointerEvents: revealing ? 'none' : 'auto' }}
    >
      {/* jemné ozdobné kruhy v pozadí */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 h-[30rem] w-[30rem] rounded-full border border-sage-dark/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 -bottom-56 h-[36rem] w-[36rem] rounded-full border border-sage-dark/10"
      />

      <button
        type="button"
        onClick={skip}
        className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4 rounded-full px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-ink-soft transition-colors hover:text-ink sm:right-8"
      >
        Preskočiť
      </button>

      <motion.p
        className="eyebrow mb-8 sm:mb-10"
        animate={{ opacity: closed ? 1 : 0, y: closed ? 0 : -10 }}
        transition={{ duration: 0.5 }}
      >
        {envelope.eyebrow}
      </motion.p>

      {/* Scéna s obálkou */}
      <motion.div
        aria-hidden="true"
        className="relative cursor-pointer"
        style={{ width: 'min(86vw, 34rem, 66svh)', aspectRatio: '3 / 2', perspective: 1400 }}
        onClick={open}
        initial={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.96 }}
        animate={{
          opacity: 1,
          y: letterOut ? '14%' : 0,
          scale: revealing ? 1.35 : 1,
        }}
        whileHover={closed && !reduce ? { y: -4 } : undefined}
        transition={{ duration: revealing ? 1.1 : 0.9, ease }}
      >
        {/* zadná strana s vložkou */}
        <div className="absolute inset-0 rounded-[6px] bg-[#e9e2d3] shadow-[0_30px_60px_-28px_rgb(44_53_39/0.55)]">
          <div className="absolute inset-x-[3%] top-[3%] h-[55%] rounded-t-[4px] bg-[linear-gradient(160deg,#cfd8c3,#e2e7d8_55%,#c7d1ba)]" />
        </div>

        {/* pozvánka */}
        <motion.div
          className="absolute inset-x-[6%] top-[5%] flex h-[90%] flex-col items-center justify-center rounded-[3px] border border-[#e4dccb] bg-[#fbf8f2] px-4 text-center shadow-[0_6px_18px_-8px_rgb(44_53_39/0.35)]"
          style={{ zIndex: 2 }}
          animate={{ y: letterOut ? '-56%' : '0%' }}
          transition={{ duration: 1.1, ease }}
        >
          <span className="font-sans text-[clamp(0.5rem,1.6vw,0.65rem)] font-semibold uppercase tracking-[0.3em] text-[#56654c]">
            {envelope.cardText}
          </span>
          <span className="mt-[4%] font-serif text-[clamp(1.4rem,5.4vw,2.6rem)] leading-none text-[#2c3527]">
            {firstName} <span className="text-[#a99566] italic">{wedding.couple.separator}</span> {secondName}
          </span>
          <span className="mt-[5%] h-px w-1/4 bg-[#a99566]/60" />
          <span className="mt-[5%] font-serif text-[clamp(0.85rem,2.6vw,1.2rem)] text-[#4f5b48] italic">
            {longDate}
          </span>
        </motion.div>

        {/* predná kapsa obálky */}
        <svg
          viewBox="0 0 300 200"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full overflow-visible"
          style={{ zIndex: 3 }}
        >
          <path d="M0 0 L150 112 L0 200 Z" fill="#f1ebdf" />
          <path d="M300 0 L150 112 L300 200 Z" fill="#eee7da" />
          <path d="M0 200 L150 94 L300 200 Z" fill="#f6f1e7" stroke="rgb(120 105 80 / 0.12)" strokeWidth="0.6" />
        </svg>

        {/* horná chlopňa */}
        <motion.div
          className="absolute inset-x-0 top-0 h-[57%]"
          style={{ transformOrigin: '50% 0%', zIndex: flapBehind ? 1 : 4, transformStyle: 'preserve-3d' }}
          animate={{ rotateX: flapOpen ? 180 : 0 }}
          transition={{ duration: 0.95, ease: [0.45, 0, 0.2, 1] }}
        >
          <svg
            viewBox="0 0 300 114"
            preserveAspectRatio="none"
            className="h-full w-full overflow-visible drop-shadow-[0_6px_5px_rgb(60_50_30/0.14)]"
          >
            <path d="M0 0 L150 114 L300 0 Z" fill="#f4eee3" stroke="rgb(120 105 80 / 0.1)" strokeWidth="0.6" />
          </svg>
        </motion.div>

        {/* vosková pečať – pri otvorení sa rozlomí na dve polovice */}
        <div
          className="absolute top-[57%] left-1/2 aspect-square w-[21%] -translate-x-1/2 -translate-y-1/2"
          style={{ zIndex: 5 }}
        >
          {/* celá pečať, kým je obálka zatvorená */}
          {closed && <Seal id="seal-whole" />}
          {/* na mobile jemne pulzujúci kruh okolo pečate – náznak, že sa dá ťuknúť */}
          {closed && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-[6%] rounded-full border border-sage-dark/40 motion-safe:animate-[seal-pulse_2.2s_ease-out_infinite] sm:hidden"
            />
          )}
          {/* po otvorení dve polovice, ktoré sa rozletia */}
          {!closed &&
            (['left', 'right'] as const).map((side) => {
              const dir = side === 'left' ? -1 : 1;
              return (
                <motion.div
                  key={side}
                  className="absolute inset-0"
                  style={{
                    clipPath:
                      side === 'left'
                        ? 'polygon(0 0, 52% 0, 47% 100%, 0 100%)'
                        : 'polygon(52% 0, 100% 0, 100% 100%, 47% 100%)',
                  }}
                  initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                  animate={{ x: `${dir * 45}%`, y: '30%', rotate: dir * 28, opacity: [1, 1, 0] }}
                  transition={{ duration: 0.75, ease, opacity: { duration: 0.75, times: [0, 0.5, 1] } }}
                >
                  <Seal id={`seal-${side}`} />
                </motion.div>
              );
            })}
        </div>
      </motion.div>

      <motion.div
        className="mt-10 flex flex-col items-center text-center sm:mt-12"
        animate={{ opacity: closed ? 1 : 0, y: closed ? 0 : 10 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-serif text-3xl text-ink sm:text-4xl">
          {firstName} <span className="text-gold italic">{wedding.couple.separator}</span> {secondName}
        </p>
        <p className="mt-2 text-[0.72rem] uppercase tracking-[0.3em] text-ink-soft">{longDate}</p>
        <button
          ref={buttonRef}
          type="button"
          onClick={open}
          disabled={!closed}
          // Na mobile je tlačidlo skryté (stačí ťuknúť na obálku), čítačky obrazovky ho však nájdu.
          className="group sr-only rounded-full border border-sage-dark/40 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-sage-dark transition-colors duration-500 hover:bg-sage-dark hover:text-ivory sm:not-sr-only sm:relative sm:mt-8 sm:inline-flex sm:min-h-12 sm:items-center sm:justify-center sm:px-8 sm:py-3"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-sage-dark/30 motion-safe:animate-[envelope-pulse_2.4s_ease-out_infinite]"
          />
          {envelope.openLabel}
        </button>
      </motion.div>
    </motion.div>
  );
}
