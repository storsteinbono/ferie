import { NextResponse } from 'next/server';
import { sql, initDb, seedIfEmpty, rowToEntry } from '@/lib/db';
import type { Entry } from '@/lib/types';

export async function GET() {
  await initDb();
  await seedIfEmpty();
  const rows = await sql`SELECT * FROM entries ORDER BY start_at`;
  return NextResponse.json(rows.map(rowToEntry));
}

export async function POST(req: Request) {
  await initDb();
  const e: Entry = await req.json();
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
  return NextResponse.json(e, { status: 201 });
}
