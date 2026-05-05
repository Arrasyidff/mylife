import { RefObject } from 'react';
import { T } from '@/lib/tokens';
import { Btn } from '@/components/ui/btn';
import { Icon } from '@/components/ui/icon';
import { ChevronDown } from 'lucide-react';
import type { MonthOption } from '../hooks/useDashboard';

interface DashboardHeaderProps {
  currentMonth: string;
  currentYear: number;
  isCurrentMonth: boolean;
  daysLeft: number;
  selectedMonth: string;
  setSelectedMonth: (v: string) => void;
  showMonthPicker: boolean;
  setShowMonthPicker: (fn: (v: boolean) => boolean) => void;
  monthPickerRef: RefObject<HTMLDivElement | null>;
  availableMonths: MonthOption[];
  onAddClick: () => void;
}

export function DashboardHeader({
  currentMonth, currentYear, isCurrentMonth, daysLeft,
  selectedMonth, setSelectedMonth,
  showMonthPicker, setShowMonthPicker, monthPickerRef,
  availableMonths, onAddClick,
}: DashboardHeaderProps) {
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
        <div ref={monthPickerRef} className="relative">
          <Btn
            kind="ghost"
            size="sm"
            icon={Icon.calendar(14)}
            onClick={() => setShowMonthPicker(v => !v)}
          >
            {currentMonth} {currentYear}
            <ChevronDown size={12} className="ml-0.5" />
          </Btn>
          {showMonthPicker && (
            <div className="absolute top-[calc(100%+6px)] left-0 sm:left-auto sm:right-0 bg-white border border-[#E0EAE6] rounded-[10px] shadow-[0_8px_24px_rgba(20,30,25,0.12)] min-w-42.5 z-50 overflow-hidden">
              {availableMonths.map(({ value, label }) => {
                const active = value === selectedMonth;
                return (
                  <button
                    key={value}
                    onClick={() => { setSelectedMonth(value); setShowMonthPicker(() => false); }}
                    className={`block w-full text-left py-2.25 px-3.5 border-0 cursor-pointer text-[13px] ${active ? 'font-bold' : 'font-normal'}`}
                    style={{
                      color:      active ? T.primary : T.text,
                      background: active ? `${T.primary}12` : 'transparent',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <Btn kind="primary" size="sm" icon={Icon.plus(14)} onClick={onAddClick}>
          Tambah Transaksi
        </Btn>
      </div>
    </div>
  );
}
