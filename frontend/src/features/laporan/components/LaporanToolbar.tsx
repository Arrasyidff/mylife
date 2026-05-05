import { PeriodToggle } from './PeriodToggle';
import { DatePicker } from './DatePicker';
import type { Period } from '../types';

type Props = {
  period: Period;
  setPeriod: (period: Period) => void;
  viewMonth: number;
  viewYear: number;
  btnLabel: string;
  setViewMonth: (month: number) => void;
  setViewYear: (year: number) => void;
};

export function LaporanToolbar({
  period,
  setPeriod,
  viewMonth,
  viewYear,
  btnLabel,
  setViewMonth,
  setViewYear,
}: Props) {
  return (
    <div className="flex items-center justify-end gap-2.5 mb-5.5">
      <PeriodToggle period={period} setPeriod={setPeriod} />
      <DatePicker
        period={period}
        viewMonth={viewMonth}
        viewYear={viewYear}
        btnLabel={btnLabel}
        setViewMonth={setViewMonth}
        setViewYear={setViewYear}
      />
    </div>
  );
}
