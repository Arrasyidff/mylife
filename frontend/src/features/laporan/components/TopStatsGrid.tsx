import { T } from '@/lib/tokens';
import type { StatItem } from '../types';

type Props = { stats: StatItem[] };

export function TopStatsGrid({ stats }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
      {stats.map((s, i) => (
        <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius.lg, padding: '16px 18px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: 0.4 }}>{s.label}</div>
          <div style={{ fontSize: 19, fontWeight: 700, marginTop: 6, color: s.tone, letterSpacing: -0.4, fontVariantNumeric: 'tabular-nums' }}>
            {s.value}
          </div>
          <div style={{ fontSize: 11.5, color: T.textSubtle, marginTop: 3 }}>{s.sub}</div>
        </div>
      ))}
    </div>
  );
}
