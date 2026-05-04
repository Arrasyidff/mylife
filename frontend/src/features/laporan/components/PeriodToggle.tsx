import { T } from '@/lib/tokens';
import { PERIODS } from '../constants';
import type { Period } from '../types';

type Props = {
  period: Period;
  setPeriod: (p: Period) => void;
};

export function PeriodToggle({ period, setPeriod }: Props) {
  return (
    <div style={{
      display: 'inline-flex', padding: 3,
      background: T.surfaceAlt, borderRadius: 9, border: `1px solid ${T.border}`,
    }}>
      {PERIODS.map((p, i) => {
        const active = i === period;
        return (
          <button
            key={p}
            onClick={() => setPeriod(i as Period)}
            style={{
              padding: '6px 14px', borderRadius: 7, border: 'none',
              background: active ? T.surface : 'transparent',
              color: active ? T.text : T.textMuted,
              fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: T.fontSans,
              boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              transition: 'background 0.12s, color 0.12s',
            }}
          >
            {p}
          </button>
        );
      })}
    </div>
  );
}
