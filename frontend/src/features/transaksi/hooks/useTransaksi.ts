"use client";
import { useState, useEffect } from 'react';
import { listAccounts } from '@/features/rekening/services/rekeningService';
import { listTransaksi, updateTransaksi, deleteTransaksi } from '../services/transaksiService';
import { useAddTransaction } from './useAddTransaction';
import { txDateGroupKey, formatGroupLabel } from '@/lib/format';
import { MONTHS_FULL } from '../constants';
import type { Account } from '@/features/rekening/types';
import type { Transaction, TypeFilter, UserFilter, MonthFilter, Toast } from '../types';

export function useTransaksi() {
  const now = new Date();

  const [transactionList,    setTransactionList]    = useState<Transaction[]>([]);
  const [accounts,           setAccounts]           = useState<Account[]>([]);
  const [isLoading,          setIsLoading]          = useState(true);
  const [isEditSubmitting,   setIsEditSubmitting]   = useState(false);
  const [showAdd,            setShowAdd]            = useState(false);
  const [editTx,             setEditTx]             = useState<Transaction | null>(null);
  const [expandedId,         setExpandedId]         = useState<number | null>(null);
  const [search,             setSearch]             = useState('');
  const [typeFilter,         setTypeFilter]         = useState<TypeFilter>('all');
  const [userFilter,         setUserFilter]         = useState<UserFilter>('all');
  const [monthFilter,        setMonthFilter]        = useState<MonthFilter>({ year: now.getFullYear(), month: now.getMonth() + 1 });
  const [pickerYear,         setPickerYear]         = useState(now.getFullYear());
  const [toast,              setToast]              = useState<Toast | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [monthFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadAccounts() {
    try {
      const result = await listAccounts();
      setAccounts(result.accounts);
    } catch {
      showToast('Gagal memuat rekening', false);
    }
  }

  async function loadTransactions() {
    setIsLoading(true);
    try {
      const params: Parameters<typeof listTransaksi>[0] = {};

      if (monthFilter) {
        const paddedMonth  = String(monthFilter.month).padStart(2, '0');
        const lastDay      = new Date(monthFilter.year, monthFilter.month, 0).getDate();
        params.date_from   = `${monthFilter.year}-${paddedMonth}-01`;
        params.date_to     = `${monthFilter.year}-${paddedMonth}-${lastDay}`;
      }

      const result = await listTransaksi(params);
      setTransactionList(result.transactions);
    } catch {
      showToast('Gagal memuat transaksi', false);
    } finally {
      setIsLoading(false);
    }
  }

  function showToast(message: string, isSuccess = true) {
    setToast({ msg: message, ok: isSuccess });
  }

  const { handleAdd, isSubmitting: isAddSubmitting } = useAddTransaction({
    onSuccess: async () => {
      await loadTransactions();
      setShowAdd(false);
    },
    showToast,
  });

  async function handleEdit(updatedTransaction: Transaction) {
    setIsEditSubmitting(true);
    try {
      await Promise.all([
        updateTransaksi(updatedTransaction.id, {
          user:          updatedTransaction.user,
          cat:           updatedTransaction.cat,
          merch:         updatedTransaction.merch,
          acct:          updatedTransaction.acct,
          to_account_id: updatedTransaction.to_account_id,
          amount:        Math.abs(updatedTransaction.amount),
          date:          updatedTransaction.date,
          type:          updatedTransaction.type,
          note:          updatedTransaction.note,
        }),
        new Promise<void>(resolve => setTimeout(resolve, 500)),
      ]);
      await loadTransactions();
      setEditTx(null);
      showToast(`Transaksi "${updatedTransaction.merch}" berhasil diperbarui`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Gagal memperbarui transaksi', false);
    } finally {
      setIsEditSubmitting(false);
    }
  }

  async function handleDelete(transactionId: number) {
    const transactionName = transactionList.find(transaction => transaction.id === transactionId)?.merch ?? 'Transaksi';
    try {
      await deleteTransaksi(transactionId);
      await loadTransactions();
      setEditTx(null);
      showToast(`"${transactionName}" telah dihapus`, false);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Gagal menghapus transaksi', false);
    }
  }

  function resetFilters() {
    setSearch('');
    setTypeFilter('all');
    setUserFilter('all');
  }

  const hasFilters = search !== '' || typeFilter !== 'all' || userFilter !== 'all';

  const filtered = transactionList.filter(transaction => {
    if (typeFilter !== 'all' && transaction.type !== typeFilter) return false;
    if (userFilter !== 'all' && transaction.user !== userFilter) return false;
    if (search.trim()) {
      const query = search.toLowerCase();
      if (
        !transaction.merch.toLowerCase().includes(query) &&
        !(transaction.note ?? '').toLowerCase().includes(query)
      ) return false;
    }
    return true;
  });

  const monthLabel = monthFilter
    ? `${MONTHS_FULL[monthFilter.month - 1]} ${monthFilter.year}`
    : 'Semua Waktu';

  function handleExport() {
    const header = ['Tanggal', 'Waktu', 'Merchant', 'Kategori', 'Rekening', 'Tipe', 'Jumlah (Rp)', 'Catatan', 'Pencatat'];
    const rows = filtered.map(transaction => {
      const [date = '', time = ''] = transaction.date.split('T');
      return [
        date,
        time.substring(0, 5),
        transaction.merch,
        transaction.cat,
        transaction.acct_info?.name ?? transaction.acct,
        transaction.type === 'income' ? 'Pemasukan' : transaction.type === 'expense' ? 'Pengeluaran' : 'Transfer',
        transaction.amount,
        transaction.note ?? '',
        transaction.user === 'H' ? 'Suami' : 'Istri',
      ];
    });

    const csv = [header, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href     = url;
    anchor.download = monthFilter
      ? `transaksi-${monthFilter.year}-${String(monthFilter.month).padStart(2, '0')}.csv`
      : 'transaksi-semua.csv';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    showToast(`${filtered.length} transaksi berhasil diekspor`);
  }

  const groups = (() => {
    const groupMap = new Map<string, Transaction[]>();
    for (const transaction of filtered) {
      const key = txDateGroupKey(transaction.date);
      if (!groupMap.has(key)) groupMap.set(key, []);
      groupMap.get(key)!.push(transaction);
    }
    return Array.from(groupMap.entries()).map(([key, transactions]) => ({
      key,
      label: formatGroupLabel(key),
      txs:   transactions,
    }));
  })();

  const totalIncome  = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const typeCounts: Record<TypeFilter, number> = {
    all:      transactionList.length,
    expense:  transactionList.filter(t => t.type === 'expense').length,
    income:   transactionList.filter(t => t.type === 'income').length,
    transfer: transactionList.filter(t => t.type === 'transfer').length,
  };

  const isSubmitting = isAddSubmitting || isEditSubmitting;

  return {
    txList: transactionList,
    filtered,
    groups,
    accounts,
    isLoading,
    isSubmitting,
    showAdd,         setShowAdd,
    editTx,          setEditTx,
    expandedId,      setExpandedId,
    search,          setSearch,
    typeFilter,      setTypeFilter,
    userFilter,      setUserFilter,
    monthFilter,     setMonthFilter,
    pickerYear,      setPickerYear,
    toast,
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
    showToast,
  };
}
