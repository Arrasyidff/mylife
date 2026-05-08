import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';
import { MonthPicker } from '@/components/shared/MonthPicker';

interface AnggaranHeaderProps {
  viewMonth: number;
  viewYear: number;
  btnLabel: string;
  onAddBudget: () => void;
  setViewMonth: (month: number) => void;
  setViewYear: (fn: (year: number) => number) => void;
}

export function AnggaranHeader({
  viewMonth,
  viewYear,
  btnLabel,
  onAddBudget,
  setViewMonth,
  setViewYear,
}: AnggaranHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
      <div>
        <h1 className="m-0 text-xl font-bold text-app-text tracking-[-0.01875rem]">Anggaran</h1>
        <p className="text-[12.5px] text-app-text-subtle mt-0.5">
          Atur batas pengeluaran per kategori
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <MonthPicker
          viewMonth={viewMonth}
          viewYear={viewYear}
          btnLabel={btnLabel}
          setViewMonth={setViewMonth}
          setViewYear={setViewYear}
        />

        <span className="w-px bg-app-border h-6" />

        <Btn kind="primary" size="sm" icon={Icon.plus(14)} onClick={onAddBudget}>
          Anggaran Baru
        </Btn>
      </div>
    </div>
  );
}
