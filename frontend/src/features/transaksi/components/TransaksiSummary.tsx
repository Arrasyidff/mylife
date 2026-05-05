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
    { label: 'Pemasukan',   value: totalIncome,  colorClass: 'text-brand-dark',                             prefix: '+' },
    { label: 'Pengeluaran', value: totalExpense,  colorClass: 'text-app-danger',                            prefix: '-' },
    { label: 'Selisih',     value: diff,          colorClass: diff >= 0 ? 'text-brand-dark' : 'text-app-danger', prefix: diff >= 0 ? '+' : '' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-3 mb-5">
      {items.map(s => (
        <div
          key={s.label}
          className="bg-surface border border-app-border rounded-xl px-2.5 py-2.5 md:px-4 md:py-3"
        >
          <div className="text-[10px] md:text-[11px] font-bold text-app-text-muted tracking-[0.3px] uppercase mb-1">
            {s.label}
          </div>
          <div className={`text-xs md:text-[15px] font-bold tabular-nums truncate ${s.colorClass}`}>
            {s.prefix}{formatRp(Math.abs(s.value))}
          </div>
        </div>
      ))}
    </div>
  );
}
