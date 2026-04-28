"use client";
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { type Transaction, type Account, type Budget, type AccountType, type BudgetPeriod } from '@/lib/dashboard-data';
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
import { dashboardService, type DashboardApiResponse, type DashboardAccountItem, type DashboardTransactionItem, type DashboardBudgetItem } from '@/lib/services/dashboard';
import { transactionService, toCreatePayload } from '@/lib/services/transaction';

const MONTH_NAMES = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

const ACCOUNT_TYPE_MAP: Record<string, AccountType> = {
  TABUNGAN: 'tabungan',
  EWALLET: 'ewallet',
  TUNAI: 'tunai',
  INVESTASI: 'investasi',
  KARTU_KREDIT: 'kartukredit',
};

const TX_TYPE_MAP: Record<string, Transaction['type']> = {
  EXPENSE: 'expense',
  INCOME: 'income',
  TRANSFER: 'transfer',
};

const RECORDER_MAP: Record<string, 'H' | 'W'> = {
  SUAMI: 'H',
  ISTRI: 'W',
};

function toLocalIso(dateVal: string | Date): string {
  const d = new Date(dateVal);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function mapAccount(a: DashboardAccountItem): Account {
  return {
    id: a.id,
    name: a.name,
    subtitle: a.subtitle ?? '',
    balance: parseFloat(a.balance),
    color: a.color,
    glyph: a.glyph,
    type: ACCOUNT_TYPE_MAP[a.type] ?? 'tabungan',
  };
}

function mapBudget(b: DashboardBudgetItem): Budget {
  return {
    id: b.id,
    name: b.name,
    used: parseFloat(b.spent),
    total: parseFloat(b.total),
    cat: b.category,
    period: b.period.toLowerCase() as BudgetPeriod,
  };
}

type DashTx = Transaction & { acctInfo: { name: string; color: string } };

function mapTransaction(t: DashboardTransactionItem, accounts: DashboardAccountItem[]): DashTx {
  const type = TX_TYPE_MAP[t.type] ?? 'expense';
  const amount = parseFloat(t.amount);
  const acctColor = accounts.find(a => a.name === t.account_name)?.color ?? '#888';
  return {
    id: t.id,
    user: RECORDER_MAP[t.recorder] ?? 'H',
    cat: t.category,
    merch: t.merchant,
    acct: '',
    amount: type === 'expense' ? -amount : amount,
    date: toLocalIso(t.date),
    type,
    note: t.note ?? undefined,
    acctInfo: { name: t.account_name, color: acctColor },
  };
}

type Toast = { msg: string; ok: boolean };

export default function DashboardPage() {
  const [data, setData] = useState<DashboardApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      setError(null);
      const result = await dashboardService.get();
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  async function handleAdd(txs: Omit<Transaction, 'id'>[]) {
    setSaving(true);
    try {
      for (const tx of txs) {
        await transactionService.create(toCreatePayload(tx));
      }
      setShowAdd(false);
      setToast({
        msg: txs.length > 1
          ? 'Transfer + biaya admin berhasil dicatat'
          : `Transaksi "${txs[0]?.merch}" berhasil ditambahkan`,
        ok: true,
      });
      await fetchDashboard();
    } catch (e) {
      setToast({
        msg: e instanceof Error ? e.message : 'Gagal menyimpan transaksi',
        ok: false,
      });
    } finally {
      setSaving(false);
    }
  }

  const today = new Date();
  const summary = data?.monthly_summary;
  const currentMonth = summary ? MONTH_NAMES[summary.month - 1] : '';
  const currentYear  = summary?.year ?? today.getFullYear();
  const lastDay  = summary ? new Date(summary.year, summary.month, 0).getDate() : 0;
  const daysLeft = summary ? lastDay - today.getDate() : 0;

  const accounts   = (data?.accounts ?? []).map(mapAccount);
  const budgets    = (data?.budget_overview ?? []).map(mapBudget);
  const txList     = (data?.recent_transactions ?? []).map(t => mapTransaction(t, data?.accounts ?? []));

  const totalAssets  = parseFloat(data?.total_balance ?? '0');
  const monthIncome  = parseFloat(summary?.total_income  ?? '0');
  const monthExpense = parseFloat(summary?.total_expense ?? '0');
  const net          = parseFloat(summary?.net           ?? '0');

  const totalBudget = budgets.reduce((s, b) => s + b.total, 0);
  const totalUsed   = budgets.reduce((s, b) => s + b.used,  0);
  const alertCount  = (data?.budget_overview ?? []).filter(b => b.percentage_used >= 75).length;

  if (loading) {
    return (
      <div style={{ fontFamily: T.fontSans, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <div style={{ textAlign: 'center', color: T.textSubtle }}>
          <div style={{ fontSize: 13 }}>Memuat dashboard…</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ fontFamily: T.fontSans, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: T.danger, marginBottom: 12 }}>{error}</div>
          <Btn kind="ghost" size="sm" onClick={fetchDashboard}>Coba lagi</Btn>
        </div>
      </div>
    );
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
            {today.getDate()} {currentMonth} {currentYear} · {daysLeft} hari tersisa bulan ini
          </div>
        </div>
        <Btn kind="primary" size="sm" icon={Icon.plus(14)} onClick={() => setShowAdd(true)}>
          Tambah Transaksi
        </Btn>
      </div>

      {/* Hero summary stats */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
        <SummaryStat
          large
          label="TOTAL ASET"
          value={formatRp(totalAssets)}
        />
        <SummaryStat
          label={`Pemasukan ${currentMonth}`}
          value={formatRp(monthIncome)}
          delta={`${txList.filter(tx => tx.type === 'income').length} transaksi masuk`}
          deltaTone="up"
          icon={<ArrowUp size={13} color={T.primary} />}
        />
        <SummaryStat
          label={`Pengeluaran ${currentMonth}`}
          value={formatRp(monthExpense)}
          delta={`${txList.filter(tx => tx.type === 'expense').length} transaksi keluar`}
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
        {accounts.slice(0, 4).map(a => {
          const lastTx = txList.find(tx => tx.acctInfo.name === a.name);
          return (
            <AccountCard
              key={a.id}
              acct={a}
              lastTxAmount={lastTx?.amount}
              lastUpdated={lastTx?.date}
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
                {txList.length} transaksi terakhir
              </div>
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            {txList.map(t => (
              <TxRow
                key={t.id}
                t={t}
                acctInfo={t.acctInfo}
              />
            ))}
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
        <AddTransactionModal
          accounts={accounts}
          budgets={budgets}
          onClose={() => setShowAdd(false)}
          onSave={saving ? () => {} : handleAdd}
        />
      )}
    </div>
  );
}
