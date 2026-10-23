/**
 * Práca s dátumami v časovom pásme svadby – bez externých knižníc.
 * Miestny čas ("2027-06-20T15:00") + IANA pásmo → presný okamih (Date).
 */

function parseLocal(local: string) {
  const [datePart, timePart = '00:00'] = local.split('T');
  const [y, m, d] = datePart.split('-').map(Number);
  const [hh, mm, ss = 0] = timePart.split(':').map(Number);
  return { y, m, d, hh, mm, ss };
}

/** Rozdiel (v ms) medzi miestnym časom v danom pásme a UTC v danom okamihu. */
function timeZoneOffset(timestamp: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(timestamp));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  return asUtc - Math.floor(timestamp / 1000) * 1000;
}

/** Prevedie miestny čas v zadanom pásme na skutočný okamih. Správne zvláda letný/zimný čas. */
export function zonedTimeToDate(local: string, timeZone: string): Date {
  const { y, m, d, hh, mm, ss } = parseLocal(local);
  const guess = Date.UTC(y, m - 1, d, hh, mm, ss);
  const offset = timeZoneOffset(guess, timeZone);
  let ts = guess - offset;
  const offset2 = timeZoneOffset(ts, timeZone);
  if (offset2 !== offset) ts = guess - offset2;
  return new Date(ts);
}

/** „20. júna 2027“ */
export function formatLongDate(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('sk-SK', { day: 'numeric', month: 'long', year: 'numeric', timeZone }).format(date);
}

/** „nedeľa“ */
export function formatWeekday(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('sk-SK', { weekday: 'long', timeZone }).format(date);
}

/** „20 · 06 · 2027“ */
export function formatShortDate(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('sk-SK', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone,
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('day')} · ${get('month')} · ${get('year')}`;
}

/** Dátum vo formáte RRRR-MM-DD (bez času) zobrazený po slovensky. */
export function formatPlainDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Intl.DateTimeFormat('sk-SK', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y, m - 1, d)),
  );
}

const pluralRules = new Intl.PluralRules('sk-SK');

/** Slovenské skloňovanie podľa počtu: [1, 2 – 4, 5+] → „deň / dni / dní“. */
export function plural(n: number, forms: [one: string, few: string, many: string]): string {
  const rule = pluralRules.select(n);
  if (rule === 'one') return forms[0];
  if (rule === 'few') return forms[1];
  return forms[2];
}
