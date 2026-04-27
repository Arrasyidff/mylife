"use client";
import { useState, useMemo, useRef, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { T } from '@/lib/tokens';
import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';
import { Pill } from '@/components/ui/pill';
import { CatBubble } from '@/components/dashboard/cat-bubble';
import { UserBadge } from '@/components/dashboard/user-badge';
import { AddTransactionModal } from '@/components/dashboard/add-transaction-modal';
import { EditTransactionModal } from '@/components/dashboard/edit-transaction-modal';
import { transactions as SEED, accounts, type Transaction } from '@/lib/dashboard-data';
import { formatRp, formatTxDate, txDateGroupKey, formatGroupLabel } from '@/lib/format';

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const MONTHS_FULL  = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

// ── Filter chip ────────────────────────────────────────────────────────────────

function FilterChip({
  children, active, count, onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  count?: number | string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '7px 12px',
        background: active ? T.text : T.surface,
        color: active ? '#fff' : T.text,
        border: `1px solid ${active ? T.text : T.border}`,
        borderRadius: 999, cursor: 'pointer',
        fontSize: 12.5, fontWeight: 600,
        fontFamily: T.fontSans,
        transition: 'all 0.12s',
      }}
    >
      {children}
      {count != null && (
        <span style={{
          padding: '1px 6px', borderRadius: 999,
          background: active ? 'rgba(255,255,255,0.2)' : T.surfaceAlt,
          fontSize: 11, fontWeight: 700,
        }}>
          {count}
        </span>
      )}
    </button>
  );
}

// ── Single transaction row ─────────────────────────────────────────────────────

