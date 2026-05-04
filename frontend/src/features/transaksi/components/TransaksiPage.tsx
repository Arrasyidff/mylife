"use client";
import { CheckCircle, XCircle } from 'lucide-react';
import { T } from '@/lib/tokens';
import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';
import { UserBadge } from '@/components/shared/UserBadge';
import { formatRp } from '@/lib/format';
import { MONTHS_SHORT } from '../constants';
import { useTransaksi } from '../hooks/useTransaksi';
import { FilterChip } from './FilterChip';
import { TxGroup } from './TxGroup';
import { EmptyState } from './EmptyState';
import { AddTransactionModal } from './AddTransactionModal';
import { EditTransactionModal } from './EditTransactionModal';
import type { TypeFilter, UserFilter } from '../types';

export function TransaksiPage() {
  const {
    txList,
    filtered,
    groups,
    showAdd,      setShowAdd,
    editTx,       setEditTx,
    expandedId,   setExpandedId,
    search,       setSearch,
    typeFilter,   setTypeFilter,
    userFilter,   setUserFilter,
    monthFilter,  setMonthFilter,
    showMonthPicker, setShowMonthPicker,
    pickerYear,   setPickerYear,
    toast,
    monthPickerRef,
    monthLabel,
    hasFilters,
    totalIncome,
    totalExpense,
    typeCounts,
    handleAdd,
    handleEdit,
    handleDelete,
    resetFilters,
    handleExport,
  } = useTransaksi();

  const _now = new Date();

  return (
    <div style={{ fontFamily: T.fontSans }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 24,
          background: T.surface,
          border: `1px solid ${toast.ok ? T.primary : T.danger}44`,
          borderLeft: `4px solid ${toast.ok ? T.primary : T.danger}`,
          borderRadius: 10,
          padding: '12px 16px',
          boxShadow: '0 4px 20px rgba(20,30,25,0.12)',
          display: 'flex', alignItems: 'center', gap: 10,
          zIndex: 200, maxWidth: 360,
        }}>
          {toast.ok
            ? <CheckCircle size={16} color={T.primary} />
            : <XCircle size={16} color={T.danger} />
          }
          <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{toast.msg}</span>
        </div>
      )}

      {/* Page header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: 20,
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: T.text, letterSpacing: -0.3 }}>
            Transaksi
          </h1>
          <div style={{ fontSize: 12.5, color: T.textSubtle, marginTop: 3 }}>
            {filtered.length} dari {txList.length} transaksi · {monthLabel}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <Btn kind="ghost" size="sm" icon={Icon.download(14)} onClick={handleExport} disabled={filtered.length === 0}>Ekspor</Btn>
          <Btn kind="primary" size="sm" icon={Icon.plus(14)} onClick={() => setShowAdd(true)}>
            Tambah
          </Btn>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: T.radius.lg,
        padding: 16, marginBottom: 16,
      }}>
        {/* Search */}
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
              onClick={() => { setShowMonthPicker(v => !v); setPickerYear(monthFilter?.year ?? _now.getFullYear()); }}
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

      {/* Summary bar */}
      {filtered.length > 0 && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Pemasukan',  value: totalIncome,                    color: T.primaryDark, prefix: '+' },
            { label: 'Pengeluaran', value: totalExpense,                  color: T.danger,      prefix: '-' },
            { label: 'Selisih',    value: totalIncome - totalExpense,     color: (totalIncome - totalExpense) >= 0 ? T.primaryDark : T.danger, prefix: (totalIncome - totalExpense) >= 0 ? '+' : '' },
          ].map(s => (
            <div
              key={s.label}
              style={{
                flex: 1, padding: '12px 16px',
                background: T.surface, border: `1px solid ${T.border}`,
                borderRadius: T.radius.lg,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, letterSpacing: 0.3, marginBottom: 4 }}>
                {s.label.toUpperCase()}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: s.color, fontVariantNumeric: 'tabular-nums' }}>
                {s.prefix}{formatRp(Math.abs(s.value))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Groups or empty state */}
      {groups.length === 0 ? (
        <EmptyState hasFilters={hasFilters} onReset={resetFilters} />
      ) : (
        groups.map(g => (
          <TxGroup
            key={g.key}
            label={g.label}
            txs={g.txs}
            expandedId={expandedId}
            onToggle={id => setExpandedId(prev => prev === id ? null : id)}
            onEdit={t => setEditTx(t)}
          />
        ))
      )}

      {showAdd && (
        <AddTransactionModal onClose={() => setShowAdd(false)} onSave={handleAdd} />
      )}
      {editTx && (
        <EditTransactionModal
          tx={editTx}
          onClose={() => setEditTx(null)}
          onSave={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
