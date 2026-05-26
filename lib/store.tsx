'use client';
import { createContext, useCallback, useContext, useEffect, useReducer, type ReactNode } from 'react';
import type { TripState, Action, Preferences } from './types';

const defaultPrefs: Preferences = { theme: 'paper', accent: 'tomato', density: 'regular' };

function loadPrefs(): Preferences {
  if (typeof window === 'undefined') return defaultPrefs;
  try {
    const s = localStorage.getItem('ferie-prefs');
    return s ? { ...defaultPrefs, ...(JSON.parse(s) as Partial<Preferences>) } : defaultPrefs;
  } catch { return defaultPrefs; }
}

export function reducer(state: TripState, action: Action): TripState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, entries: action.entries, packingItems: action.packingItems };
    case 'ADD_ENTRY':
      return { ...state, entries: [...state.entries, action.entry] };
    case 'UPDATE_ENTRY':
      return { ...state, entries: state.entries.map(e => e.id === action.entry.id ? action.entry : e) };
    case 'DELETE_ENTRY':
      return { ...state, entries: state.entries.filter(e => e.id !== action.id) };
    case 'TOGGLE_PACKING':
      return { ...state, packingItems: state.packingItems.map(p => p.id === action.id ? { ...p, packed: !p.packed } : p) };
    case 'ADD_PACKING':
      return { ...state, packingItems: [...state.packingItems, action.item] };
    case 'UPDATE_PACKING':
      return { ...state, packingItems: state.packingItems.map(p => p.id === action.id ? { ...p, label: action.label, group: action.group } : p) };
    case 'DELETE_PACKING':
      return { ...state, packingItems: state.packingItems.filter(p => p.id !== action.id) };
    case 'SET_PREF': {
      const prefs = { ...state.preferences, [action.key]: action.value };
      if (typeof window !== 'undefined') localStorage.setItem('ferie-prefs', JSON.stringify(prefs));
      return { ...state, preferences: prefs };
    }
    default:
      return state;
  }
}

async function syncToApi(action: Action): Promise<void> {
  switch (action.type) {
    case 'ADD_ENTRY':
      await fetch('/api/entries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(action.entry) });
      break;
    case 'UPDATE_ENTRY':
      await fetch(`/api/entries/${action.entry.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(action.entry) });
      break;
    case 'DELETE_ENTRY':
      await fetch(`/api/entries/${action.id}`, { method: 'DELETE' });
      break;
    case 'TOGGLE_PACKING':
      await fetch(`/api/packing/${action.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ toggle: true }) });
      break;
    case 'ADD_PACKING':
      await fetch('/api/packing', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(action.item) });
      break;
    case 'UPDATE_PACKING':
      await fetch(`/api/packing/${action.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ label: action.label, group: action.group }) });
      break;
    case 'DELETE_PACKING':
      await fetch(`/api/packing/${action.id}`, { method: 'DELETE' });
      break;
  }
}

const Ctx = createContext<{ state: TripState; dispatch: React.Dispatch<Action> } | null>(null);

export function TripProvider({ children }: { children: ReactNode }) {
  const [state, localDispatch] = useReducer(
    reducer,
    { entries: [], packingItems: [], preferences: defaultPrefs },
    (s) => ({ ...s, preferences: loadPrefs() }),
  );

  useEffect(() => {
    Promise.all([
      fetch('/api/entries').then(r => r.json()),
      fetch('/api/packing').then(r => r.json()),
    ]).then(([entries, packingItems]: [unknown, unknown]) => {
      localDispatch({ type: 'HYDRATE', entries: entries as TripState['entries'], packingItems: packingItems as TripState['packingItems'] });
    }).catch(console.error);
  }, []);

  const dispatch: React.Dispatch<Action> = useCallback((action: Action) => {
    localDispatch(action);
    void syncToApi(action).catch(console.error);
  }, []);

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useTrip() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTrip must be used within TripProvider');
  return ctx;
}
