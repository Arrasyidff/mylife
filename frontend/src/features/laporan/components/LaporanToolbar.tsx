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
  setViewYear: (fn: (year: number) => number) => void;
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
    <div className="flex flex-col gap-2.5 mb-4.5 md:flex-row md:items-center md:justify-end md:mb-5.5">
      <PeriodToggle period={period} setPeriod={setPeriod} />
      <div className="flex justify-end md:block">
        <DatePicker
          period={period}
          viewMonth={viewMonth}
          viewYear={viewYear}
          btnLabel={btnLabel}
          setViewMonth={setViewMonth}
          setViewYear={setViewYear}
        />
      </div>
    </div>
  );
}
