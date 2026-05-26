'use client';
import { useState } from 'react';
import { Icon } from './Icon';
import { useTrip } from '@/lib/store';
import { cities } from '@/lib/data';
import type { Entry, EntryKind } from '@/lib/types';

const KINDS: EntryKind[] = ['hotel','airbnb','ferry','activity','dining','note'];
const field: React.CSSProperties = { width:'100%', padding:'8px 10px', background:'var(--paper-2)', border:'.5px solid var(--hair-2)', borderRadius:8, color:'var(--ink)', fontSize:14 };
const lbl: React.CSSProperties = { fontSize:11, letterSpacing:'.08em', textTransform:'uppercase', display:'block', marginBottom:4, color:'var(--ink-3)' };

export function EditModal({ entry, onClose }: { entry: Entry; onClose: () => void }) {
  const { dispatch } = useTrip();
  const [form, setForm] = useState<Entry>({ ...entry });
  const [showRaw, setShowRaw] = useState(false);
  const set = (k: keyof Entry, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  function save() {
    if (!form.title || !form.start || !form.city) return;
    dispatch({ type:'UPDATE_ENTRY', entry: form });
    onClose();
  }
  function remove() {
    dispatch({ type:'DELETE_ENTRY', id: entry.id });
    onClose();
  }

  return (
    <div className="scrim" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px 16px', borderBottom:'.5px solid var(--hair)' }}>
          <span className="serif" style={{ fontSize:22, display:'flex', alignItems:'center', gap:10 }}><Icon name="edit" size={18}/>Edit booking</span>
          <button className="btn ghost sm" onClick={onClose}><Icon name="x" size={14}/></button>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px 20px' }}>
            <div style={{ gridColumn:'1/-1' }}>
              <span style={lbl}>Type</span>
              <select style={field} value={form.kind} onChange={e=>set('kind',e.target.value)}>
                {KINDS.map(k=><option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div style={{ gridColumn:'1/-1' }}>
              <span style={lbl}>Title *</span>
              <input style={field} value={form.title} onChange={e=>set('title',e.target.value)}/>
            </div>
            <div><span style={lbl}>Vendor</span><input style={field} value={form.vendor??''} onChange={e=>set('vendor',e.target.value)}/></div>
            <div><span style={lbl}>Reference</span><input style={field} value={form.ref??''} onChange={e=>set('ref',e.target.value)}/></div>
            <div><span style={lbl}>Start *</span><input type="datetime-local" style={field} value={form.start} onChange={e=>set('start',e.target.value)}/></div>
            <div><span style={lbl}>End</span><input type="datetime-local" style={field} value={form.end??''} onChange={e=>set('end',e.target.value||undefined)}/></div>
            <div style={{ gridColumn:'1/-1' }}>
              <span style={lbl}>City *</span>
              <select style={field} value={form.city} onChange={e=>set('city',e.target.value)}>
                {cities.map(c=><option key={c.id} value={c.id}>{c.flag} {c.name}</option>)}
              </select>
            </div>
            <div style={{ gridColumn:'1/-1' }}><span style={lbl}>Address</span><input style={field} value={form.where??''} onChange={e=>set('where',e.target.value)}/></div>
            <div style={{ gridColumn:'1/-1' }}><span style={lbl}>Guests / Notes</span><input style={field} value={form.pax??''} onChange={e=>set('pax',e.target.value)}/></div>
            <div style={{ display:'flex', gap:8 }}>
              <div style={{ flex:1 }}><span style={lbl}>Price</span><input type="number" style={field} value={form.price??''} onChange={e=>set('price',e.target.value?Number(e.target.value):undefined)}/></div>
              <div style={{ width:70 }}><span style={lbl}>CCY</span><input style={field} value={form.currency??''} onChange={e=>set('currency',e.target.value)}/></div>
            </div>
          </div>
          {form.raw && (
            <details style={{ marginTop:16 }} open={showRaw} onToggle={e=>setShowRaw((e.target as HTMLDetailsElement).open)}>
              <summary className="muted" style={{ fontSize:12, cursor:'pointer', letterSpacing:'.05em' }}>Raw confirmation text</summary>
              <pre className="mono" style={{ marginTop:8, fontSize:12, padding:12, background:'var(--paper-2)', borderRadius:8, overflowX:'auto', whiteSpace:'pre-wrap' }}>{form.raw}</pre>
            </details>
          )}
        </div>

        <div style={{ display:'flex', gap:10, justifyContent:'space-between', padding:'16px 24px', borderTop:'.5px solid var(--hair)' }}>
          <button className="btn danger sm" onClick={remove}><Icon name="x" size={13}/>Delete</button>
          <div style={{ display:'flex', gap:10 }}>
            <button className="btn ghost" onClick={onClose}>Cancel</button>
            <button className="btn accent" onClick={save}><Icon name="check" size={14}/>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
