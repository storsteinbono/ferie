import { reducer } from '@/lib/store';
import type { TripState, Entry } from '@/lib/types';

const makeEntry = (o: Partial<Entry> = {}): Entry => ({
  id: 'test-1', kind: 'hotel', title: 'Test Hotel',
  start: '2026-06-20T15:00', city: 'paris', ...o,
});

const base: TripState = {
  entries: [makeEntry()],
  packingItems: [{ id: 'p1', label: 'Passports', group: 'Documents', packed: false }],
  preferences: { theme: 'paper', accent: 'tomato', density: 'regular' },
};

test('ADD_ENTRY appends', () => {
  const s = reducer(base, { type: 'ADD_ENTRY', entry: makeEntry({ id: 'test-2' }) });
  expect(s.entries).toHaveLength(2);
  expect(s.entries[1].id).toBe('test-2');
});

test('UPDATE_ENTRY replaces by id', () => {
  const s = reducer(base, { type: 'UPDATE_ENTRY', entry: makeEntry({ title: 'Updated' }) });
  expect(s.entries[0].title).toBe('Updated');
  expect(s.entries).toHaveLength(1);
});

test('DELETE_ENTRY removes by id', () => {
  expect(reducer(base, { type: 'DELETE_ENTRY', id: 'test-1' }).entries).toHaveLength(0);
});

test('TOGGLE_PACKING flips packed', () => {
  const s1 = reducer(base, { type: 'TOGGLE_PACKING', id: 'p1' });
  expect(s1.packingItems[0].packed).toBe(true);
  const s2 = reducer(s1, { type: 'TOGGLE_PACKING', id: 'p1' });
  expect(s2.packingItems[0].packed).toBe(false);
});

test('SET_PREF updates key', () => {
  const s = reducer(base, { type: 'SET_PREF', key: 'theme', value: 'dusk' });
  expect(s.preferences.theme).toBe('dusk');
});
