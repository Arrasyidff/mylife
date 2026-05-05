import type { Budget } from '../types';
import type { StatusFilter } from '../types';
import { BudgetCard } from './BudgetCard';
import { AddBudgetCard } from './AddBudgetCard';

interface AnggaranBudgetGridProps {
  visibleBudgets: Budget[];
  statusFilter: StatusFilter;
  onEditBudget: (budget: Budget) => void;
  onAddBudget: () => void;
}

export function AnggaranBudgetGrid({
  visibleBudgets,
  statusFilter,
  onEditBudget,
  onAddBudget,
}: AnggaranBudgetGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-3.5">
      {visibleBudgets.map(budget => (
        <BudgetCard key={budget.id} b={budget} onEdit={() => onEditBudget(budget)} />
      ))}
      {statusFilter === 'all' && <AddBudgetCard onClick={onAddBudget} />}
      {statusFilter !== 'all' && visibleBudgets.length === 0 && (
        <div className="col-span-full py-10 text-center text-app-text-muted text-[13.5px]">
          Tidak ada anggaran dalam kategori ini.
        </div>
      )}
    </div>
  );
}
