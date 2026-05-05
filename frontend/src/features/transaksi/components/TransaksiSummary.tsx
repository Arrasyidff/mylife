import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';

interface TransaksiSummaryProps {
  totalIncome: number;
  totalExpense: number;
  filteredCount: number;
}

export function TransaksiSummary({ totalIncome, totalExpense, filteredCount }: TransaksiSummaryProps) {
  if (filteredCount === 0) return null;

  const diff = totalIncome - totalExpense;
  const items = [
    { label: 'Pemasukan',   value: totalIncome,  color: T.primaryDark, prefix: '+' },
    { label: 'Pengeluaran', value: totalExpense,  color: T.danger,      prefix: '-' },
    { label: 'Selisih',     value: diff,          color: diff >= 0 ? T.primaryDark : T.danger, prefix: diff >= 0 ? '+' : '' },
  ];

  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
      {items.map(s => (
        <div
          key={s.label}
          style={{
            flex: 1, padding: '12px 16px',
            background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: T.radius.lg,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, letterSpacing: 0.3, marginBottom: 4 }}>
            {s.label.toUpperCase()}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: s.color, fontVariantNumeric: 'tabular-nums' }}>
            {s.prefix}{formatRp(Math.abs(s.value))}
          </div>
        </div>
      ))}
    </div>
  );
}
