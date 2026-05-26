import { NextResponse } from 'next/server';
import { sql, initDb, seedIfEmpty, rowToPackingItem } from '@/lib/db';
import type { PackingItem } from '@/lib/types';

export async function GET() {
  await initDb();
  await seedIfEmpty();
  const rows = await sql`SELECT * FROM packing_items ORDER BY grp, label`;
  return NextResponse.json(rows.map(rowToPackingItem));
}

export async function POST(req: Request) {
  await initDb();
  const p: PackingItem = await req.json();
  await sql`
    INSERT INTO packing_items (id, label, grp, packed)
    VALUES (${p.id}, ${p.label}, ${p.group}, ${p.packed})
  `;
  return NextResponse.json(p, { status: 201 });
}
