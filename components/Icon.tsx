interface IconProps { name: string; size?: number; }

export function Icon({ name, size = 16 }: IconProps) {
  const s = size;
  const p = { stroke:"currentColor", strokeWidth:1.5, fill:"none", strokeLinecap:"round" as const, strokeLinejoin:"round" as const };
  if (name === "sparkle")  return <svg width={s} height={s} viewBox="0 0 24 24" {...p}><path d="M12 3l1.6 5.2L19 10l-5.4 1.8L12 17l-1.6-5.2L5 10l5.4-1.8z"/><path d="M19 16l.7 2.1L22 19l-2.3.9L19 22l-.7-2.1L16 19l2.3-.9z"/></svg>;
  if (name === "today")    return <svg width={s} height={s} viewBox="0 0 24 24" {...p}><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M8 3v4M16 3v4M3.5 10h17"/></svg>;
  if (name === "timeline") return <svg width={s} height={s} viewBox="0 0 24 24" {...p}><path d="M5 6h14M5 12h10M5 18h14"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/></svg>;
  if (name === "map")      return <svg width={s} height={s} viewBox="0 0 24 24" {...p}><path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/></svg>;
  if (name === "cal")      return <svg width={s} height={s} viewBox="0 0 24 24" {...p}><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M8 3v4M16 3v4M3.5 10h17M8 14h2M14 14h2M8 17h2M14 17h2"/></svg>;
  if (name === "wallet")   return <svg width={s} height={s} viewBox="0 0 24 24" {...p}><path d="M3 7a2 2 0 012-2h12a2 2 0 012 2v2H6a2 2 0 00-2 2v6a2 2 0 002 2h13v-2"/><path d="M21 11v6H6"/><circle cx="16" cy="14" r="1.1" fill="currentColor"/></svg>;
  if (name === "bag")      return <svg width={s} height={s} viewBox="0 0 24 24" {...p}><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg>;
  if (name === "plus")     return <svg width={s} height={s} viewBox="0 0 24 24" {...p}><path d="M12 5v14M5 12h14"/></svg>;
  if (name === "x")        return <svg width={s} height={s} viewBox="0 0 24 24" {...p}><path d="M6 6l12 12M6 18L18 6"/></svg>;
  if (name === "edit")     return <svg width={s} height={s} viewBox="0 0 24 24" {...p}><path d="M4 20h4l10-10-4-4L4 16v4z"/><path d="M14 6l4 4"/></svg>;
  if (name === "check")    return <svg width={s} height={s} viewBox="0 0 24 24" {...p}><path d="M5 12l5 5L20 7"/></svg>;
  if (name === "bolt")     return <svg width={s} height={s} viewBox="0 0 24 24" {...p}><path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z"/></svg>;
  if (name === "pin")      return <svg width={s} height={s} viewBox="0 0 24 24" {...p}><path d="M12 22s-7-7.5-7-13a7 7 0 0114 0c0 5.5-7 13-7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>;
  if (name === "car")      return <svg width={s} height={s} viewBox="0 0 24 24" {...p}><path d="M5 16V11l2-5h10l2 5v5"/><path d="M3 16h18v3a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1H6v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-3z"/><circle cx="8" cy="16" r="1.2" fill="currentColor"/><circle cx="16" cy="16" r="1.2" fill="currentColor"/></svg>;
  return null;
}
