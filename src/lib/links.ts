import type { Venue } from '../types/wedding';

/** Navigácia v Google Maps k danému miestu (na mobile otvorí aplikáciu Mapy). */
export function mapsUrl(venue: Pick<Venue, 'name' | 'address' | 'mapsUrl'>): string {
  if (venue.mapsUrl) return venue.mapsUrl;
  const destination = encodeURIComponent(`${venue.name}, ${venue.address}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
}

/** Cesta k súboru v /public so správnym prefixom pre GitHub Pages (napr. /svadba/). */
export function asset(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  return import.meta.env.BASE_URL + path.replace(/^\/+/, '');
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

/** Je odkaz na formulár stále len ukážkový? */
export function isPlaceholderUrl(url: string): boolean {
  return !url || url.includes('VLOZTE');
}
