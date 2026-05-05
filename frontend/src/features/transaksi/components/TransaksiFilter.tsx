import type { Dispatch, RefObject, SetStateAction } from 'react';
import { T } from '@/lib/tokens';
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
    <div style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: T.radius.lg,
      padding: 16, marginBottom: 16,
    }}>
      {/* Search + Month picker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 9,
          padding: '9px 12px',
          background: T.surfaceAlt, borderRadius: 9,
          border: `1px solid ${T.border}`,
        }}>
          <span style={{ color: T.textSubtle, flexShrink: 0 }}>{Icon.search(16)}</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari merchant atau catatan…"
            style={{
              flex: 1, border: 'none', outline: 'none',
              background: 'transparent', fontSize: 13, color: T.text,
              fontFamily: T.fontSans,
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                border: 'none', background: 'transparent',
                color: T.textSubtle, cursor: 'pointer', padding: 0, lineHeight: 1,
              }}
            >
              {Icon.close(14)}
            </button>
          )}
        </div>

        {/* Month picker */}
        <div ref={monthPickerRef} style={{ position: 'relative' }}>
          <Btn
            kind={monthFilter ? 'soft' : 'ghost'}
            size="sm"
            icon={Icon.calendar(14)}
            onClick={() => { setShowMonthPicker(v => !v); setPickerYear(monthFilter?.year ?? new Date().getFullYear()); }}
          >
            {monthLabel}
            <span style={{ marginLeft: 2 }}>{Icon.chev(12, showMonthPicker ? 'up' : 'down')}</span>
          </Btn>

          {showMonthPicker && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 120,
              background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: T.radius.lg,
              boxShadow: '0 8px 24px rgba(20,30,25,0.13)',
              padding: 14, width: 240,
            }}>
              {/* Year navigation */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <button
                  onClick={() => setPickerYear(y => y - 1)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: T.textSubtle, padding: 4, display: 'flex' }}
                >
                  {Icon.chev(16, 'left')}
                </button>
                <span style={{ fontWeight: 700, fontSize: 14, color: T.text, fontFamily: T.fontSans }}>{pickerYear}</span>
                <button
                  onClick={() => setPickerYear(y => y + 1)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: T.textSubtle, padding: 4, display: 'flex' }}
                >
                  {Icon.chev(16, 'right')}
                </button>
              </div>

              {/* All-time option */}
              <button
                onClick={() => { setMonthFilter(null); setShowMonthPicker(false); }}
                style={{
                  width: '100%', padding: '7px 10px', marginBottom: 8,
                  borderRadius: 7, border: `1px solid ${!monthFilter ? T.primary : T.border}`,
                  background: !monthFilter ? T.primaryLight : T.surfaceAlt,
                  color: !monthFilter ? T.primaryDark : T.textSubtle,
                  fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                  fontFamily: T.fontSans, textAlign: 'center',
                }}
              >
                Semua Waktu
              </button>

              {/* Month grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5 }}>
                {MONTHS_SHORT.map((m, i) => {
                  const isSelected = monthFilter?.year === pickerYear && monthFilter?.month === (i + 1);
                  return (
                    <button
                      key={i}
                      onClick={() => { setMonthFilter({ year: pickerYear, month: i + 1 }); setShowMonthPicker(false); }}
                      style={{
                        padding: '7px 4px', borderRadius: 7,
                        border: `1px solid ${isSelected ? T.primary : T.border}`,
                        background: isSelected ? T.primary : T.surface,
                        color: isSelected ? '#fff' : T.text,
                        fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        fontFamily: T.fontSans,
                      }}
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

      {/* Chips: type */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
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

        <span style={{ width: 1, background: T.border, margin: '0 4px', alignSelf: 'stretch' }} />

        {/* User filter */}
        {(['all', 'H', 'W'] as UserFilter[]).map(u => (
          <FilterChip
            key={u}
            active={userFilter === u}
            onClick={() => setUserFilter(u)}
          >
            {u === 'all' ? (
              'Semua Pencatat'
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <UserBadge user={u} size={16} />
                {u === 'H' ? 'Suami' : 'Istri'}
              </span>
            )}
          </FilterChip>
        ))}

        {hasFilters && (
          <>
            <span style={{ width: 1, background: T.border, margin: '0 4px', alignSelf: 'stretch' }} />
            <button
              onClick={resetFilters}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '7px 12px', borderRadius: 999,
                border: `1px solid ${T.border}`, background: T.dangerLight,
                color: T.danger, cursor: 'pointer',
                fontSize: 12.5, fontWeight: 600, fontFamily: T.fontSans,
              }}
            >
              {Icon.close(12)} Reset
            </button>
          </>
        )}
      </div>
    </div>
  );
}
