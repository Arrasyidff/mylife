"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { accounts, budgets, transactions, type Transaction } from '@/lib/dashboard-data';
import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';
import { Surface } from '@/components/ui/surface';
import { Pill } from '@/components/ui/pill';
import { Btn } from '@/components/ui/btn';
import { Icon } from '@/components/ui/icon';
import { AccountCard } from '@/features/rekening/components/AccountCard';
import { SummaryStat } from '@/components/dashboard/summary-stat';
import { BudgetRow } from '@/components/dashboard/budget-row';
import { TxRow } from '@/components/dashboard/tx-row';
import { AddTransactionModal } from '@/components/dashboard/add-transaction-modal';
import { CheckCircle, XCircle, AlertTriangle, ArrowUp, ArrowDown, ChevronDown } from 'lucide-react';

const MONTH_NAMES = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

// Mock "today" sesuai data
const TODAY = new Date(2026, 3, 27);
const TODAY_PREFIX = `${TODAY.getFullYear()}-${String(TODAY.getMonth() + 1).padStart(2, '0')}`;

type Toast = { msg: string; ok: boolean };

export default function DashboardPage() {
  const [txList, setTxList] = useState<Transaction[]>(transactions);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(TODAY_PREFIX);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const monthPickerRef = useRef<HTMLDivElement>(null);

  const totalAssets = accounts.reduce((s, a) => s + a.balance, 0);

  // Bulan yang tersedia dari data transaksi
  const availableMonths = Array.from(new Set(txList.map(tx => tx.date.slice(0, 7)))).sort().reverse();

  // Rekening: selalu tampilkan Tunai + 3 rekening dengan transaksi terbaru
  const lastTxByAcct: Record<string, string> = {};
  txList.forEach(tx => {
    if (!lastTxByAcct[tx.acct] || tx.date > lastTxByAcct[tx.acct]) {
      lastTxByAcct[tx.acct] = tx.date;
    }
  });
  const tunaiAccounts = accounts.filter(a => a.type === 'tunai');
  const recentAccounts = accounts
    .filter(a => a.type !== 'tunai')
    .sort((a, b) => (lastTxByAcct[b.id] ?? '').localeCompare(lastTxByAcct[a.id] ?? ''))
    .slice(0, 3);
  const displayedAccounts = [...recentAccounts, ...tunaiAccounts];

  const monthTxList = txList.filter(tx => tx.date.startsWith(selectedMonth));
  const monthIncome  = monthTxList.filter(tx => tx.type === 'income').reduce((s, tx) => s + tx.amount, 0);
  const monthExpense = monthTxList.filter(tx => tx.type === 'expense').reduce((s, tx) => s + Math.abs(tx.amount), 0);
  const net = monthIncome - monthExpense;

  const [selYear, selMonthIdx] = selectedMonth.split('-').map(Number);
  const currentMonth = MONTH_NAMES[selMonthIdx - 1];
  const currentYear  = selYear;

  const isCurrentMonth = selectedMonth === TODAY_PREFIX;
  const lastDay  = new Date(selYear, selMonthIdx, 0).getDate();
  const daysLeft = isCurrentMonth ? lastDay - TODAY.getDate() : 0;

  const totalBudget  = budgets.reduce((s, b) => s + b.total, 0);
  const totalUsed    = budgets.reduce((s, b) => s + b.used,  0);
  const alertCount   = budgets.filter(b => (b.used / b.total) >= 0.75).length;

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (monthPickerRef.current && !monthPickerRef.current.contains(e.target as Node)) {
        setShowMonthPicker(false);
      }
    }
    if (showMonthPicker) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMonthPicker]);

  function handleAdd(data: Omit<Transaction, 'id'>[]) {
    const txs = data.map((d, i) => ({ ...d, id: Date.now() + i }));
    setTxList(prev => [...prev, ...txs].sort((a, b) => b.date.localeCompare(a.date)));
    setShowAdd(false);
    setToast({
      msg: txs.length > 1
        ? `Transfer + biaya admin berhasil dicatat`
        : `Transaksi "${data[0]?.merch}" berhasil ditambahkan`,
      ok: true,
    });
  }

  return (
    <div style={{ fontFamily: T.fontSans }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 24,
          background: T.surface,
          border: `1px solid ${toast.ok ? T.primary : T.danger}44`,
          borderLeft: `4px solid ${toast.ok ? T.primary : T.danger}`,
          borderRadius: 10, padding: '12px 16px',
          boxShadow: '0 4px 20px rgba(20,30,25,0.12)',
          display: 'flex', alignItems: 'center', gap: 10,
          zIndex: 100, maxWidth: 340,
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
            Dashboard
          </h1>
          <div style={{ fontSize: 12.5, color: T.textSubtle, marginTop: 3 }}>
            {isCurrentMonth
              ? `${TODAY.getDate()} ${currentMonth} ${currentYear} · ${daysLeft} hari tersisa bulan ini`
              : `Menampilkan data ${currentMonth} ${currentYear}`}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <div ref={monthPickerRef} style={{ position: 'relative' }}>
            <Btn
              kind="ghost"
              size="sm"
              icon={Icon.calendar(14)}
              onClick={() => setShowMonthPicker(v => !v)}
            >
              {currentMonth} {currentYear}
              <ChevronDown size={12} style={{ marginLeft: 2 }} />
            </Btn>
            {showMonthPicker && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                boxShadow: '0 8px 24px rgba(20,30,25,0.12)',
                minWidth: 170, zIndex: 50,
                overflow: 'hidden',
              }}>
                {availableMonths.map(ym => {
                  const [y, m] = ym.split('-').map(Number);
                  const label = `${MONTH_NAMES[m - 1]} ${y}`;
                  const active = ym === selectedMonth;
                  return (
                    <button
                      key={ym}
                      onClick={() => { setSelectedMonth(ym); setShowMonthPicker(false); }}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        padding: '9px 14px', border: 'none', cursor: 'pointer',
                        fontSize: 13, fontWeight: active ? 700 : 400,
                        color: active ? T.primary : T.text,
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
          <Btn kind="primary" size="sm" icon={Icon.plus(14)} onClick={() => setShowAdd(true)}>
            Tambah Transaksi
          </Btn>
        </div>
      </div>

      {/* Hero summary stats */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
        <SummaryStat
          large
          label="TOTAL ASET"
          value={formatRp(totalAssets)}
          delta="+ Rp 1.420.000 dari bulan lalu"
        />
        <SummaryStat
          label={`Pemasukan ${currentMonth}`}
          value={formatRp(monthIncome)}
          delta={`${monthTxList.filter(tx => tx.type === 'income').length} transaksi masuk`}
          deltaTone="up"
          icon={<ArrowUp size={13} color={T.primary} />}
        />
        <SummaryStat
          label={`Pengeluaran ${currentMonth}`}
          value={formatRp(monthExpense)}
          delta={`${monthTxList.filter(tx => tx.type === 'expense').length} transaksi keluar`}
          deltaTone="down"
          icon={<ArrowDown size={13} color={T.danger} />}
        />
        <SummaryStat
          label={`Net ${currentMonth}`}
          value={formatRp(net)}
          delta={net >= 0 ? `Surplus ${currentMonth}` : `Defisit ${currentMonth}`}
          deltaTone={net >= 0 ? 'up' : 'down'}
        />
      </div>

      {/* Rekening */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 style={{
          margin: 0, fontSize: 12, fontWeight: 600,
          color: T.textMuted, letterSpacing: 0.5, textTransform: 'uppercase',
        }}>
          Rekening
        </h2>
        <Link href="/rekening" style={{ fontSize: 12.5, color: T.primaryDark, fontWeight: 600, textDecoration: 'none' }}>
          Kelola →
        </Link>
      </div>
      <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
        {displayedAccounts.map(a => {
          const lastDate = lastTxByAcct[a.id];
          const lastTx = lastDate ? txList.find(tx => tx.acct === a.id && tx.date === lastDate) : undefined;
          return (
            <AccountCard
              key={a.id}
              acct={a}
              lastTx={lastTx}
              lastUpdated={lastDate}
            />
          );
        })}
      </div>

      {/* Two-column: anggaran + transaksi */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>

        {/* Anggaran */}
        <Surface pad={20}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>
                Anggaran {currentMonth} {currentYear}
              </h3>
              <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 3 }}>
                {formatRp(totalUsed)} dari {formatRp(totalBudget)} terpakai
              </div>
            </div>
            {alertCount > 0 && (
              <Pill tone="warning" icon={<AlertTriangle size={11} />}>
                {alertCount} kategori dekat batas
              </Pill>
            )}
          </div>
          <div style={{ marginTop: 12 }}>
            {budgets.slice(0, 5).map(b => <BudgetRow key={b.id} b={b} />)}
          </div>
          <Link href="/anggaran" style={{
            display: 'block', textAlign: 'center', marginTop: 12,
            fontSize: 12.5, color: T.primaryDark, fontWeight: 600, textDecoration: 'none',
          }}>
            Lihat semua anggaran →
          </Link>
        </Surface>

        {/* Transaksi terkini */}
        <Surface pad={20}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>Transaksi Terkini</h3>
              <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 3 }}>
                {monthTxList.length} transaksi {currentMonth} {currentYear}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            {monthTxList.slice(0, 7).map(t => <TxRow key={t.id} t={t} />)}
          </div>
          <Link href="/transaksi" style={{
            display: 'block', textAlign: 'center', marginTop: 12,
            fontSize: 12.5, color: T.primaryDark, fontWeight: 600, textDecoration: 'none',
          }}>
            Lihat semua transaksi →
          </Link>
        </Surface>
      </div>

      {showAdd && (
        <AddTransactionModal onClose={() => setShowAdd(false)} onSave={handleAdd} />
      )}
    </div>
  );
}
