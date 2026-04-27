"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { accounts, budgets, transactions, type Transaction } from '@/lib/dashboard-data';
import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';
import { Surface } from '@/components/ui/surface';
import { Pill } from '@/components/ui/pill';
import { Btn } from '@/components/ui/btn';
import { Icon } from '@/components/ui/icon';
import { AccountCard } from '@/components/dashboard/account-card';
import { SummaryStat } from '@/components/dashboard/summary-stat';
import { BudgetRow } from '@/components/dashboard/budget-row';
import { TxRow } from '@/components/dashboard/tx-row';
import { AddTransactionModal } from '@/components/dashboard/add-transaction-modal';
import { CheckCircle, XCircle, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';

const MONTH_NAMES = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

const MONTH_INCOME  = 14_750_000;
const MONTH_EXPENSE =  9_412_500;

// Mock "today" sesuai data
const TODAY = new Date(2026, 3, 27);

type Toast = { msg: string; ok: boolean };

export default function DashboardPage() {
  const [txList, setTxList] = useState<Transaction[]>(transactions);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const totalAssets = accounts.reduce((s, a) => s + a.balance, 0);
  const net = MONTH_INCOME - MONTH_EXPENSE;

  const currentMonth = MONTH_NAMES[TODAY.getMonth()];
  const currentYear  = TODAY.getFullYear();
  const lastDay      = new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 0).getDate();
  const daysLeft     = lastDay - TODAY.getDate();

  const totalBudget  = budgets.reduce((s, b) => s + b.total, 0);
  const totalUsed    = budgets.reduce((s, b) => s + b.used,  0);
  const alertCount   = budgets.filter(b => (b.used / b.total) >= 0.75).length;

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  function handleAdd(data: Omit<Transaction, 'id'>) {
    const tx: Transaction = { ...data, id: Date.now() };
    setTxList(prev => [...prev, tx].sort((a, b) => b.date.localeCompare(a.date)));
    setShowAdd(false);
    setToast({ msg: `Transaksi "${data.merch}" berhasil ditambahkan`, ok: true });
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
            {TODAY.getDate()} {currentMonth} {currentYear} · {daysLeft} hari tersisa bulan ini
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <Btn kind="ghost" size="sm" icon={Icon.calendar(14)}>
            {currentMonth} {currentYear}
          </Btn>
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
          label="Pemasukan Bulan Ini"
          value={formatRp(MONTH_INCOME)}
          delta="vs Rp 14.500.000 lalu"
          deltaTone="up"
          icon={<ArrowUp size={13} color={T.primary} />}
        />
        <SummaryStat
          label="Pengeluaran Bulan Ini"
          value={formatRp(MONTH_EXPENSE)}
          delta="73% dari rata-rata"
          deltaTone="down"
          icon={<ArrowDown size={13} color={T.danger} />}
        />
        <SummaryStat
          label="Net Bulan Ini"
          value={formatRp(net)}
          delta="Surplus sehat"
          deltaTone="up"
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
        {accounts.map(a => <AccountCard key={a.id} acct={a} />)}
      </div>

      {/* Two-column: anggaran + transaksi */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>

        {/* Anggaran */}
        <Surface pad={20}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>
                Anggaran {currentMonth}
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
                {txList.length} transaksi bulan ini
              </div>
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            {txList.slice(0, 7).map(t => <TxRow key={t.id} t={t} />)}
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
