import type { DashboardBudget } from '../types';
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
    <div className="py-3 border-b border-app-divider dark:border-gray-700">
      <div className="flex items-center gap-3 mb-2">
        <CatBubble cat={budget.cat} size={32} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[13.5px] font-semibold text-app-text min-w-0 truncate">{budget.name}</span>
            <span className="text-[12.5px] text-app-text-muted tabular-nums shrink-0">
              <strong className="text-app-text font-semibold">{formatRp(budget.used)}</strong>
              <span className="text-app-text-subtle hidden lg:inline"> / {formatRp(budget.total)}</span>
            </span>
          </div>
          <div className="flex items-center justify-between mt-0.75">
            <span className="text-[11.5px] text-app-text-subtle">
              {isOverBudget
                ? <span className="text-app-danger font-semibold">Lewat anggaran {formatRp(budget.used - budget.total)}</span>
                : `Sisa ${formatRp(remaining)}`}
            </span>
            <span
              className="text-[11.5px] font-semibold tabular-nums inline-flex items-center gap-0.75"
              style={{ color: isOverBudget ? 'var(--color-app-danger)' : percentage >= 75 ? 'var(--color-app-warning)' : 'var(--color-brand-dark)' }}
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
