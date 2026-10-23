import { createContext, useContext } from 'react';

/**
 * Či je úvod pripravený na animácie. Kým je zobrazená obálka, úvodná sekcia
 * čaká (false) a svoje animácie spustí až po otvorení pozvánky.
 */
export const IntroContext = createContext(true);

export function useIntroReady(): boolean {
  return useContext(IntroContext);
}
