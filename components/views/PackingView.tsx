'use client';
import { useTrip } from '@/lib/store';

export function PackingView() {
  const { state, dispatch } = useTrip();
  const { packingItems } = state;

  const groups = [...new Set(packingItems.map(p => p.group))];

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
              <div style={{ height:'100%', width:`${(done/items.length)*100}%`, background:'var(--accent)', borderRadius:2, transition:'width .3s' }}/>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
              {items.map((item, i) => (
                <label key={item.id} style={{
                  display:'flex', alignItems:'center', gap:12, padding:'10px 4px', cursor:'pointer',
                  borderBottom: i < items.length-1 ? '.5px solid var(--hair)' : 'none',
                  textDecoration: item.packed ? 'line-through' : 'none',
                  color: item.packed ? 'var(--ink-3)' : 'var(--ink)',
                }}>
                  <input type="checkbox" checked={item.packed}
                    onChange={() => dispatch({ type:'TOGGLE_PACKING', id:item.id })}
                    style={{ width:16, height:16, accentColor:'var(--accent)', cursor:'pointer' }}/>
                  <span style={{ fontSize:14 }}>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
