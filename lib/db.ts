import postgres from 'postgres';
import { initialEntries, initialPackingItems } from './data';
import type { Entry, PackingItem } from './types';

const g = globalThis as unknown as { _sql?: ReturnType<typeof postgres> };
export const sql = g._sql ?? postgres(process.env.DATABASE_URL!);
if (process.env.NODE_ENV !== 'production') g._sql = sql;

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS entries (
      id        TEXT PRIMARY KEY,
      kind      TEXT NOT NULL,
      title     TEXT NOT NULL,
      vendor    TEXT,
      ref       TEXT,
      start_at  TEXT NOT NULL,
      end_at    TEXT,
      city      TEXT NOT NULL,
      location  TEXT,
      pax       TEXT,
      price     NUMERIC,
      currency  TEXT,
      source    TEXT,
      raw       TEXT
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS packing_items (
      id      TEXT PRIMARY KEY,
      label   TEXT NOT NULL,
      grp     TEXT NOT NULL,
      packed  BOOLEAN NOT NULL DEFAULT FALSE
    )
  `;
}

export async function seedIfEmpty() {
  const [{ count: ec }] = await sql<[{ count: number }]>`
    SELECT COUNT(*)::int AS count FROM entries
  `;
  if (ec === 0) {
    for (const e of initialEntries) {
      await sql`
        INSERT INTO entries (id, kind, title, vendor, ref, start_at, end_at, city, location, pax, price, currency, source, raw)
        VALUES (
          ${e.id}, ${e.kind}, ${e.title},
          ${e.vendor ?? null}, ${e.ref ?? null},
          ${e.start}, ${e.end ?? null},
          ${e.city}, ${e.where ?? null}, ${e.pax ?? null},
          ${e.price ?? null}, ${e.currency ?? null},
          ${e.source ?? null}, ${e.raw ?? null}
        )
      `;
    }
  }

  const [{ count: pc }] = await sql<[{ count: number }]>`
    SELECT COUNT(*)::int AS count FROM packing_items
  `;
  if (pc === 0) {
    for (const p of initialPackingItems) {
      await sql`
        INSERT INTO packing_items (id, label, grp, packed)
        VALUES (${p.id}, ${p.label}, ${p.group}, ${p.packed})
      `;
    }
  }
}

type Row = Record<string, unknown>;

export function rowToEntry(r: Row): Entry {
  return {
    id: r.id as string,
    kind: r.kind as Entry['kind'],
    title: r.title as string,
    vendor:   r.vendor   != null ? String(r.vendor)   : undefined,
    ref:      r.ref      != null ? String(r.ref)      : undefined,
    start:    r.start_at as string,
    end:      r.end_at   != null ? String(r.end_at)   : undefined,
    city:     r.city as string,
    where:    r.location != null ? String(r.location) : undefined,
    pax:      r.pax      != null ? String(r.pax)      : undefined,
    price:    r.price    != null ? Number(r.price)    : undefined,
    currency: r.currency != null ? String(r.currency) : undefined,
    source:   r.source   != null ? String(r.source)   : undefined,
    raw:      r.raw      != null ? String(r.raw)      : undefined,
  };
}

export function rowToPackingItem(r: Row): PackingItem {
  return {
    id:     r.id as string,
    label:  r.label as string,
    group:  r.grp as string,
    packed: r.packed as boolean,
  };
}
