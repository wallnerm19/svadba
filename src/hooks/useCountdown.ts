import { useEffect, useState } from 'react';

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** Cieľový okamih už nastal. */
  done: boolean;
}

function compute(target: number): CountdownState {
  const diff = Math.max(0, target - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    done: diff <= 0,
  };
}

/** Odpočet do daného okamihu, aktualizovaný každú sekundu (zarovnaný na celé sekundy). */
export function useCountdown(target: Date): CountdownState {
  const time = target.getTime();
  const [state, setState] = useState(() => compute(time));

  useEffect(() => {
    let timer: number;
    const tick = () => {
      const next = compute(time);
      setState(next);
      if (!next.done) timer = window.setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    };
    tick();
    return () => window.clearTimeout(timer);
  }, [time]);

  return state;
}
