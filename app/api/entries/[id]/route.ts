import { NextResponse } from 'next/server';
import { sql, initDb, rowToEntry } from '@/lib/db';
import type { Entry } from '@/lib/types';

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  await initDb();
  const { id } = await params;
  const e: Entry = await req.json();
  const rows = await sql`
    UPDATE entries SET
      kind     = ${e.kind},
      title    = ${e.title},
      vendor   = ${e.vendor ?? null},
      ref      = ${e.ref ?? null},
      start_at = ${e.start},
      end_at   = ${e.end ?? null},
      city     = ${e.city},
      location = ${e.where ?? null},
      pax      = ${e.pax ?? null},
      price    = ${e.price ?? null},
      currency = ${e.currency ?? null},
      source   = ${e.source ?? null},
      raw      = ${e.raw ?? null}
    WHERE id = ${id}
    RETURNING *
  `;
  return NextResponse.json(rowToEntry(rows[0]));
}

export async function DELETE(_req: Request, { params }: Ctx) {
  await initDb();
  const { id } = await params;
  await sql`DELETE FROM entries WHERE id = ${id}`;
  return new NextResponse(null, { status: 204 });
}
