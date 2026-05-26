'use client';
import { useState, useEffect } from 'react';
import { TripProvider, useTrip } from '@/lib/store';
import { TopBar }        from '@/components/TopBar';
import { PasteComposer } from '@/components/PasteComposer';
import { EditModal }     from '@/components/EditModal';
import { SettingsModal } from '@/components/SettingsModal';
import { TodayView }     from '@/components/views/TodayView';
import { TimelineView }  from '@/components/views/TimelineView';
import { MapView }       from '@/components/views/MapView';
import { CalendarView }  from '@/components/views/CalendarView';
import { BudgetView }    from '@/components/views/BudgetView';
import { PackingView }   from '@/components/views/PackingView';
import type { Entry } from '@/lib/types';

type Tab = 'today' | 'timeline' | 'map' | 'calendar' | 'budget' | 'packing';

function AppInner() {
  const { state } = useTrip();
  const [tab, setTab]           = useState<Tab>('today');
  const [pasteOpen, setPaste]     = useState(false);
  const [editEntry, setEdit]      = useState<Entry | null>(null);
  const [settingsOpen, setSettings] = useState(false);
  const { theme, accent, density } = state.preferences;

  useEffect(() => {
    document.body.dataset.theme   = theme;
    document.body.dataset.accent  = accent;
    document.body.dataset.density = density;
  }, [theme, accent, density]);

  const onEdit = (e: Entry) => setEdit(e);

  return (
    <div className="app">
      <TopBar tab={tab} onTabChange={setTab} onPaste={() => setPaste(true)} onSettings={() => setSettings(true)} entryCount={state.entries.length}/>
      <main>
        {tab === 'today'    && <TodayView    onEdit={onEdit}/>}
        {tab === 'timeline' && <TimelineView onEdit={onEdit}/>}
        {tab === 'map'      && <MapView/>}
        {tab === 'calendar' && <CalendarView onEdit={onEdit}/>}
        {tab === 'budget'   && <BudgetView/>}
        {tab === 'packing'  && <PackingView/>}
      </main>
      {pasteOpen     && <PasteComposer onClose={() => setPaste(false)}/>}
      {editEntry     && <EditModal entry={editEntry} onClose={() => setEdit(null)}/>}
      {settingsOpen  && <SettingsModal onClose={() => setSettings(false)}/>}
    </div>
  );
}

export default function Page() {
  return <TripProvider><AppInner/></TripProvider>;
}
