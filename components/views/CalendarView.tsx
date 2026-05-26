'use client';
import { useTrip } from '@/lib/store';
import { cities, days } from '@/lib/data';
import { sameDay, cityById } from '@/lib/helpers';
import type { Entry } from '@/lib/types';

function MonthGrid({ year, month, entries, onEdit }: {
  year: number; month: number; entries: Entry[]; onEdit: (e: Entry) => void;
}) {
  const now = new Date();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (firstDay + 6) % 7;

  const cells = Array.from({ length: offset + daysInMonth }, (_, i) => {
    const dayNum = i - offset + 1;
    if (dayNum < 1) return null;
    const date = new Date(year, month, dayNum);
    const dateStr = date.toISOString().slice(0, 10);
    const dayEs   = entries.filter(e => sameDay(e.start, date));
    const dayMeta = days.find(d => d.date === dateStr);
    const city    = dayMeta ? cityById(cities, dayMeta.city) : null;
    const isToday = sameDay(date, now);
    const inTrip  = dateStr >= '2026-06-16' && dateStr <= '2026-07-03';
    return { dayNum, date, dateStr, dayEs, dayMeta, city, isToday, inTrip };
  });

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2, marginBottom:6 }}>
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d =>
          <div key={d} className="mono muted" style={{ fontSize:10.5, textAlign:'center', padding:'4px 0' }}>{d}</div>
        )}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2 }}>
        {cells.map((cell, i) => {
          if (!cell) return <div key={i}/>;
          return (
            <div key={cell.dateStr} style={{
              minHeight:68, padding:6, borderRadius:8, fontSize:12,
              background: cell.isToday ? 'color-mix(in oklab,var(--accent) 12%,var(--paper))' : cell.inTrip ? 'var(--paper-2)' : 'transparent',
              border: cell.isToday ? '.5px solid var(--accent)' : '.5px solid var(--hair)',
            }}>
              <div className="mono" style={{ fontWeight: cell.isToday ? 600 : 400, color: cell.isToday ? 'var(--accent)' : 'var(--ink)', marginBottom:2 }}>{cell.dayNum}</div>
              {cell.city && <div style={{ fontSize:10, color:'var(--ink-3)', lineHeight:1.2 }}>{cell.city.flag}</div>}
              <div style={{ display:'flex', flexWrap:'wrap', gap:2, marginTop:3 }}>
                {cell.dayEs.slice(0,3).map(e => (
                  <div key={e.id} onClick={() => onEdit(e)} title={e.title}
                    style={{ width:6, height:6, borderRadius:'50%', background:'var(--accent)', cursor:'pointer', opacity:0.8 }}/>
                ))}
                {cell.dayEs.length > 3 && <span className="muted" style={{ fontSize:9 }}>+{cell.dayEs.length-3}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CalendarView({ onEdit }: { onEdit: (e: Entry) => void }) {
  const { state } = useTrip();
  const monthName = (m: number) => new Date(2026, m).toLocaleString('en-GB', { month: 'long' });

  return (
    <div className="fade-in" style={{ maxWidth:860, display:'flex', flexDirection:'column', gap:32 }}>
      {[5, 6].map(m => (
        <div key={m} className="card" style={{ padding:20 }}>
          <h2 className="serif" style={{ fontSize:26, margin:'0 0 16px' }}>{monthName(m)} 2026</h2>
          <MonthGrid year={2026} month={m} entries={state.entries} onEdit={onEdit}/>
        </div>
      ))}
    </div>
  );
}
