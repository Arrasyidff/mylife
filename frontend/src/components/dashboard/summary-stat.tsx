import type { ReactNode } from 'react';
import { T } from '@/lib/tokens';

interface SummaryStatProps {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: 'up' | 'down' | 'neutral';
  large?: boolean;
  icon?: ReactNode;
}

export function SummaryStat({ label, value, delta, deltaTone, large, icon }: SummaryStatProps) {
  return (
    <div style={{
      flex: 1,
      minWidth: 0,
      padding: large ? '20px 22px' : '16px 18px',
      background: large
        ? `linear-gradient(135deg, ${T.primaryDark} 0%, ${T.primary} 100%)`
        : T.surface,
      color: large ? 'white' : T.text,
      border: large ? 'none' : `1px solid ${T.border}`,
      borderRadius: T.radius.lg,
    }}>
      <div style={{
        fontSize: 12,
        fontWeight: 500,
        color: large ? 'rgba(255,255,255,0.75)' : T.textMuted,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        {icon}
        {label}
      </div>
      <div style={{
        fontSize: large ? 28 : 22,
        fontWeight: 700,
        marginTop: 6,
        letterSpacing: -0.5,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </div>
      {delta && (
        <div style={{
          fontSize: 12,
          marginTop: 6,
          color: large
            ? 'rgba(255,255,255,0.85)'
            : deltaTone === 'up'   ? T.primaryDark
            : deltaTone === 'down' ? '#A52826'
            : T.textMuted,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          {deltaTone === 'up' ? '↑' : deltaTone === 'down' ? '↓' : ''}
          {delta}
        </div>
      )}
    </div>
  );
}
