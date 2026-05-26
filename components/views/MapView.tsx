'use client';
import { cities, chargers } from '@/lib/data';
import { project } from '@/lib/helpers';
import { useTrip } from '@/lib/store';

const FERRY_PAIRS = new Set(['oslo→kiel', 'hir→krs']);

function isFerry(a: string, b: string) {
  return FERRY_PAIRS.has(`${a}→${b}`) || FERRY_PAIRS.has(`${b}→${a}`);
}

export function MapView() {
  const { state } = useTrip();

  const citiesWithEntries = new Set(state.entries.map(e => e.city));
  const visible = cities.filter(c => citiesWithEntries.has(c.id));
  const pts = visible.map(c => ({ ...project(c.lat, c.lng), id: c.id, name: c.name, flag: c.flag, label: c.label }));

  const segments: { x1:number; y1:number; x2:number; y2:number; ferry:boolean }[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    segments.push({ x1:pts[i].x, y1:pts[i].y, x2:pts[i+1].x, y2:pts[i+1].y, ferry:isFerry(visible[i].id, visible[i+1].id) });
  }

  return (
    <div className="fade-in card" style={{ padding:0, overflow:'hidden' }}>
      <svg viewBox="0 0 1000 720" style={{ width:'100%', height:'auto', display:'block' }}>
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

        {chargers.map(sc => {
          const { x, y } = project(sc.lat, sc.lng);
          return <circle key={sc.name} cx={x} cy={y} r="5" fill="var(--sky)" opacity="0.7">
            <title>{sc.name} · {sc.stalls} stalls · {sc.kw} kW</title>
          </circle>;
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
      <div style={{ padding:'12px 16px', borderTop:'.5px solid var(--hair)', display:'flex', gap:20, fontSize:12 }}>
        <span style={{ display:'flex', alignItems:'center', gap:6 }}><svg width="20" height="4"><line x1="0" y1="2" x2="20" y2="2" stroke="var(--accent)" strokeWidth="2.5"/></svg>Driving</span>
        <span style={{ display:'flex', alignItems:'center', gap:6 }}><svg width="20" height="4"><line x1="0" y1="2" x2="20" y2="2" stroke="var(--sky)" strokeWidth="2" strokeDasharray="6 4"/></svg>Ferry</span>
        <span style={{ display:'flex', alignItems:'center', gap:6 }}><svg width="10" height="10"><circle cx="5" cy="5" r="5" fill="var(--sky)" opacity="0.7"/></svg>Supercharger</span>
      </div>
    </div>
  );
}
