'use client';
import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { TripState, Action, Preferences } from './types';
import { initialEntries, initialPackingItems } from './data';

const defaultPrefs: Preferences = { theme: 'paper', accent: 'tomato', density: 'regular' };

const initialState: TripState = {
  entries: initialEntries,
  packingItems: initialPackingItems,
  preferences: defaultPrefs,
};

export function reducer(state: TripState, action: Action): TripState {
  switch (action.type) {
    case 'ADD_ENTRY':
      return { ...state, entries: [...state.entries, action.entry] };
    case 'UPDATE_ENTRY':
      return { ...state, entries: state.entries.map(e => e.id === action.entry.id ? action.entry : e) };
    case 'DELETE_ENTRY':
      return { ...state, entries: state.entries.filter(e => e.id !== action.id) };
    case 'TOGGLE_PACKING':
      return { ...state, packingItems: state.packingItems.map(p => p.id === action.id ? { ...p, packed: !p.packed } : p) };
    case 'SET_PREF':
      return { ...state, preferences: { ...state.preferences, [action.key]: action.value } };
    default:
      return state;
  }
}

const Ctx = createContext<{ state: TripState; dispatch: React.Dispatch<Action> } | null>(null);

export function TripProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useTrip() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTrip must be used within TripProvider');
  return ctx;
}
