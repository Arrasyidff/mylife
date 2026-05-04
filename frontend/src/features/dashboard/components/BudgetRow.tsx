import type { Budget } from '@/lib/dashboard-data';
import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';
import { CatBubble } from '@/components/shared/CatBubble';
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
    <div className="py-3 border-b border-[#EEF2F0]">
      <div className="flex items-center gap-3 mb-2">
        <CatBubble cat={b.cat} size={32} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[13.5px] font-semibold text-[#1A2420]">{b.name}</span>
            <span className="text-[12.5px] text-[#7D9590] tabular-nums">
              <strong className="text-[#1A2420] font-semibold">{formatRp(b.used)}</strong>
              <span className="text-[#A4B8B2]"> / {formatRp(b.total)}</span>
            </span>
          </div>
          <div className="flex items-center justify-between mt-0.75">
            <span className="text-[11.5px] text-[#A4B8B2]">
              {overBudget
                ? <span className="text-[#C0392B] font-semibold">Lewat anggaran {formatRp(b.used - b.total)}</span>
                : `Sisa ${formatRp(remaining)}`}
            </span>
            <span
              className="text-[11.5px] font-semibold tabular-nums inline-flex items-center gap-0.75"
              style={{ color: overBudget ? T.danger : pct >= 75 ? '#8C5A0E' : T.primaryDark }}
            >
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
