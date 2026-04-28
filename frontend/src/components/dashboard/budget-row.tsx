import type { Budget } from '@/lib/dashboard-data';
import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';
import { CatBubble } from './cat-bubble';
import { ProgressBar } from '@/components/ui/progress-bar';
import { AlertTriangle } from 'lucide-react';

interface BudgetRowProps {
  b: Budget;
}

export function BudgetRow({ b }: BudgetRowProps) {
  const pct = Math.round((b.used / b.total) * 100);
  const remaining = b.total - b.used;
  const overBudget = pct >= 100;

  return (
    <div style={{ padding: '12px 0', borderBottom: `1px solid ${T.divider}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <CatBubble cat={b.cat} size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: T.text }}>{b.name}</span>
            <span style={{ fontSize: 12.5, color: T.textMuted, fontVariantNumeric: 'tabular-nums' }}>
              <strong style={{ color: T.text, fontWeight: 600 }}>{formatRp(b.used)}</strong>
              <span style={{ color: T.textSubtle }}> / {formatRp(b.total)}</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 3 }}>
            <span style={{ fontSize: 11.5, color: T.textSubtle }}>
              {overBudget
                ? <span style={{ color: T.danger, fontWeight: 600 }}>Lewat anggaran {formatRp(b.used - b.total)}</span>
                : `Sisa ${formatRp(remaining)}`}
            </span>
            <span style={{
              fontSize: 11.5,
              fontWeight: 600,
              color: overBudget ? T.danger : pct >= 75 ? '#8C5A0E' : T.primaryDark,
              fontVariantNumeric: 'tabular-nums',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
            }}>
              {overBudget && <AlertTriangle size={12} />}
              {pct}%
            </span>
          </div>
        </div>
      </div>
      <ProgressBar pct={pct} height={6} />
    </div>
  );
}
