import type { Dispatch, SetStateAction } from 'react';
import { Icon } from '@/components/ui/icon';
import { MonthPicker } from '@/components/shared/MonthPicker';
import { UserBadge } from '@/components/shared/UserBadge';
import { FilterChip } from './FilterChip';
import type { TypeFilter, UserFilter, MonthFilter } from '../types';

interface TransaksiFilterProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  typeFilter: TypeFilter;
  setTypeFilter: Dispatch<SetStateAction<TypeFilter>>;
  userFilter: UserFilter;
  setUserFilter: Dispatch<SetStateAction<UserFilter>>;
  monthFilter: MonthFilter;
  setMonthFilter: Dispatch<SetStateAction<MonthFilter>>;
  pickerYear: number;
  setPickerYear: Dispatch<SetStateAction<number>>;
  monthLabel: string;
  hasFilters: boolean;
  typeCounts: Record<TypeFilter, number>;
  resetFilters: () => void;
}

export function TransaksiFilter({
  search, setSearch,
  typeFilter, setTypeFilter,
  userFilter, setUserFilter,
  monthFilter, setMonthFilter,
  pickerYear, setPickerYear,
  monthLabel,
  hasFilters,
  typeCounts,
  resetFilters,
}: TransaksiFilterProps) {
  return (
    <div className="bg-surface border border-app-border rounded-xl p-4 mb-4">

      {/* Search + Month picker */}
      <div className="grid grid-cols-1 gap-2 mb-3 md:flex md:items-center md:gap-2.5">
        <div className="flex items-center gap-2.5 px-3 py-2.25 bg-surface-alt rounded-[9px] border border-app-border min-w-0">
          <span className="text-app-text-subtle shrink-0">{Icon.search(16)}</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari merchant atau catatan…"
            className="flex-1 border-0 outline-none bg-transparent text-[13px] text-app-text font-sans min-w-0"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="border-0 bg-transparent text-app-text-subtle cursor-pointer p-0 leading-none flex shrink-0"
            >
              {Icon.close(14)}
            </button>
          )}
        </div>

        <div className="shrink-0">
          <MonthPicker
            viewMonth={(monthFilter?.month ?? new Date().getMonth() + 1) - 1}
            viewYear={pickerYear}
            btnLabel={monthLabel}
            isActive={monthFilter !== null}
            isMonthSelected={monthFilter !== null}
            setViewMonth={(month) => setMonthFilter({ year: pickerYear, month: month + 1 })}
            setViewYear={setPickerYear}
            onClear={() => setMonthFilter(null)}
          />
        </div>
      </div>

      {/* Chips: type + user + reset */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'expense', 'income', 'transfer'] as TypeFilter[]).map(type => (
          <FilterChip
            key={type}
            active={typeFilter === type}
            count={typeCounts[type]}
            onClick={() => setTypeFilter(type)}
          >
            {type === 'all' ? 'Semua' : type === 'expense' ? 'Pengeluaran' : type === 'income' ? 'Pemasukan' : 'Transfer'}
          </FilterChip>
        ))}

        <span className="w-px bg-app-border mx-1 self-stretch" />

        {(['all', 'H', 'W'] as UserFilter[]).map(u => (
          <FilterChip
            key={u}
            active={userFilter === u}
            onClick={() => setUserFilter(u)}
          >
            {u === 'all' ? (
              'Semua Pencatat'
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <UserBadge user={u} size={16} />
                {u === 'H' ? 'Suami' : 'Istri'}
              </span>
            )}
          </FilterChip>
        ))}

        {hasFilters && (
          <>
            <span className="w-px bg-app-border mx-1 self-stretch" />
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.75 rounded-full border border-app-border bg-app-danger-light text-app-danger cursor-pointer text-[12.5px] font-semibold font-sans"
            >
              {Icon.close(12)} Reset
            </button>
          </>
        )}
      </div>
    </div>
  );
}
