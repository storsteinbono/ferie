'use client';
import { useState, useRef, useEffect } from 'react';
import { useTrip } from '@/lib/store';
import type { PackingItem } from '@/lib/types';

function ItemRow({ item, isLast, dispatch }: {
  item: PackingItem; isLast: boolean;
  dispatch: React.Dispatch<import('@/lib/types').Action>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  function save() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== item.label)
      dispatch({ type: 'UPDATE_PACKING', id: item.id, label: trimmed, group: item.group });
    else setDraft(item.label);
    setEditing(false);
  }

  return (
    <div style={{
      display:'flex', alignItems:'center', gap:10, padding:'9px 4px',
      borderBottom: isLast ? 'none' : '.5px solid var(--hair)',
    }}>
      <input type="checkbox" checked={item.packed}
        onChange={() => dispatch({ type:'TOGGLE_PACKING', id:item.id })}
        style={{ width:16, height:16, accentColor:'var(--accent)', cursor:'pointer', flexShrink:0 }}/>
      {editing ? (
        <input ref={inputRef} value={draft} onChange={e => setDraft(e.target.value)}
          onBlur={save} onKeyDown={e => { if (e.key==='Enter') save(); if (e.key==='Escape') { setDraft(item.label); setEditing(false); } }}
          style={{ flex:1, fontSize:14, padding:'2px 6px', background:'var(--paper-2)', border:'.5px solid var(--hair-2)', borderRadius:6, color:'var(--ink)' }}/>
      ) : (
        <span onClick={() => setEditing(true)} style={{
          flex:1, fontSize:14, cursor:'text',
          textDecoration: item.packed ? 'line-through' : 'none',
          color: item.packed ? 'var(--ink-3)' : 'var(--ink)',
        }}>{item.label}</span>
      )}
      <button onClick={() => dispatch({ type:'DELETE_PACKING', id:item.id })}
        style={{ background:'none', border:'none', cursor:'pointer', color:'var(--ink-3)', fontSize:16, lineHeight:1, padding:'0 2px', flexShrink:0 }}
        title="Remove item">×</button>
    </div>
  );
}

function AddItemRow({ group, dispatch }: {
  group: string; dispatch: React.Dispatch<import('@/lib/types').Action>;
}) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  function add() {
    const trimmed = label.trim();
    if (trimmed) {
      dispatch({ type:'ADD_PACKING', item: { id: crypto.randomUUID(), label: trimmed, group, packed: false } });
      setLabel('');
    }
    setOpen(false);
  }

  if (!open) return (
    <button onClick={() => setOpen(true)}
      style={{ display:'flex', alignItems:'center', gap:6, marginTop:10, background:'none', border:'none', cursor:'pointer', color:'var(--ink-3)', fontSize:13, padding:'4px 0' }}>
      <span style={{ fontSize:18, lineHeight:1 }}>+</span> Add item
    </button>
  );

  return (
    <div style={{ display:'flex', gap:8, marginTop:10 }}>
      <input ref={inputRef} value={label} onChange={e => setLabel(e.target.value)}
        placeholder="New item…"
        onKeyDown={e => { if (e.key==='Enter') add(); if (e.key==='Escape') { setLabel(''); setOpen(false); } }}
        style={{ flex:1, fontSize:13, padding:'6px 10px', background:'var(--paper-2)', border:'.5px solid var(--hair-2)', borderRadius:8, color:'var(--ink)' }}/>
      <button onClick={add} className="btn accent sm">Add</button>
      <button onClick={() => { setLabel(''); setOpen(false); }} className="btn ghost sm">Cancel</button>
    </div>
  );
}

export function PackingView() {
  const { state, dispatch } = useTrip();
  const { packingItems } = state;

  const [addingGroup, setAddingGroup] = useState(false);
  const [newGroup, setNewGroup] = useState('');
  const groupInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (addingGroup) groupInputRef.current?.focus(); }, [addingGroup]);

  const groups = [...new Set(packingItems.map(p => p.group))];

  function addGroup() {
    const name = newGroup.trim();
    if (name && !groups.includes(name)) {
      dispatch({ type:'ADD_PACKING', item: { id: crypto.randomUUID(), label: 'New item', group: name, packed: false } });
    }
    setNewGroup(''); setAddingGroup(false);
  }

  return (
    <div className="fade-in" style={{ maxWidth:640, display:'flex', flexDirection:'column', gap:16 }}>
      {groups.map(group => {
        const items = packingItems.filter(p => p.group === group);
        const done  = items.filter(p => p.packed).length;
        return (
          <div key={group} className="card" style={{ padding:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <h2 className="serif" style={{ fontSize:22, margin:0 }}>{group}</h2>
              <span className="mono muted" style={{ fontSize:12 }}>{done}/{items.length}</span>
            </div>
            <div style={{ height:4, background:'var(--paper-3)', borderRadius:2, overflow:'hidden', marginBottom:14 }}>
              <div style={{ height:'100%', width:`${items.length ? (done/items.length)*100 : 0}%`, background:'var(--accent)', borderRadius:2, transition:'width .3s' }}/>
            </div>
            <div style={{ display:'flex', flexDirection:'column' }}>
              {items.map((item, i) => (
                <ItemRow key={item.id} item={item} isLast={i === items.length - 1} dispatch={dispatch}/>
              ))}
            </div>
            <AddItemRow group={group} dispatch={dispatch}/>
          </div>
        );
      })}

      {addingGroup ? (
        <div style={{ display:'flex', gap:8 }}>
          <input ref={groupInputRef} value={newGroup} onChange={e => setNewGroup(e.target.value)}
            placeholder="Group name…"
            onKeyDown={e => { if (e.key==='Enter') addGroup(); if (e.key==='Escape') { setNewGroup(''); setAddingGroup(false); } }}
            style={{ flex:1, fontSize:14, padding:'8px 12px', background:'var(--paper-2)', border:'.5px solid var(--hair-2)', borderRadius:10, color:'var(--ink)' }}/>
          <button onClick={addGroup} className="btn accent">Add group</button>
          <button onClick={() => { setNewGroup(''); setAddingGroup(false); }} className="btn ghost">Cancel</button>
        </div>
      ) : (
        <button onClick={() => setAddingGroup(true)}
          style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:'.5px solid var(--hair-2)', borderRadius:12, cursor:'pointer', color:'var(--ink-3)', fontSize:13, padding:'10px 16px', width:'fit-content' }}>
          <span style={{ fontSize:18, lineHeight:1 }}>+</span> Add group
        </button>
      )}
    </div>
  );
}
