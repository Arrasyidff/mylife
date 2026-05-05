'use client';
import { useState, useEffect, useRef } from 'react';
import { accounts, budgets, transactions, type Transaction } from '@/lib/dashboard-data';

const MONTH_NAMES = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

// Mock "today" sesuai data
const TODAY = new Date(2026, 3, 27);
const TODAY_PREFIX = `${TODAY.getFullYear()}-${String(TODAY.getMonth() + 1).padStart(2, '0')}`;

export type Toast = { msg: string; ok: boolean };

export type MonthOption = { value: string; label: string };

export function useDashboard() {
  const [txList, setTxList] = useState<Transaction[]>(transactions);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(TODAY_PREFIX);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const monthPickerRef = useRef<HTMLDivElement>(null);

  const totalAssets = accounts.reduce((s, a) => s + a.balance, 0);

  const availableMonths: MonthOption[] = Array.from(
    new Set(txList.map(tx => tx.date.slice(0, 7)))
  ).sort().reverse().map(ym => {
    const [y, m] = ym.split('-').map(Number);
    return { value: ym, label: `${MONTH_NAMES[m - 1]} ${y}` };
  });

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

  const totalBudget = budgets.reduce((s, b) => s + b.total, 0);
  const totalUsed   = budgets.reduce((s, b) => s + b.used,  0);
  const alertCount  = budgets.filter(b => (b.used / b.total) >= 0.75).length;

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

  return {
    txList,
    accounts,
    showAdd,
    setShowAdd,
    toast,
    selectedMonth,
    setSelectedMonth,
    showMonthPicker,
    setShowMonthPicker,
    monthPickerRef,
    totalAssets,
    availableMonths,
    displayedAccounts,
    lastTxByAcct,
    budgets,
    monthTxList,
    monthIncome,
    monthExpense,
    net,
    currentMonth,
    currentYear,
    isCurrentMonth,
    daysLeft,
    totalBudget,
    totalUsed,
    alertCount,
    handleAdd,
  };
}
