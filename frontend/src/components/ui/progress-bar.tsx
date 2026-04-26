import { T } from '@/lib/tokens';

interface ProgressBarProps {
  pct: number;
  height?: number;
}

export function ProgressBar({ pct, height = 6 }: ProgressBarProps) {
  const clamped = Math.min(pct, 100);
  const color =
    pct >= 100 ? T.danger :
    pct >= 75  ? '#D4860B' :
    T.primary;

  return (
    <div style={{
      width: '100%',
      height,
      background: T.divider,
      borderRadius: height / 2,
      overflow: 'hidden',
    }}>
      <div style={{
        width: `${clamped}%`,
        height: '100%',
        background: color,
        borderRadius: height / 2,
        transition: 'width 0.3s ease',
      }} />
    </div>
  );
}
