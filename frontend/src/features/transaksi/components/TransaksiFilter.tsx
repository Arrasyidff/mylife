import type { Dispatch, RefObject, SetStateAction } from 'react';
import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';
import { UserBadge } from '@/components/shared/UserBadge';
import { MONTHS_SHORT } from '../constants';
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
  showMonthPicker: boolean;
  setShowMonthPicker: Dispatch<SetStateAction<boolean>>;
  pickerYear: number;
  setPickerYear: Dispatch<SetStateAction<number>>;
  monthPickerRef: RefObject<HTMLDivElement | null>;
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
  showMonthPicker, setShowMonthPicker,
  pickerYear, setPickerYear,
  monthPickerRef,
  monthLabel,
  hasFilters,
  typeCounts,
  resetFilters,
}: TransaksiFilterProps) {
  return (
    <div className="bg-surface border border-app-border rounded-xl p-4 mb-4">

      {/* Search + Month picker */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="flex-1 flex items-center gap-2.5 px-3 py-[9px] bg-surface-alt rounded-[9px] border border-app-border">
          <span className="text-app-text-subtle shrink-0">{Icon.search(16)}</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari merchant atau catatan…"
            className="flex-1 border-0 outline-none bg-transparent text-[13px] text-app-text font-sans"
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

        {/* Month picker */}
        <div ref={monthPickerRef} className="relative shrink-0">
          <Btn
            kind={monthFilter ? 'soft' : 'ghost'}
            size="sm"
            icon={Icon.calendar(14)}
            onClick={() => {
              setShowMonthPicker(v => !v);
              setPickerYear(monthFilter?.year ?? new Date().getFullYear());
            }}
          >
            <span className="hidden sm:inline">{monthLabel}</span>
            <span className="inline sm:hidden">{monthFilter ? `${monthFilter.month}/${monthFilter.year}` : 'Semua'}</span>
            <span className="ml-0.5">{Icon.chev(12, showMonthPicker ? 'up' : 'down')}</span>
          </Btn>

          {showMonthPicker && (
            <div className="absolute top-full mt-1.5 right-0 z-[120] bg-surface border border-app-border rounded-xl shadow-[0_8px_24px_rgba(20,30,25,0.13)] p-3.5 w-60">
              {/* Year navigation */}
              <div className="flex items-center justify-between mb-2.5">
                <button
                  onClick={() => setPickerYear(y => y - 1)}
                  className="border-0 bg-transparent cursor-pointer text-app-text-subtle p-1 flex"
                >
                  {Icon.chev(16, 'left')}
                </button>
                <span className="font-bold text-sm text-app-text">{pickerYear}</span>
                <button
                  onClick={() => setPickerYear(y => y + 1)}
                  className="border-0 bg-transparent cursor-pointer text-app-text-subtle p-1 flex"
                >
                  {Icon.chev(16, 'right')}
                </button>
              </div>

              {/* All-time */}
              <button
                onClick={() => { setMonthFilter(null); setShowMonthPicker(false); }}
                className={[
                  'w-full px-2.5 py-[7px] mb-2 rounded-[7px] border cursor-pointer text-[12.5px] font-semibold text-center font-sans',
                  !monthFilter
                    ? 'border-brand bg-brand-light text-brand-dark'
                    : 'border-app-border bg-surface-alt text-app-text-subtle',
                ].join(' ')}
              >
                Semua Waktu
              </button>

              {/* Month grid */}
              <div className="grid grid-cols-3 gap-[5px]">
                {MONTHS_SHORT.map((m, i) => {
                  const isSelected = monthFilter?.year === pickerYear && monthFilter?.month === (i + 1);
                  return (
                    <button
                      key={i}
                      onClick={() => { setMonthFilter({ year: pickerYear, month: i + 1 }); setShowMonthPicker(false); }}
                      className={[
                        'px-1 py-[7px] rounded-[7px] border cursor-pointer text-xs font-semibold font-sans',
                        isSelected
                          ? 'border-brand bg-brand text-white'
                          : 'border-app-border bg-surface text-app-text hover:bg-surface-alt',
                      ].join(' ')}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
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
