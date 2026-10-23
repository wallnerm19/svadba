import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { wedding } from '../config/wedding';
import { useCountdown } from '../hooks/useCountdown';
import { plural } from '../lib/date';
import { weddingStart } from '../lib/wedding';

const units = [
  { key: 'days', forms: ['deň', 'dni', 'dní'] },
  { key: 'hours', forms: ['hodina', 'hodiny', 'hodín'] },
  { key: 'minutes', forms: ['minúta', 'minúty', 'minút'] },
  { key: 'seconds', forms: ['sekunda', 'sekundy', 'sekúnd'] },
] as const;

function Digit({ value }: { value: string }) {
  const reduce = useReducedMotion();
  return (
    <span className="relative inline-flex h-[1.1em] overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={reduce ? { opacity: 0 } : { y: '-100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: '100%', opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Živý odpočet do začiatku svadby (správne podľa časového pásma svadby). */
export function Countdown() {
  const time = useCountdown(weddingStart);

  if (time.done) {
    return (
      <div className="text-center">
        <p className="font-serif text-4xl text-ivory italic sm:text-5xl">{wedding.countdown.afterTitle}</p>
        <p className="mx-auto mt-3 max-w-md text-sm text-ivory/85 sm:text-base">{wedding.countdown.afterMessage}</p>
      </div>
    );
  }

  const label = `${wedding.countdown.title}: ${units
    .map((u) => `${time[u.key]} ${plural(time[u.key], [...u.forms])}`)
    .join(', ')}`;

  return (
    <div className="text-center">
      <p className="text-[0.65rem] font-medium uppercase tracking-[0.32em] text-ivory/80">{wedding.countdown.title}</p>
      {/* Čítačkám obrazovky stačí jednorazový popis, nie zmena každú sekundu. */}
      <p className="sr-only">{label}</p>
      <div className="mt-4 flex items-stretch justify-center" aria-hidden="true">
        {units.map((u, i) => {
          const value = time[u.key];
          const text = u.key === 'days' ? String(value) : String(value).padStart(2, '0');
          return (
            <div key={u.key} className="flex items-stretch">
              {i > 0 && <span className="mx-3 w-px self-stretch bg-ivory/25 sm:mx-6" />}
              <div className="flex min-w-[3.4rem] flex-col items-center sm:min-w-[5rem]">
                <span className="flex font-serif text-[2.4rem] leading-none text-ivory tabular-nums sm:text-6xl">
                  {text.split('').map((d, idx) => (
                    <Digit key={`${u.key}-${text.length - idx}`} value={d} />
                  ))}
                </span>
                <span className="mt-2 text-[0.6rem] uppercase tracking-[0.22em] text-ivory/75 sm:text-[0.65rem]">
                  {plural(value, [...u.forms])}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
