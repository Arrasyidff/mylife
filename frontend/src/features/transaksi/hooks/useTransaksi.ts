"use client";
import { useState, useMemo, useRef, useEffect } from 'react';
import { transactions as SEED, accounts } from '@/lib/dashboard-data';
import { formatRp, txDateGroupKey, formatGroupLabel } from '@/lib/format';
import { MONTHS_FULL } from '../constants';
import type { Transaction } from '../types';
import type { TypeFilter, UserFilter, MonthFilter, Toast } from '../types';

export function useTransaksi() {
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

  function handleAdd(data: Omit<Transaction, 'id'>[]) {
    const txs = data.map(d => ({ ...d, id: nextId.current++ }));
    setTxList(prev => [...prev, ...txs].sort((a, b) => b.date.localeCompare(a.date)));
    setShowAdd(false);
    showToast(
      txs.length > 1
        ? `Transfer + biaya admin berhasil dicatat`
        : `Transaksi "${data[0]?.merch}" berhasil ditambahkan`
    );
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

  const totalIncome  = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);

  const typeCounts: Record<TypeFilter, number> = {
    all:      txList.length,
    expense:  txList.filter(t => t.type === 'expense').length,
    income:   txList.filter(t => t.type === 'income').length,
    transfer: txList.filter(t => t.type === 'transfer').length,
  };

  return {
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
  };
}
