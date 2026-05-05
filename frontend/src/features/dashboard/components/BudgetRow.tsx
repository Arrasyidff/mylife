import type { DashboardBudget } from '../types';
import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';
import { CatBubble } from '@/components/shared/CatBubble';
import { ProgressBar } from '@/components/ui/progress-bar';
import { AlertTriangle } from 'lucide-react';

interface BudgetRowProps {
  budget: DashboardBudget;
}

export function BudgetRow({ budget }: BudgetRowProps) {
  const percentage = budget.total > 0 ? Math.round((budget.used / budget.total) * 100) : 0;
  const remaining = budget.total - budget.used;
  const isOverBudget = percentage >= 100;

  return (
    <div className="py-3 border-b border-[#EEF2F0]">
      <div className="flex items-center gap-3 mb-2">
        <CatBubble cat={budget.cat} size={32} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[13.5px] font-semibold text-[#1A2420] min-w-0 truncate">{budget.name}</span>
            <span className="text-[12.5px] text-[#7D9590] tabular-nums shrink-0">
              <strong className="text-[#1A2420] font-semibold">{formatRp(budget.used)}</strong>
              <span className="text-[#A4B8B2] hidden lg:inline"> / {formatRp(budget.total)}</span>
            </span>
          </div>
          <div className="flex items-center justify-between mt-0.75">
            <span className="text-[11.5px] text-[#A4B8B2]">
              {isOverBudget
                ? <span className="text-[#C0392B] font-semibold">Lewat anggaran {formatRp(budget.used - budget.total)}</span>
                : `Sisa ${formatRp(remaining)}`}
            </span>
            <span
              className="text-[11.5px] font-semibold tabular-nums inline-flex items-center gap-0.75"
              style={{ color: isOverBudget ? T.danger : percentage >= 75 ? '#8C5A0E' : T.primaryDark }}
            >
              {isOverBudget && <AlertTriangle size={12} />}
              {percentage}%
            </span>
          </div>
        </div>
      </div>
      <ProgressBar pct={percentage} height={6} />
    </div>
  );
}