function TxLine({
  t,
  expanded,
  onToggle,
  onEdit,
}: {
  t: Transaction;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
}) {
  const acct = accounts.find(a => a.id === t.acct);
  const isIncome = t.type === 'income';
  const borderColor =
    t.type === 'income'   ? T.primary  :
    t.type === 'transfer' ? '#3B82F6'  : T.danger;
  const amountColor =
    isIncome              ? T.primaryDark :
    t.type === 'transfer' ? '#1846A8'     : T.text;

  return (
    <>
      <div
        onClick={onEdit}
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px 18px',
          borderLeft: `3px solid ${borderColor}`,
          background: T.surface,
          borderBottom: `1px solid ${T.divider}`,
          cursor: 'pointer',
          transition: 'background 0.1s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = T.surfaceAlt)}
        onMouseLeave={e => (e.currentTarget.style.background = T.surface)}
      >
        <CatBubble cat={t.cat} size={38} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{t.merch}</span>
            <Pill
              tone={t.type === 'income' ? 'success' : t.type === 'transfer' ? 'info' : 'danger'}
              size="sm"
            >
              {t.type === 'income' ? 'Pemasukan' : t.type === 'transfer' ? 'Transfer' : 'Pengeluaran'}
            </Pill>
          </div>
          <div style={{
            fontSize: 12, color: T.textSubtle, marginTop: 3,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {acct && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: 3, background: acct.color }} />
                {acct.name}
              </span>
            )}
            {acct && <span>·</span>}
            <span>{formatTxDate(t.date)}</span>
            {t.note && (
              <>
                <span>·</span>
                <span style={{ fontStyle: 'italic', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t.note}
                </span>
              </>
            )}
          </div>
        </div>

        <UserBadge user={t.user} size={22} />

        <div style={{
          fontSize: 15, fontWeight: 700,
          color: amountColor,
          fontVariantNumeric: 'tabular-nums',
          minWidth: 130, textAlign: 'right',
        }}>
          {isIncome ? '+' : ''}{formatRp(t.amount)}
        </div>

        {t.type === 'transfer' && (
          <button
            onClick={e => { e.stopPropagation(); onToggle(); }}
            style={{
              border: 'none', background: 'transparent',
              color: T.textSubtle, cursor: 'pointer', padding: 4, flexShrink: 0,
            }}
          >
            {Icon.chev(16, expanded ? 'up' : 'down')}
          </button>
        )}
      </div>

      {expanded && t.type === 'transfer' && (
        <div style={{
          background: T.surfaceAlt,
          borderLeft: '3px solid #3B82F6',
          borderBottom: `1px solid ${T.divider}`,
          padding: '12px 18px 14px 64px',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, letterSpacing: 0.3, marginBottom: 8 }}>
            3 ENTRI TERHUBUNG
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Debit dari Mandiri', amt: -500_000, color: T.danger  },
              { label: 'Kredit ke GoPay',    amt:  500_000, color: T.primary },
              { label: 'Biaya Admin',        amt:   -2_500, color: T.warning },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5 }}>
                <span style={{ width: 8, height: 8, borderRadius: 4, background: r.color, flexShrink: 0 }} />
                <span style={{ flex: 1, color: T.text }}>{r.label}</span>
                <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: r.color }}>
                  {r.amt > 0 ? '+' : ''}{formatRp(r.amt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ── Date group ─────────────────────────────────────────────────────────────────

function TxGroup({
  label, txs, expandedId, onToggle, onEdit,
}: {
  label: string;
  txs: Transaction[];
  expandedId: number | null;
  onToggle: (id: number) => void;
  onEdit: (t: Transaction) => void;
}) {
  const net = txs.reduce((s, t) => s + t.amount, 0);
  const netColor  = net >= 0 ? T.primaryDark : T.danger;
  const netPrefix = net >= 0 ? '+ ' : '− ';

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 4px 10px',
      }}>
        <h3 style={{
          margin: 0, fontSize: 12, fontWeight: 700,
          color: T.textMuted, letterSpacing: 0.4, textTransform: 'uppercase',
        }}>
          {label}
        </h3>
        <span style={{ fontSize: 12, color: T.textMuted, fontVariantNumeric: 'tabular-nums' }}>
          <span style={{ color: netColor, fontWeight: 700 }}>
            {netPrefix}{formatRp(Math.abs(net))}
          </span>
          <span style={{ margin: '0 6px' }}>·</span>
          {txs.length} transaksi
        </span>
      </div>
      <div style={{
        background: T.surface,
        borderRadius: T.radius.lg,
        border: `1px solid ${T.border}`,
        overflow: 'hidden',
      }}>
        {txs.map(t => (
          <TxLine
            key={t.id}
            t={t}
            expanded={expandedId === t.id}
            onToggle={() => onToggle(t.id)}
            onEdit={() => onEdit(t)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────

function EmptyState({ hasFilters, onReset }: { hasFilters: boolean; onReset: () => void }) {
  return (
    <div style={{
      textAlign: 'center', padding: '60px 24px',
      background: T.surface, borderRadius: T.radius.lg,
      border: `1px solid ${T.border}`,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: T.surfaceAlt, border: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 14px', color: T.textSubtle,
      }}>
        {Icon.list(22)}
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 6 }}>
        {hasFilters ? 'Tidak ada hasil' : 'Belum ada transaksi'}
      </div>
      <div style={{ fontSize: 13, color: T.textSubtle, marginBottom: hasFilters ? 20 : 0 }}>
        {hasFilters
          ? 'Coba ubah filter atau kata kunci pencarian.'
          : 'Tambahkan transaksi pertamamu.'}
      </div>
      {hasFilters && (
        <button
          onClick={onReset}
          style={{
            padding: '8px 18px', borderRadius: 999,
            border: `1px solid ${T.border}`, background: T.surface,
            cursor: 'pointer', fontSize: 13, fontWeight: 600, color: T.text,
            fontFamily: T.fontSans,
          }}
        >
          Reset filter
        </button>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

type TypeFilter = 'all' | 'expense' | 'income' | 'transfer';
type UserFilter = 'all' | 'H' | 'W';
type MonthFilter = { year: number; month: number } | null;
type Toast = { msg: string; ok: boolean };

export default function TransactionsPage() {
  const _now = new Date();

  const [txList,          setTxList]          = useState<Transaction[]>(SEED);
  const [showAdd,         setShowAdd]         = useState(false);
  const [editTx,          setEditTx]          = useState<Transaction | null>(null);
  const [expandedId,      setExpandedId]      = useState<number | null>(null);
  const [search,          setSearch]          = useState('');
  const [typeFilter,      setTypeFilter]      = useState<TypeFilter>('all');
  const [userFilter,      setUserFilter]      = useState<UserFilter>('all');
  const [monthFilter,     setMonthFilter]     = useState<MonthFilter>({ year: _now.getFullYear(), month: _now.getMonth() + 1 });
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [pickerYear,      setPickerYear]      = useState(_now.getFullYear());
  const [toast,           setToast]           = useState<Toast | null>(null);

  const nextId         = useRef(Math.max(...SEED.map(t => t.id)) + 1);
  const monthPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!showMonthPicker) return;
    function handleClickOutside(e: MouseEvent) {
      if (monthPickerRef.current && !monthPickerRef.current.contains(e.target as Node)) {
        setShowMonthPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMonthPicker]);

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
  }

  function handleAdd(data: Omit<Transaction, 'id'>) {
    const tx: Transaction = { ...data, id: nextId.current++ };
    setTxList(prev => [...prev, tx].sort((a, b) => b.date.localeCompare(a.date)));
    setShowAdd(false);
    showToast(`Transaksi "${data.merch}" berhasil ditambahkan`);
  }

  function handleEdit(data: Transaction) {
    setTxList(prev =>
      prev.map(t => t.id === data.id ? data : t)
          .sort((a, b) => b.date.localeCompare(a.date))
    );
    setEditTx(null);
    showToast(`Transaksi "${data.merch}" berhasil diperbarui`);
  }

  function handleDelete(id: number) {
    const name = txList.find(t => t.id === id)?.merch ?? 'Transaksi';
    setTxList(prev => prev.filter(t => t.id !== id));
    setEditTx(null);
    showToast(`"${name}" telah dihapus`, false);
  }

  function resetFilters() {
    setSearch('');
    setTypeFilter('all');
    setUserFilter('all');
  }

  const hasFilters = search !== '' || typeFilter !== 'all' || userFilter !== 'all';

  const filtered = useMemo(() => {
    return txList.filter(t => {
      if (monthFilter) {
        const [yStr = '0', mStr = '0'] = t.date.split('-');
        if (Number(yStr) !== monthFilter.year || Number(mStr) !== monthFilter.month) return false;
      }
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (userFilter !== 'all' && t.user !== userFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !t.merch.toLowerCase().includes(q) &&
          !(t.note ?? '').toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [txList, monthFilter, typeFilter, userFilter, search]);

  const monthLabel = monthFilter
    ? `${MONTHS_FULL[monthFilter.month - 1]} ${monthFilter.year}`
    : 'Semua Waktu';

  function handleExport() {
    const header = ['Tanggal', 'Waktu', 'Merchant', 'Kategori', 'Rekening', 'Tipe', 'Jumlah (Rp)', 'Catatan', 'Pencatat'];
    const rows = filtered.map(t => {
      const [date = '', time = ''] = t.date.split('T');
      return [
        date,
        time.substring(0, 5),
        t.merch,
        t.cat,
        accounts.find(a => a.id === t.acct)?.name ?? t.acct,
        t.type === 'income' ? 'Pemasukan' : t.type === 'expense' ? 'Pengeluaran' : 'Transfer',
        t.amount,
        t.note ?? '',
        t.user === 'H' ? 'Suami' : 'Istri',
      ];
    });

    const csv = [header, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = monthFilter
      ? `transaksi-${monthFilter.year}-${String(monthFilter.month).padStart(2, '0')}.csv`
      : 'transaksi-semua.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`${filtered.length} transaksi berhasil diekspor`);
  }

  const groups = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    for (const t of filtered) {
      const key = txDateGroupKey(t.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    }
    return Array.from(map.entries()).map(([key, txs]) => ({
      key,
      label: formatGroupLabel(key),
      txs,
    }));
  }, [filtered]);

  // Summary for filtered view
  const totalIncome  = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);

  const typeCounts: Record<TypeFilter, number> = {
    all:      txList.length,
    expense:  txList.filter(t => t.type === 'expense').length,
    income:   txList.filter(t => t.type === 'income').length,
    transfer: txList.filter(t => t.type === 'transfer').length,
  };

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
        <div style={{
          display: 'flex', gap: 12, marginBottom: 20,
        }}>
          {[
            { label: 'Pemasukan', value: totalIncome,  color: T.primaryDark, prefix: '+' },
            { label: 'Pengeluaran', value: totalExpense, color: T.danger,     prefix: '-' },
            { label: 'Selisih', value: totalIncome - totalExpense, color: (totalIncome - totalExpense) >= 0 ? T.primaryDark : T.danger, prefix: (totalIncome - totalExpense) >= 0 ? '+' : '' },
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
