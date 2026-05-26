import { NextResponse } from 'next/server';
import { sql, initDb, rowToPackingItem } from '@/lib/db';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  await initDb();
  const { id } = await params;
  const body: { toggle?: boolean; label?: string; group?: string } = await req.json();

  let rows;
  if (body.toggle) {
    rows = await sql`
      UPDATE packing_items SET packed = NOT packed WHERE id = ${id} RETURNING *
    `;
  } else {
    rows = await sql`
      UPDATE packing_items SET
        label = COALESCE(${body.label ?? null}, label),
        grp   = COALESCE(${body.group ?? null}, grp)
      WHERE id = ${id}
      RETURNING *
    `;
  }
  return NextResponse.json(rowToPackingItem(rows[0]));
}

export async function DELETE(_req: Request, { params }: Ctx) {
  await initDb();
  const { id } = await params;
  await sql`DELETE FROM packing_items WHERE id = ${id}`;
  return new NextResponse(null, { status: 204 });
}
