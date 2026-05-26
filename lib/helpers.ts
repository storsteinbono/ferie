import type { City, Entry } from './types';

// Approximate mid-2026 exchange rates to NOK
export const FX: Record<string, number> = {
  NOK: 1, EUR: 11.80, CHF: 13.20, DKK: 1.58, USD: 10.80, GBP: 14.90,
};

export function toNOK(price: number, currency = 'EUR'): number {
  return Math.round(price * (FX[currency] ?? 1));
}

export function fmtNOK(price: number, currency = 'EUR'): string {
  return 'kr ' + toNOK(price, currency).toLocaleString('nb-NO');
}

export function ymd(s: string | Date): Date {
  if (s instanceof Date) return s;
  return new Date(s.length === 10 ? s + 'T00:00' : s);
}

export function fmtDate(s: string | Date): string {
  return ymd(s).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function fmtTime(s: string | Date): string {
  return ymd(s).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function sameDay(a: string | Date, b: string | Date): boolean {
  return ymd(a).toDateString() === ymd(b).toDateString();
}

export function daysBetween(a: string | Date, b: string | Date): number {
  return Math.round(Math.abs(ymd(b).getTime() - ymd(a).getTime()) / 86_400_000);
}

// Equirectangular projection. PROJ: lng [-2..18] → x [0..1000], lat [44..62] → y [720..0]
export function project(lat: number, lng: number): { x: number; y: number } {
  return {
    x: ((lng + 2) / 20) * 1000,
    y: ((62 - lat) / 18) * 720,
  };
}

export function cityById(cities: City[], id: string): City | undefined {
  return cities.find(c => c.id === id);
}

export function groupByDate(entries: Entry[]): Map<string, Entry[]> {
  const map = new Map<string, Entry[]>();
  for (const e of [...entries].sort((a, b) => a.start.localeCompare(b.start))) {
    const key = e.start.slice(0, 10);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(e);
  }
  return map;
}
