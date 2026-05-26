'use client';
import { useState, useEffect } from 'react';
import { cities } from '@/lib/data';
import { project } from '@/lib/helpers';
import { useTrip } from '@/lib/store';

const FERRY_PAIRS = new Set(['oslo→kiel', 'hir→krs']);

function isFerry(a: string, b: string) {
  return FERRY_PAIRS.has(`${a}→${b}`) || FERRY_PAIRS.has(`${b}→${a}`);
}

interface Charger { id: number; name: string; lat: number; lng: number; isTesla: boolean; kw: number; stalls: number; }

export function MapView() {
  const { state } = useTrip();
  const ocmKey = state.preferences.ocmApiKey ?? '';

  const [chargers, setChargers]       = useState<Charger[]>([]);
  const [loading, setLoading]         = useState(false);
  const [showTesla, setShowTesla]     = useState(true);
  const [showOtherCCS, setShowOther]  = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = `/api/chargers${ocmKey ? `?key=${encodeURIComponent(ocmKey)}` : ''}`;
    fetch(url)
      .then(r => r.json())
      .then((data: Charger[]) => setChargers(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [ocmKey]);

  const citiesWithEntries = new Set(state.entries.map(e => e.city));
  const visible = cities.filter(c => citiesWithEntries.has(c.id));
  const pts = visible.map(c => ({ ...project(c.lat, c.lng), id: c.id, name: c.name, flag: c.flag, label: c.label }));

  const segments: { x1:number; y1:number; x2:number; y2:number; ferry:boolean }[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    segments.push({ x1:pts[i].x, y1:pts[i].y, x2:pts[i+1].x, y2:pts[i+1].y, ferry:isFerry(visible[i].id, visible[i+1].id) });
  }

  const visibleChargers = chargers.filter(c => {
    const { x, y } = project(c.lat, c.lng);
    if (x < 0 || x > 1000 || y < 0 || y > 720) return false;
    return c.isTesla ? showTesla : showOtherCCS;
  });

  const toggle = (active: boolean, label: string, color: string, onClick: () => void) => (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 6,
      background: active ? color : 'var(--paper-2)',
      border: `.5px solid ${active ? color : 'var(--hair-2)'}`,
      borderRadius: 8, cursor: 'pointer', padding: '4px 10px',
      color: active ? '#fff' : 'var(--ink-3)', fontSize: 12, fontWeight: active ? 600 : 400,
      transition: 'all .15s',
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: active ? '#fff' : color, display: 'inline-block', flexShrink: 0 }}/>
      {label}
    </button>
  );

  return (
    <div className="fade-in card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '10px 16px', borderBottom: '.5px solid var(--hair)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: 'var(--ink-3)', marginRight: 4 }}>Chargers:</span>
        {toggle(showTesla,    'Tesla Supercharger', 'var(--sky)',    () => setShowTesla(v => !v))}
        {toggle(showOtherCCS, 'Other CCS 50 kW+',  'var(--accent)', () => setShowOther(v => !v))}
        {loading && <span style={{ fontSize: 11, color: 'var(--ink-3)', marginLeft: 4 }}>Loading…</span>}
        {!loading && chargers.length === 0 && (
          <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>
            No charger data — add an Open Charge Map key in Settings ⚙
          </span>
        )}
      </div>

      <svg viewBox="0 0 1000 720" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <rect width="1000" height="720" fill="var(--paper-2)"/>

        {segments.map((s, i) => {
          const mx = (s.x1 + s.x2) / 2;
          const my = (s.y1 + s.y2) / 2 - 20;
          return s.ferry
            ? <path key={i} d={`M ${s.x1} ${s.y1} Q ${mx} ${my} ${s.x2} ${s.y2}`}
                stroke="var(--sky)" strokeWidth="2" fill="none" strokeDasharray="8 5" opacity="0.7"/>
            : <path key={i} d={`M ${s.x1} ${s.y1} Q ${mx} ${my} ${s.x2} ${s.y2}`}
                stroke="var(--accent)" strokeWidth="2.5" fill="none" opacity="0.6"/>;
        })}

        {visibleChargers.map(c => {
          const { x, y } = project(c.lat, c.lng);
          const color = c.isTesla ? 'var(--sky)' : 'var(--accent)';
          return (
            <circle key={c.id} cx={x} cy={y} r="4" fill={color} opacity="0.75">
              <title>{c.name} · {c.kw > 0 ? `${c.kw} kW` : '?'}{c.stalls > 0 ? ` · ${c.stalls} stalls` : ''}</title>
            </circle>
          );
        })}

        {pts.map((p, i) => {
          const isEnd = visible[i].label === 'Start' || visible[i].label === 'Home';
          return (
            <g key={p.id}>
              <circle cx={p.x} cy={p.y} r={isEnd ? 10 : 7} fill={isEnd ? 'var(--accent)' : 'var(--ink)'} stroke="var(--paper)" strokeWidth="2"/>
              <text x={p.x + 12} y={p.y + 4} fontSize="11" fontFamily="var(--sans)" fill="var(--ink)" fontWeight="500">
                {p.flag} {p.name}
              </text>
              {p.label && (
                <text x={p.x + 12} y={p.y + 16} fontSize="9" fontFamily="var(--sans)" fill="var(--ink-3)">{p.label}</text>
              )}
            </g>
          );
        })}
      </svg>

      <div style={{ padding: '12px 16px', borderTop: '.5px solid var(--hair)', display: 'flex', gap: 20, fontSize: 12, flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><svg width="20" height="4"><line x1="0" y1="2" x2="20" y2="2" stroke="var(--accent)" strokeWidth="2.5"/></svg>Driving</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><svg width="20" height="4"><line x1="0" y1="2" x2="20" y2="2" stroke="var(--sky)" strokeWidth="2" strokeDasharray="6 4"/></svg>Ferry</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><svg width="10" height="10"><circle cx="5" cy="5" r="5" fill="var(--sky)" opacity="0.75"/></svg>Tesla SC</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><svg width="10" height="10"><circle cx="5" cy="5" r="5" fill="var(--accent)" opacity="0.75"/></svg>Other CCS</span>
        {chargers.length > 0 && <span style={{ color: 'var(--ink-3)', marginLeft: 'auto' }}>{chargers.length} chargers loaded</span>}
      </div>
    </div>
  );
}
