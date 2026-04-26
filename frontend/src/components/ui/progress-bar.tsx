import { T } from '@/lib/tokens';

interface ProgressBarProps {
  pct: number;
  height?: number;
}

export function ProgressBar({ pct, height = 8 }: ProgressBarProps) {
  const clamped  = Math.min(pct, 100);
  const color    = pct >= 100 ? T.danger   : pct >= 75 ? T.warning   : T.primary;
  const trackBg  = pct >= 100 ? '#FCE8E7'  : pct >= 75 ? '#FDF1DD'   : '#E8F0EC';

  return (
    <div style={{
      width: '100%',
      height,
      background: trackBg,
      borderRadius: 999,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        width: `${clamped}%`,
        height: '100%',
        background: color,
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
