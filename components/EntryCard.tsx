'use client';
import { Icon } from './Icon';
import { fmtDate, fmtTime, daysBetween, cityById } from '@/lib/helpers';
import { cities } from '@/lib/data';
import type { Entry, Density } from '@/lib/types';

const KIND_META: Record<string, { label: string; icon: string; tint: string }> = {
  ferry:    { label:"Ferry",    icon:"⛴", tint:"sky"    },
  hotel:    { label:"Hotel",    icon:"✦", tint:"accent" },
  airbnb:   { label:"Airbnb",   icon:"✦", tint:"accent" },
  activity: { label:"Activity", icon:"◈", tint:"sage"   },
  dining:   { label:"Dining",   icon:"◉", tint:"sage"   },
  note:     { label:"Note",     icon:"•", tint:""       },
};

export function EntryCard({ entry, density = 'regular', onEdit }: {
  entry: Entry; density?: Density; onEdit?: (e: Entry) => void;
}) {
  const meta  = KIND_META[entry.kind] ?? KIND_META.note;
  const city  = cityById(cities, entry.city);
  const pad   = density === 'compact' ? 14 : 18;
  const titleSize = density === 'compact' ? 22 : 26;
  const nights = entry.end ? daysBetween(entry.start.slice(0,10), entry.end.slice(0,10)) : 0;
  const tintColor  = meta.tint === 'accent' ? 'var(--accent-2)' : meta.tint ? `var(--${meta.tint})` : 'var(--ink)';
  const tintBg     = meta.tint ? `color-mix(in oklab, var(--${meta.tint}) 14%, var(--paper))` : 'var(--paper-2)';
  const tintBorder = meta.tint ? `color-mix(in oklab, var(--${meta.tint}) 25%, transparent)` : 'var(--hair)';

  return (
    <div className="card" style={{ padding:pad, display:'grid', gridTemplateColumns:'56px 1fr auto', gap:14, alignItems:'start' }}>
      <div style={{ width:56, height:56, borderRadius:14, background:tintBg, border:`.5px solid ${tintBorder}`, color:tintColor, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>
        {meta.icon}
      </div>
      <div style={{ minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:4 }}>
          <span className={`pill ${meta.tint}`}>{meta.label}</span>
          {city && <span className="pill">{city.flag} {city.name}</span>}
          {entry.vendor && <span className="muted" style={{ fontSize:11.5 }}>via {entry.vendor}</span>}
        </div>
        <div className="serif" style={{ fontSize:titleSize, lineHeight:1.05, letterSpacing:'-.01em' }}>{entry.title}</div>
        {(entry.where || entry.pax) && (
          <div className="muted" style={{ fontSize:13, marginTop:6, lineHeight:1.45 }}>
            {entry.where}{entry.pax ? ` · ${entry.pax}` : ''}
          </div>
        )}
        <div style={{ display:'flex', gap:18, marginTop:10, flexWrap:'wrap', fontSize:12.5 }}>
          <div>
            <div className="muted" style={{ fontSize:10.5, letterSpacing:'.08em', textTransform:'uppercase' }}>
              {entry.kind === 'hotel' || entry.kind === 'airbnb' ? 'Check-in' : 'Departure'}
            </div>
            <div className="mono" style={{ marginTop:2 }}>{fmtDate(entry.start)} · {fmtTime(entry.start)}</div>
          </div>
          {entry.end && (
            <div>
              <div className="muted" style={{ fontSize:10.5, letterSpacing:'.08em', textTransform:'uppercase' }}>
                {entry.kind === 'hotel' || entry.kind === 'airbnb' ? 'Check-out' : 'Arrival'}
                {nights > 0 ? ` · ${nights}n` : ''}
              </div>
              <div className="mono" style={{ marginTop:2 }}>{fmtDate(entry.end)} · {fmtTime(entry.end)}</div>
            </div>
          )}
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6, paddingTop:4 }}>
        {entry.price !== undefined && entry.price > 0 && (
          <div className="mono" style={{ fontSize:15, fontWeight:500 }}>
            {entry.currency === 'EUR' ? '€' : entry.currency}{entry.price}
          </div>
        )}
        {onEdit && (
          <button className="btn ghost sm" onClick={() => onEdit(entry)} style={{ padding:'5px 8px' }}>
            <Icon name="edit" size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
