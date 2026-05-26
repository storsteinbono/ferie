import { ymd, fmtDate, fmtTime, sameDay, daysBetween, project, cityById, groupByDate } from '@/lib/helpers';
import type { City, Entry } from '@/lib/types';

describe('ymd', () => {
  it('parses pure date without timezone shift', () => {
    const d = ymd('2026-06-22');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(5);
    expect(d.getDate()).toBe(22);
  });
  it('parses datetime string', () => {
    expect(ymd('2026-06-22T14:30').getHours()).toBe(14);
  });
  it('returns Date unchanged', () => {
    const d = new Date();
    expect(ymd(d)).toBe(d);
  });
});

describe('fmtDate', () => {
  it('returns a readable date string', () => {
    expect(fmtDate('2026-06-22')).toMatch(/22/);
  });
});

describe('fmtTime', () => {
  it('formats hours and minutes', () => {
    expect(fmtTime('2026-06-22T14:30')).toBe('14:30');
  });
});

describe('sameDay', () => {
  it('matches date to datetime on same day', () => {
    expect(sameDay('2026-06-22', '2026-06-22T23:59')).toBe(true);
  });
  it('rejects different days', () => {
    expect(sameDay('2026-06-22', '2026-06-23')).toBe(false);
  });
});

describe('daysBetween', () => {
  it('counts days', () => { expect(daysBetween('2026-06-22', '2026-06-25')).toBe(3); });
  it('is order-independent', () => { expect(daysBetween('2026-06-25', '2026-06-22')).toBe(3); });
});

describe('project', () => {
  // PROJ: lng [-2..18] → x [0..1000], lat [44..62] → y [720..0]
  // center: lng=8 → x=(8+2)/20*1000=500; lat=53 → y=(62-53)/18*720=360
  it('maps geographic center to SVG center', () => {
    expect(project(53, 8)).toEqual({ x: 500, y: 360 });
  });
  it('maps NW corner to (0,0)', () => {
    expect(project(62, -2)).toEqual({ x: 0, y: 0 });
  });
  it('maps SE corner to (1000,720)', () => {
    expect(project(44, 18)).toEqual({ x: 1000, y: 720 });
  });
});

describe('cityById', () => {
  const cs: City[] = [
    { id: 'paris', name: 'Paris', country: 'France', flag: '🇫🇷', lat: 48.85, lng: 2.35 },
  ];
  it('finds by id', () => { expect(cityById(cs, 'paris')?.name).toBe('Paris'); });
  it('returns undefined for unknown', () => { expect(cityById(cs, 'x')).toBeUndefined(); });
});

describe('groupByDate', () => {
  const entries: Entry[] = [
    { id: 'a', kind: 'hotel',  title: 'A', start: '2026-06-22T10:00', city: 'paris' },
    { id: 'b', kind: 'dining', title: 'B', start: '2026-06-22T20:00', city: 'paris' },
    { id: 'c', kind: 'hotel',  title: 'C', start: '2026-06-23T10:00', city: 'lyon'  },
  ];
  it('groups by date', () => {
    const map = groupByDate(entries);
    expect(map.get('2026-06-22')?.length).toBe(2);
    expect(map.get('2026-06-23')?.length).toBe(1);
  });
  it('sorts by start within group', () => {
    expect(groupByDate(entries).get('2026-06-22')![0].id).toBe('a');
  });
});
