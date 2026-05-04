'use client';
import Link from 'next/link';
import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';
import { Surface } from '@/components/ui/surface';
import { Pill } from '@/components/ui/pill';
import { Btn } from '@/components/ui/btn';
import { Icon } from '@/components/ui/icon';
import { AccountCard } from '@/features/rekening/components/AccountCard';
import { TxRow } from '@/features/transaksi/components/TxRow';
import { AddTransactionModal } from '@/features/transaksi/components/AddTransactionModal';
import { CheckCircle, XCircle, AlertTriangle, ArrowUp, ArrowDown, ChevronDown } from 'lucide-react';
import { SummaryStat } from './SummaryStat';
import { BudgetRow } from './BudgetRow';
import { useDashboard } from '../hooks/useDashboard';

export function DashboardPage() {
  const {
    txList, showAdd, setShowAdd, toast,
    selectedMonth, setSelectedMonth,
    showMonthPicker, setShowMonthPicker, monthPickerRef,
    totalAssets, availableMonths, displayedAccounts, lastTxByAcct,
    budgets, monthTxList, monthIncome, monthExpense, net,
    currentMonth, currentYear, isCurrentMonth, daysLeft,
    totalBudget, totalUsed, alertCount,
    handleAdd,
  } = useDashboard();

  return (
    <div className="font-sans">

      {/* Toast */}
      {toast && (
        <div
          className="fixed top-5 right-6 bg-white rounded-[10px] py-3 px-4 shadow-[0_4px_20px_rgba(20,30,25,0.12)] flex items-center gap-2.5 z-[100] max-w-[340px]"
          style={{
            border:     `1px solid ${toast.ok ? T.primary : T.danger}44`,
            borderLeft: `4px solid ${toast.ok ? T.primary : T.danger}`,
          }}
        >
          {toast.ok
            ? <CheckCircle size={16} color={T.primary} />
            : <XCircle size={16} color={T.danger} />
          }
          <span className="text-[13px] font-semibold text-[#1A2420]">{toast.msg}</span>
        </div>
      )}

      {/* Page header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="m-0 text-xl font-bold text-[#1A2420] tracking-[-0.3px]">Dashboard</h1>
          <div className="text-[12.5px] text-[#A4B8B2] mt-0.75">
            {isCurrentMonth
              ? `${new Date(2026, 3, 27).getDate()} ${currentMonth} ${currentYear} · ${daysLeft} hari tersisa bulan ini`
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
              <div className="absolute top-[calc(100%+6px)] right-0 bg-white border border-[#E0EAE6] rounded-[10px] shadow-[0_8px_24px_rgba(20,30,25,0.12)] min-w-42.5 z-50 overflow-hidden">
                {availableMonths.map(({ value, label }) => {
                  const active = value === selectedMonth;
                  return (
                    <button
                      key={value}
                      onClick={() => { setSelectedMonth(value); setShowMonthPicker(false); }}
                      className={`block w-full text-left py-[9px] px-[14px] border-0 cursor-pointer text-[13px] ${active ? 'font-bold' : 'font-normal'}`}
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
          <Btn kind="primary" size="sm" icon={Icon.plus(14)} onClick={() => setShowAdd(true)}>
            Tambah Transaksi
          </Btn>
        </div>
      </div>

      {/* Hero summary stats */}
      <div className="flex gap-3.5 mb-6">
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
      <div className="flex items-center justify-between mb-3">
        <h2 className="m-0 text-xs font-semibold text-[#7D9590] tracking-[0.5px] uppercase">
          Rekening
        </h2>
        <Link href="/rekening" className="text-[12.5px] text-[#15735A] font-semibold no-underline">
          Kelola →
        </Link>
      </div>
      <div className="flex gap-3.5 mb-6">
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
      <div className="grid grid-cols-2 gap-[18px]">

        {/* Anggaran */}
        <Surface pad={20}>
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="m-0 text-[15px] font-bold text-[#1A2420]">
                Anggaran {currentMonth} {currentYear}
              </h3>
              <div className="text-xs text-[#A4B8B2] mt-0.75">
                {formatRp(totalUsed)} dari {formatRp(totalBudget)} terpakai
              </div>
            </div>
            {alertCount > 0 && (
              <Pill tone="warning" icon={<AlertTriangle size={11} />}>
                {alertCount} kategori dekat batas
              </Pill>
            )}
          </div>
          <div className="mt-3">
            {budgets.slice(0, 5).map(b => <BudgetRow key={b.id} b={b} />)}
          </div>
          <Link href="/anggaran" className="block text-center mt-3 text-[12.5px] text-[#15735A] font-semibold no-underline">
            Lihat semua anggaran →
          </Link>
        </Surface>

        {/* Transaksi terkini */}
        <Surface pad={20}>
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="m-0 text-[15px] font-bold text-[#1A2420]">Transaksi Terkini</h3>
              <div className="text-xs text-[#A4B8B2] mt-0.75">
                {monthTxList.length} transaksi {currentMonth} {currentYear}
              </div>
            </div>
          </div>
          <div className="mt-2">
            {monthTxList.slice(0, 7).map(t => <TxRow key={t.id} t={t} />)}
          </div>
          <Link href="/transaksi" className="block text-center mt-3 text-[12.5px] text-[#15735A] font-semibold no-underline">
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
