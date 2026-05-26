export type Theme   = 'paper' | 'dusk' | 'meadow' | 'dawn';
export type Accent  = 'tomato' | 'forest' | 'cobalt' | 'plum' | 'copper';
export type Density = 'compact' | 'regular' | 'comfy';
export type EntryKind = 'hotel' | 'airbnb' | 'ferry' | 'activity' | 'dining' | 'note';

export interface Entry {
  id: string;
  kind: EntryKind;
  title: string;
  vendor?: string;
  ref?: string;
  start: string;     // "YYYY-MM-DDTHH:mm"
  end?: string;
  city: string;      // city.id
  where?: string;
  pax?: string;
  price?: number;
  currency?: string;
  source?: string;
  raw?: string;
}

export interface City {
  id: string; name: string; country: string; flag: string;
  lat: number; lng: number; nights?: number; label?: string;
}

export interface Day {
  d: number; date: string; city: string; title: string; note?: string;
}

export interface Supercharger {
  name: string; lat: number; lng: number; stalls: number; kw: number;
}

export interface PackingItem {
  id: string; label: string; group: string; packed: boolean;
}

export interface BudgetCat {
  id: string; label: string; planned: number; color: string;
}

export interface Preferences {
  theme: Theme; accent: Accent; density: Density;
}

export interface TripState {
  entries: Entry[];
  packingItems: PackingItem[];
  preferences: Preferences;
}

export type Action =
  | { type: 'ADD_ENTRY';      entry: Entry }
  | { type: 'UPDATE_ENTRY';   entry: Entry }
  | { type: 'DELETE_ENTRY';   id: string }
  | { type: 'TOGGLE_PACKING'; id: string }
  | { type: 'ADD_PACKING';    item: PackingItem }
  | { type: 'UPDATE_PACKING'; id: string; label: string; group: string }
  | { type: 'DELETE_PACKING'; id: string }
  | { type: 'SET_PREF'; key: keyof Preferences; value: string };
