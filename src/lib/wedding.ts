import { wedding } from '../config/wedding';
import { zonedTimeToDate, formatLongDate, formatWeekday, formatShortDate } from './date';
import type { CalendarEvent } from './calendar';

/** Odvodené (vypočítané) údaje z konfigurácie, zdieľané naprieč komponentmi. */
export const weddingStart = zonedTimeToDate(wedding.date.start, wedding.date.timeZone);
export const weddingEnd = zonedTimeToDate(wedding.date.end, wedding.date.timeZone);

export const coupleNames = `${wedding.couple.bride} ${wedding.couple.separator} ${wedding.couple.groom}`;
export const longDate = formatLongDate(weddingStart, wedding.date.timeZone);
export const weekday = formatWeekday(weddingStart, wedding.date.timeZone);
export const shortDate = formatShortDate(weddingStart, wedding.date.timeZone);

export const calendarEvent: CalendarEvent = {
  title: wedding.details.calendar.eventTitle,
  description: wedding.details.calendar.eventDescription,
  location: `${wedding.details.ceremony.name}, ${wedding.details.ceremony.address}`,
  start: weddingStart,
  end: weddingEnd,
  timeZone: wedding.date.timeZone,
  url: wedding.seo.siteUrl || undefined,
};

/** Je sekcia zapnutá v konfigurácii? (Úvod, Svadba a záver sú vždy viditeľné.) */
export function isSectionVisible(id: string): boolean {
  const map: Record<string, boolean> = {
    'nas-pribeh': wedding.sections.story,
    harmonogram: wedding.sections.schedule,
    fotogaleria: wedding.sections.gallery,
    informacie: wedding.sections.info,
    dary: wedding.sections.gifts,
    rsvp: wedding.sections.rsvp,
  };
  return map[id] ?? true;
}
