import { NextResponse } from 'next/server';

interface OCMConnection {
  ConnectionTypeID: number;
  PowerKW: number | null;
  Quantity: number | null;
}

interface OCMStation {
  ID: number;
  AddressInfo: { Title: string; Latitude: number; Longitude: number } | null;
  OperatorInfo: { Title: string } | null;
  Connections: OCMConnection[] | null;
  NumberOfPoints: number | null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key') ?? '';

  const params = new URLSearchParams({
    output: 'json',
    connectiontypeid: '33',   // CCS Type 2 Combo (used by Tesla SC in Europe)
    minpowerkw: '50',
    maxresults: '800',
    compact: 'false',
    verbose: 'false',
    latitude: '53',
    longitude: '8',
    distance: '1500',
    distanceunit: 'km',
  });
  if (key) params.set('key', key);

  const res = await fetch(`https://api.openchargemap.io/v3/poi/?${params}`);
  if (!res.ok) return NextResponse.json({ error: 'OCM API error' }, { status: res.status });

  const stations: OCMStation[] = await res.json();

  const chargers = stations
    .filter(s => s.AddressInfo?.Latitude && s.AddressInfo?.Longitude)
    .map(s => ({
      id: s.ID,
      name: s.AddressInfo!.Title,
      lat: s.AddressInfo!.Latitude,
      lng: s.AddressInfo!.Longitude,
      isTesla: (s.OperatorInfo?.Title ?? '').toLowerCase().includes('tesla'),
      kw: Math.max(0, ...(s.Connections ?? []).map(c => c.PowerKW ?? 0)),
      stalls: s.NumberOfPoints ?? (s.Connections ?? []).reduce((n, c) => n + (c.Quantity ?? 1), 0),
    }));

  return NextResponse.json(chargers);
}
