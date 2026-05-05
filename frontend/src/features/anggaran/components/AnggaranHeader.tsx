import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';

interface AnggaranHeaderProps {
  prevLabel: string;
  currentLabel: string;
  nextLabel: string;
  onMonthPrev: () => void;
  onMonthNext: () => void;
  onAddBudget: () => void;
}

export function AnggaranHeader({
  prevLabel,
  currentLabel,
  nextLabel,
  onMonthPrev,
  onMonthNext,
  onAddBudget,
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
        <div className="flex items-center gap-1.5">
          <Btn kind="ghost" size="sm" icon={Icon.chev(14, 'left')} onClick={onMonthPrev}>
            {prevLabel}
          </Btn>
          <Btn
            kind="ghost"
            size="sm"
            style={{
              background: 'var(--color-brand-light)',
              color: 'var(--color-brand-dark)',
              borderColor: '#C7E6D8',
            }}
          >
            {currentLabel}
          </Btn>
          <Btn kind="ghost" size="sm" onClick={onMonthNext}>
            {nextLabel} {Icon.chev(14, 'right')}
          </Btn>
        </div>

        <span className="w-px bg-app-border h-6" />

        <Btn kind="primary" size="sm" icon={Icon.plus(14)} onClick={onAddBudget}>
          Anggaran Baru
        </Btn>
      </div>
    </div>
  );
}
