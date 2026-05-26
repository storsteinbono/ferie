'use client';
import { useTrip } from '@/lib/store';
import { cities, days } from '@/lib/data';
import { sameDay, fmtDate, cityById } from '@/lib/helpers';
import { EntryCard } from '@/components/EntryCard';
import type { Entry } from '@/lib/types';

export function TodayView({ onEdit }: { onEdit: (e: Entry) => void }) {
  const { state } = useTrip();
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  const dayMeta = days.find(d => d.date === todayStr);
  const city    = dayMeta ? cityById(cities, dayMeta.city) : null;
  const density = state.preferences.density;

  const active   = state.entries.filter(e => new Date(e.start) <= now && !!e.end && new Date(e.end!) >= now);
  const todayEs  = state.entries.filter(e => sameDay(e.start, now) && !active.find(a => a.id === e.id));
  const upcoming = state.entries.filter(e => new Date(e.start) > now).sort((a,b) => a.start.localeCompare(b.start)).slice(0,3);

  return (
    <div className="fade-in" style={{ maxWidth:780 }}>
      <div style={{ marginBottom:28 }}>
        <div className="muted" style={{ fontSize:13, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:6 }}>Today · {fmtDate(now)}</div>
        <h1 className="serif" style={{ fontSize:38, margin:0, lineHeight:1.1 }}>{dayMeta?.title ?? 'No itinerary for today'}</h1>
        {city && <p className="muted" style={{ marginTop:6, fontSize:15 }}>{city.flag} {city.name}, {city.country}{dayMeta?.note ? ` · ${dayMeta.note}` : ''}</p>}
      </div>

      {active.length > 0 && (
        <section style={{ marginBottom:24 }}>
          <div className="muted" style={{ fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:12 }}>Active stay</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {active.map(e => <EntryCard key={e.id} entry={e} density={density} onEdit={onEdit}/>)}
          </div>
        </section>
      )}

      {todayEs.length > 0 && (
        <section style={{ marginBottom:24 }}>
          <div className="muted" style={{ fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:12 }}>Today</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {todayEs.map(e => <EntryCard key={e.id} entry={e} density={density} onEdit={onEdit}/>)}
          </div>
        </section>
      )}

      {!dayMeta && active.length === 0 && todayEs.length === 0 && (
        <div className="card" style={{ padding:32, textAlign:'center' }}>
          <p className="serif" style={{ fontSize:22, marginBottom:8 }}>Not on the road yet</p>
          <p className="muted" style={{ fontSize:14 }}>Trip starts {fmtDate('2026-06-16')} · {days.length} days of adventure ahead</p>
        </div>
      )}

      {upcoming.length > 0 && (
        <section>
          <div className="muted" style={{ fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:12 }}>Coming up</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {upcoming.map(e => <EntryCard key={e.id} entry={e} density={density} onEdit={onEdit}/>)}
          </div>
        </section>
      )}
    </div>
  );
}
