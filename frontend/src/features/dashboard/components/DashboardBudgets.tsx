import Link from 'next/link';
import { formatRp } from '@/lib/format';
import { Surface } from '@/components/ui/surface';
import { Pill } from '@/components/ui/pill';
import { AlertTriangle } from 'lucide-react';
import { BudgetRow } from './BudgetRow';
import type { DashboardBudget } from '../types';

interface DashboardBudgetsProps {
  budgets: DashboardBudget[];
  currentMonth: string;
  currentYear: number;
  totalUsed: number;
  totalBudget: number;
  alertCount: number;
}

export function DashboardBudgets({
  budgets, currentMonth, currentYear, totalUsed, totalBudget, alertCount,
}: DashboardBudgetsProps) {
  return (
    <Surface pad={20}>
      <div className="flex flex-col justify-between mb-1">
        <div className='flex justify-between items-start'>
          <h3 className="m-0 text-[15px] font-bold text-app-text">
            Anggaran {currentMonth} {currentYear}
          </h3>
          {alertCount > 0 && (
            <Pill tone="warning" icon={<AlertTriangle size={11} />}>
              {alertCount} kategori dekat batas
            </Pill>
          )}
        </div>
        <div className="text-xs text-app-text-subtle mt-0.75">
          {formatRp(totalUsed)} dari {formatRp(totalBudget)} terpakai
        </div>
      </div>
      <div className="mt-3">
        {budgets.slice(0, 5).map(budget => <BudgetRow key={budget.id} budget={budget} />)}
      </div>
      <Link href="/anggaran" className="block text-center mt-3 text-[12.5px] text-brand-dark font-semibold no-underline">
        Lihat semua anggaran →
      </Link>
    </Surface>
  );
}
