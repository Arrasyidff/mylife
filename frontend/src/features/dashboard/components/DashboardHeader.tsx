import { Btn } from '@/components/ui/btn';
import { Icon } from '@/components/ui/icon';
import { MonthPicker } from '@/components/shared/MonthPicker';

const MONTH_NAMES = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember',
];

interface DashboardHeaderProps {
  currentMonth: string;
  currentYear: number;
  isCurrentMonth: boolean;
  daysLeft: number;
  viewMonth: number;
  viewYear: number;
  setViewMonth: (month: number) => void;
  setViewYear: (fn: (year: number) => number) => void;
  onAddClick: () => void;
}

export function DashboardHeader({
  currentMonth, currentYear, isCurrentMonth, daysLeft,
  viewMonth, viewYear, setViewMonth, setViewYear,
  onAddClick,
}: DashboardHeaderProps) {
  const btnLabel = `${MONTH_NAMES[viewMonth].slice(0, 3)} ${viewYear}`;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-5">
      <div>
        <h1 className="m-0 text-xl font-bold text-[#1A2420] tracking-[-0.3px]">Dashboard</h1>
        <div className="text-[12.5px] text-[#A4B8B2] mt-0.75">
          {isCurrentMonth
            ? `${new Date().getDate()} ${currentMonth} ${currentYear} · ${daysLeft} hari tersisa bulan ini`
            : `Menampilkan data ${currentMonth} ${currentYear}`}
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <MonthPicker
          viewMonth={viewMonth}
          viewYear={viewYear}
          btnLabel={btnLabel}
          setViewMonth={setViewMonth}
          setViewYear={setViewYear}
        />
        <Btn kind="primary" size="sm" icon={Icon.plus(14)} onClick={onAddClick}>
          Tambah Transaksi
        </Btn>
      </div>
    </div>
  );
}
