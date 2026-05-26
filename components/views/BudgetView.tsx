'use client';
import { useTrip } from '@/lib/store';
import { budgetCats, days, TRIP_META } from '@/lib/data';
import { toNOK } from '@/lib/helpers';

const KIND_TO_CAT: Record<string, string> = {
  hotel:'stay', airbnb:'stay', ferry:'travel', dining:'food', activity:'do', note:'do',
};

export function BudgetView() {
  const { state } = useTrip();
  const entries = state.entries;

  const actual: Record<string, number> = {};
  for (const e of entries) {
    if (!e.price || e.price <= 0) continue;
    const cat = KIND_TO_CAT[e.kind] ?? 'do';
    actual[cat] = (actual[cat] ?? 0) + toNOK(e.price, e.currency);
  }

  const totalActual  = Object.values(actual).reduce((a, b) => a + b, 0);
  const budgetNOK    = toNOK(TRIP_META.budget, TRIP_META.currency);
  const totalPlanned = budgetCats.reduce((a, c) => a + toNOK(c.planned, TRIP_META.currency), 0);

  const dailyTotals = days.map(d => {
    return entries.filter(e => e.start.startsWith(d.date)).reduce((s, e) => s + toNOK(e.price ?? 0, e.currency), 0);
  });
  const maxDaily = Math.max(...dailyTotals, 1);
  const sparkW = 200; const sparkH = 36;
  const pts = dailyTotals.map((v, i) => {
    const x = (i / (dailyTotals.length - 1)) * sparkW;
    const y = sparkH - (v / maxDaily) * sparkH;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="fade-in" style={{ maxWidth:680, display:'flex', flexDirection:'column', gap:20 }}>
      <div className="card" style={{ padding:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
          <div>
            <div className="muted" style={{ fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:4 }}>Total budget</div>
            <div className="serif" style={{ fontSize:36 }}>kr {budgetNOK.toLocaleString('nb-NO')}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div className="muted" style={{ fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:4 }}>Committed</div>
            <div className="mono" style={{ fontSize:22 }}>kr {Math.round(totalActual).toLocaleString('nb-NO')}</div>
            <div className="muted" style={{ fontSize:12 }}>of kr {totalPlanned.toLocaleString('nb-NO')} planned</div>
          </div>
        </div>
        <div style={{ height:8, background:'var(--paper-3)', borderRadius:4, overflow:'hidden', marginBottom:20 }}>
          <div style={{ height:'100%', width:`${Math.min(100,(totalActual/budgetNOK)*100)}%`, background:'var(--accent)', borderRadius:4, transition:'width .4s' }}/>
        </div>
        {dailyTotals.some(v => v > 0) && (
          <div>
            <div className="muted" style={{ fontSize:11, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:6 }}>Daily spend</div>
            <svg width={sparkW} height={sparkH} style={{ overflow:'visible' }}>
              <polyline points={pts} fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>

      {budgetCats.map(cat => {
        const spent    = actual[cat.id] ?? 0;
        const plannedNOK = toNOK(cat.planned, TRIP_META.currency);
        const pct      = Math.min(100, (spent / plannedNOK) * 100);
        const over     = spent > plannedNOK;
        return (
          <div key={cat.id} className="card" style={{ padding:18 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontWeight:500 }}>{cat.label}</span>
              <div style={{ textAlign:'right' }}>
                <span className="mono" style={{ fontSize:15, color: over ? '#dc2626' : 'var(--ink)' }}>kr {Math.round(spent).toLocaleString('nb-NO')}</span>
                <span className="muted" style={{ fontSize:12 }}> / kr {plannedNOK.toLocaleString('nb-NO')}</span>
              </div>
            </div>
            <div style={{ height:6, background:'var(--paper-3)', borderRadius:3, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${pct}%`, background:`var(${cat.color})`, borderRadius:3, transition:'width .4s' }}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}
