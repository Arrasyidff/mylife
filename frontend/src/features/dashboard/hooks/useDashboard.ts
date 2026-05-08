'use client';
import { useState, useEffect } from 'react';
import type { Account, AccountType } from '@/features/rekening/types';
import type { Transaction } from '@/features/transaksi/types';
import { useAddTransaction } from '@/features/transaksi/hooks/useAddTransaction';
import { getDashboard } from '../services/dashboardService';
import type {
  DashboardApiResponse,
  DashboardApiAccount,
  DashboardApiTransaction,
  DashboardApiBudgetItem,
  DashboardBudget,
  Toast,
} from '../types';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const BACKEND_TO_FRONTEND_ACCOUNT_TYPE: Record<string, AccountType> = {
  TABUNGAN: 'tabungan',
  EWALLET: 'ewallet',
  TUNAI: 'tunai',
  INVESTASI: 'investasi',
  KARTU_KREDIT: 'kartukredit',
};

function mapApiAccount(apiAccount: DashboardApiAccount): Account {
  return {
    id: apiAccount.id,
    name: apiAccount.name,
    subtitle: apiAccount.subtitle,
    balance: parseFloat(apiAccount.balance),
    color: apiAccount.color,
    glyph: apiAccount.glyph,
    type: BACKEND_TO_FRONTEND_ACCOUNT_TYPE[apiAccount.type] ?? 'tabungan',
  };
}

function mapApiTransaction(
  apiTransaction: DashboardApiTransaction,
  accountInfoMap: Map<string, { name: string; color: string; glyph: string }>,
): Transaction {
  const accountInfo = accountInfoMap.get(apiTransaction.account_id);
  const absoluteAmount = parseFloat(apiTransaction.amount);
  const signedAmount = apiTransaction.type === 'INCOME' ? absoluteAmount : -absoluteAmount;

  return {
    id: apiTransaction.id,
    user: apiTransaction.recorder === 'SUAMI' ? 'H' : 'W',
    cat: apiTransaction.category,
    merch: apiTransaction.merchant,
    acct: apiTransaction.account_id,
    acct_info: accountInfo ?? { name: apiTransaction.account_name, color: '#7D9590', glyph: '?' },
    amount: signedAmount,
    date: apiTransaction.date.substring(0, 19),
    type: apiTransaction.type === 'EXPENSE' ? 'expense' : apiTransaction.type === 'INCOME' ? 'income' : 'transfer',
    note: apiTransaction.note,
  };
}

function mapApiBudget(apiBudget: DashboardApiBudgetItem): DashboardBudget {
  return {
    id: apiBudget.id,
    name: apiBudget.name,
    used: parseFloat(apiBudget.spent),
    total: parseFloat(apiBudget.total),
    cat: apiBudget.category,
    period: apiBudget.period,
  };
}

export type { Toast };

export function useDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  async function loadDashboard(month: number, year: number) {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getDashboard(month + 1, year);
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat dashboard');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard(viewMonth, viewYear);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMonth, viewYear]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  const summary = dashboardData?.monthly_summary;
  const currentMonth = MONTH_NAMES[viewMonth];
  const currentYear = viewYear;
  const isCurrentMonth = viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const totalAssets = parseFloat(dashboardData?.total_balance ?? '0');
  const totalAccounts = dashboardData?.total_accounts ?? 0;
  const monthIncome = parseFloat(summary?.total_income ?? '0');
  const monthExpense = parseFloat(summary?.total_expense ?? '0');
  const net = parseFloat(summary?.net ?? '0');
  const savingsRate = summary?.savings_rate ?? 0;

  const accounts: Account[] = (dashboardData?.accounts ?? []).map(mapApiAccount);

  const accountInfoMap = new Map(
    accounts.map(account => [account.id, { name: account.name, color: account.color, glyph: account.glyph }]),
  );

  const recentTransactions: Transaction[] = (dashboardData?.recent_transactions ?? []).map(
    apiTransaction => mapApiTransaction(apiTransaction, accountInfoMap),
  );

  const budgets: DashboardBudget[] = (dashboardData?.budget_overview ?? []).map(mapApiBudget);
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.total, 0);
  const totalUsed = budgets.reduce((sum, budget) => sum + budget.used, 0);
  const alertCount = budgets.filter(budget => budget.total > 0 && (budget.used / budget.total) >= 0.75).length;

  const lastTxByAcct: Record<string, string> = {};
  recentTransactions.forEach(transaction => {
    if (!lastTxByAcct[transaction.acct] || transaction.date > lastTxByAcct[transaction.acct]) {
      lastTxByAcct[transaction.acct] = transaction.date;
    }
  });

  const tunaiAccounts = accounts.filter(account => account.type === 'tunai');
  const otherAccounts = accounts
    .filter(account => account.type !== 'tunai')
    .sort((accountA, accountB) =>
      (lastTxByAcct[accountB.id] ?? '').localeCompare(lastTxByAcct[accountA.id] ?? ''),
    )
    .slice(0, 3);
  const displayedAccounts = [...otherAccounts, ...tunaiAccounts];

  const now = new Date();
  const lastDayOfMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysLeft = lastDayOfMonth - now.getDate();

  function showToast(message: string, isSuccess = true) {
    setToast({ msg: message, ok: isSuccess });
  }

  const { handleAdd, isSubmitting } = useAddTransaction({
    onSuccess: async () => {
      setShowAdd(false);
      await loadDashboard(viewMonth, viewYear);
    },
    showToast,
  });

  return {
    isLoading,
    isSubmitting,
    error,
    accounts,
    showAdd,
    setShowAdd,
    toast,
    viewMonth,
    viewYear,
    setViewMonth,
    setViewYear,
    isCurrentMonth,
    totalAssets,
    totalAccounts,
    displayedAccounts,
    budgets,
    recentTransactions,
    monthIncome,
    monthExpense,
    net,
    savingsRate,
    currentMonth,
    currentYear,
    daysLeft,
    totalBudget,
    totalUsed,
    alertCount,
    handleAdd,
  };
}
