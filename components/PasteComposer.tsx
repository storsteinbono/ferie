'use client';
import { useState } from 'react';
import { Icon } from './Icon';
import { useTrip } from '@/lib/store';
import { cities } from '@/lib/data';
import type { Entry, EntryKind } from '@/lib/types';

type Stage = 'idle' | 'parsing' | 'done';
const KINDS: EntryKind[] = ['hotel','airbnb','ferry','activity','dining','note'];

function matchCity(name: string): string {
  if (!name) return cities[0].id;
  const l = name.toLowerCase();
  return cities.find(c => c.name.toLowerCase() === l || l.includes(c.name.toLowerCase()))?.id ?? cities[0].id;
}

const field: React.CSSProperties = { width:'100%', padding:'8px 10px', background:'var(--paper-2)', border:'.5px solid var(--hair-2)', borderRadius:8, color:'var(--ink)', fontSize:14 };
const label: React.CSSProperties = { fontSize:11, letterSpacing:'.08em', textTransform:'uppercase', display:'block', marginBottom:4, color:'var(--ink-3)' };

export function PasteComposer({ onClose }: { onClose: () => void }) {
  const { dispatch } = useTrip();
  const [stage, setStage] = useState<Stage>('idle');
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Entry>>({ kind:'hotel', title:'', start:'', city:cities[0].id, currency:'EUR' });

  const set = (k: keyof Entry, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  async function parse() {
    if (!text.trim()) return;
    setStage('parsing'); setError(null);
    try {
      const res  = await fetch('/api/parse', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ text }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Parse failed'); setStage('idle'); return; }
      const p = data.parsed;
      setForm({ kind:p.kind??'note', title:p.title??'', vendor:p.vendor??'', ref:p.ref??'',
        start:p.start??'', end:p.end??'', city:matchCity(p.city??''), where:p.where??'',
        pax:p.pax??'', price:p.price??undefined, currency:p.currency??'EUR', raw:text });
      setStage('done');
    } catch {
      setError('Network error — is Ollama reachable?'); setStage('idle');
    }
  }

  function save() {
    if (!form.title || !form.start || !form.city || !form.kind) return;
    dispatch({ type:'ADD_ENTRY', entry: { id:crypto.randomUUID(), kind:form.kind!, title:form.title!, start:form.start!, city:form.city!,
      ...(form.vendor&&{vendor:form.vendor}), ...(form.ref&&{ref:form.ref}), ...(form.end&&{end:form.end}),
      ...(form.where&&{where:form.where}), ...(form.pax&&{pax:form.pax}),
      ...(form.price!==undefined&&{price:form.price}), ...(form.currency&&{currency:form.currency}), ...(form.raw&&{raw:form.raw}) } });
    onClose();
  }

  return (
    <div className="scrim" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px 16px', borderBottom:'.5px solid var(--hair)' }}>
          <span className="serif" style={{ fontSize:22, display:'flex', alignItems:'center', gap:10 }}><Icon name="sparkle" size={18}/>Add booking</span>
          <button className="btn ghost sm" onClick={onClose}><Icon name="x" size={14}/></button>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>
          {stage === 'idle' && (
            <>
              <textarea value={text} onChange={e=>setText(e.target.value)}
                placeholder="Paste booking confirmation email or PDF text…"
                style={{ width:'100%', minHeight:160, padding:14, background:'var(--paper-2)', border:'.5px solid var(--hair-2)', borderRadius:12, fontFamily:'var(--mono)', fontSize:13, color:'var(--ink)', resize:'vertical' }} />
              {error && <p style={{ color:'#dc2626', fontSize:13, marginTop:8 }}>{error}</p>}
            </>
          )}
          {stage === 'parsing' && (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[220,160,100].map(w => <span key={w} className="shimmer" style={{ width:w, height:18 }}/>)}
              <p className="muted" style={{ fontSize:13, marginTop:4 }}>Parsing with Ollama…</p>
            </div>
          )}
          {stage === 'done' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px 20px' }}>
              <div style={{ gridColumn:'1/-1' }}>
                <span style={label}>Type</span>
                <select style={field} value={form.kind} onChange={e=>set('kind',e.target.value)}>
                  {KINDS.map(k=><option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <span style={label}>Title *</span>
                <input style={field} value={form.title??''} onChange={e=>set('title',e.target.value)}/>
              </div>
              <div><span style={label}>Vendor</span><input style={field} value={form.vendor??''} onChange={e=>set('vendor',e.target.value)}/></div>
              <div><span style={label}>Reference</span><input style={field} value={form.ref??''} onChange={e=>set('ref',e.target.value)}/></div>
              <div><span style={label}>Check-in *</span><input type="datetime-local" style={field} value={form.start??''} onChange={e=>set('start',e.target.value)}/></div>
              <div><span style={label}>Check-out</span><input type="datetime-local" style={field} value={form.end??''} onChange={e=>set('end',e.target.value)}/></div>
              <div style={{ gridColumn:'1/-1' }}>
                <span style={label}>City *</span>
                <select style={field} value={form.city} onChange={e=>set('city',e.target.value)}>
                  {cities.map(c=><option key={c.id} value={c.id}>{c.flag} {c.name}</option>)}
                </select>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <span style={label}>Address / Venue</span>
                <input style={field} value={form.where??''} onChange={e=>set('where',e.target.value)}/>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <span style={label}>Guests / Notes</span>
                <input style={field} value={form.pax??''} onChange={e=>set('pax',e.target.value)}/>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <div style={{ flex:1 }}><span style={label}>Price</span><input type="number" style={field} value={form.price??''} onChange={e=>set('price',e.target.value?Number(e.target.value):undefined)}/></div>
                <div style={{ width:70 }}><span style={label}>CCY</span><input style={field} value={form.currency??''} onChange={e=>set('currency',e.target.value)}/></div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display:'flex', gap:10, justifyContent:'flex-end', padding:'16px 24px', borderTop:'.5px solid var(--hair)' }}>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          {stage==='idle' && <button className="btn accent" onClick={parse} disabled={!text.trim()}><Icon name="sparkle" size={14}/>Parse booking</button>}
          {stage==='done' && <button className="btn accent" onClick={save}><Icon name="check" size={14}/>Add to trip</button>}
        </div>
      </div>
    </div>
  );
}
