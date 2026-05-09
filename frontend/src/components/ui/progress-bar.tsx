interface ProgressBarProps {
  pct: number;
  height?: number;
}

export function ProgressBar({ pct, height = 8 }: ProgressBarProps) {
  const clamped = Math.min(pct, 100);
  const fillColor = pct >= 100 ? 'var(--color-app-danger)' : pct >= 75 ? 'var(--color-app-warning)' : 'var(--color-brand)';
  const trackClass = pct >= 100
    ? 'bg-red-100 dark:bg-red-950'
    : pct >= 75
    ? 'bg-amber-100 dark:bg-amber-950'
    : 'bg-emerald-100 dark:bg-emerald-950';

  return (
    <div
      className={trackClass}
      style={{ width: '100%', height, borderRadius: 999, overflow: 'hidden', position: 'relative' }}
    >
      <div style={{
        width: `${clamped}%`,
        height: '100%',
        background: fillColor,
        borderRadius: 999,
        transition: 'width 0.5s cubic-bezier(.2,.7,.3,1)',
      }} />
      {pct >= 100 && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'repeating-linear-gradient(45deg, transparent 0 4px, rgba(255,255,255,0.25) 4px 8px)',
          pointerEvents: 'none',
        }} />
      )}
    </div>
  );
}
