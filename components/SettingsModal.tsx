'use client';
import { useState } from 'react';
import { useTrip } from '@/lib/store';
import { Icon } from './Icon';

const lbl: React.CSSProperties = { fontSize: 12, color: 'var(--ink-3)', letterSpacing: '.05em', textTransform: 'uppercase', display: 'block', marginBottom: 4 };
const field: React.CSSProperties = { width: '100%', fontSize: 13, padding: '8px 10px', background: 'var(--paper-2)', border: '.5px solid var(--hair-2)', borderRadius: 8, color: 'var(--ink)', fontFamily: 'var(--mono)', boxSizing: 'border-box' };
const hint: React.CSSProperties = { fontSize: 11, color: 'var(--ink-3)', marginTop: 4 };

export function SettingsModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useTrip();
  const [ocmKey, setOcmKey] = useState(state.preferences.ocmApiKey ?? '');
  const [gmKey, setGmKey]   = useState(state.preferences.googleMapsApiKey ?? '');

  function save() {
    dispatch({ type: 'SET_PREF', key: 'ocmApiKey',        value: ocmKey });
    dispatch({ type: 'SET_PREF', key: 'googleMapsApiKey', value: gmKey });
    onClose();
  }

  return (
    <div className="scrim" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <span className="serif" style={{ fontSize: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="gear" size={18}/> Settings
          </span>
          <button className="btn ghost sm" onClick={onClose}><Icon name="x" size={14}/></button>
        </div>

        <p className="muted" style={{ fontSize: 12, marginBottom: 20, borderBottom: '.5px solid var(--hair)', paddingBottom: 16 }}>
          API keys are stored locally in your browser and never sent to a server.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <span style={lbl}>Open Charge Map API key</span>
            <input
              style={field}
              value={ocmKey}
              onChange={e => setOcmKey(e.target.value)}
              placeholder="Paste your key here…"
              spellCheck={false}
            />
            <p style={hint}>Free key from openchargemap.io — optional, improves rate limits for live charger data on the map.</p>
          </div>

          <div>
            <span style={lbl}>Google Maps API key</span>
            <input
              style={field}
              value={gmKey}
              onChange={e => setGmKey(e.target.value)}
              placeholder="AIza…"
              spellCheck={false}
            />
            <p style={hint}>Routes API key — used for driving time and distance between cities (coming soon).</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 28 }}>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn accent" onClick={save}><Icon name="check" size={14}/> Save</button>
        </div>
      </div>
    </div>
  );
}
