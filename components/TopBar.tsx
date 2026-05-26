'use client';
import { Icon } from './Icon';
import { useTrip } from '@/lib/store';

type Tab = 'today' | 'timeline' | 'map' | 'calendar' | 'budget' | 'packing';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id:'today',    label:'Today',    icon:'today'    },
  { id:'timeline', label:'Timeline', icon:'timeline' },
  { id:'map',      label:'Map',      icon:'map'      },
  { id:'calendar', label:'Calendar', icon:'cal'      },
  { id:'budget',   label:'Budget',   icon:'wallet'   },
  { id:'packing',  label:'Packing',  icon:'bag'      },
];

const sel: React.CSSProperties = {
  fontSize:12, background:'var(--paper-2)', border:'.5px solid var(--hair-2)',
  borderRadius:8, padding:'4px 8px', color:'var(--ink)', cursor:'pointer',
};

export function TopBar({ tab, onTabChange, onPaste, onSettings, entryCount }: {
  tab: Tab; onTabChange: (t: Tab) => void; onPaste: () => void; onSettings: () => void; entryCount: number;
}) {
  const { state, dispatch } = useTrip();
  const { theme, accent, density } = state.preferences;
  const setPref = (key: 'theme' | 'accent' | 'density', value: string) =>
    dispatch({ type:'SET_PREF', key, value });

  return (
    <div className="topbar">
      <div className="brand">
        <span className="logo">Ferie</span>
        <span className="dot" />
        <span className="tag">ROAD TRIP 2026</span>
      </div>
      <nav className="nav">
        {TABS.map(t => (
          <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => onTabChange(t.id)}>
            <Icon name={t.icon} size={15} />
            {t.label}
            {t.id === 'timeline' && <span className="count">{entryCount}</span>}
          </button>
        ))}
      </nav>
      <div className="top-right">
        <select style={sel} value={theme} onChange={e => setPref('theme', e.target.value)}>
          {(['paper','dusk','meadow','dawn'] as const).map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select style={sel} value={accent} onChange={e => setPref('accent', e.target.value)}>
          {(['tomato','forest','cobalt','plum','copper'] as const).map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <select style={sel} value={density} onChange={e => setPref('density', e.target.value)}>
          {(['compact','regular','comfy'] as const).map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <button className="btn ghost sm" onClick={onSettings} title="Settings">
          <Icon name="gear" size={14} />
        </button>
        <button className="btn accent sm" onClick={onPaste}>
          <Icon name="plus" size={14} /> Add booking
        </button>
      </div>
    </div>
  );
}
