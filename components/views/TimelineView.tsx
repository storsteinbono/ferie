'use client';
import { useTrip } from '@/lib/store';
import { cities, days } from '@/lib/data';
import { groupByDate, fmtDate, cityById } from '@/lib/helpers';
import { EntryCard } from '@/components/EntryCard';
import type { Entry } from '@/lib/types';

export function TimelineView({ onEdit }: { onEdit: (e: Entry) => void }) {
  const { state } = useTrip();
  const density = state.preferences.density;
  const grouped = groupByDate(state.entries);
  const sortedDates = [...grouped.keys()].sort();

  if (sortedDates.length === 0) {
    return <div className="card fade-in" style={{ padding:40, textAlign:'center' }}>
      <p className="serif muted" style={{ fontSize:22 }}>No bookings yet — paste one to get started</p>
    </div>;
  }

  return (
    <div className="fade-in" style={{ maxWidth:780, display:'flex', flexDirection:'column', gap:32 }}>
      {sortedDates.map(date => {
        const dayMeta = days.find(d => d.date === date);
        const city    = dayMeta ? cityById(cities, dayMeta.city) : null;
        return (
          <section key={date}>
            <div style={{ display:'flex', alignItems:'baseline', gap:12, marginBottom:14, borderBottom:'.5px solid var(--hair)', paddingBottom:10 }}>
              <span className="serif" style={{ fontSize:22 }}>{dayMeta?.title ?? fmtDate(date)}</span>
              {city && <span className="muted" style={{ fontSize:13 }}>{city.flag} {city.name}</span>}
              {dayMeta?.d && <span className="mono muted" style={{ fontSize:11.5 }}>Day {dayMeta.d}</span>}
            </div>
            {dayMeta?.note && <p className="muted" style={{ fontSize:13, marginBottom:14, marginTop:-6 }}>{dayMeta.note}</p>}
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {(grouped.get(date) ?? []).map(e => <EntryCard key={e.id} entry={e} density={density} onEdit={onEdit}/>)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
