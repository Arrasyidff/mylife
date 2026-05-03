"use client";
import { useState, useEffect } from 'react';
import { accounts as INITIAL_ACCOUNTS, transactions } from '@/lib/dashboard-data';
import type { Account, Transaction } from '../types';

type Toast = { msg: string; ok: boolean };

export function useRekening() {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
  }

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  function handleAdd(account: Account) {
    setAccounts(prev => [...prev, account]);
    showToast(`Rekening "${account.name}" berhasil ditambahkan`);
  }

  function handleSave(updated: Account) {
    setAccounts(prev => prev.map(a => a.id === updated.id ? updated : a));
    showToast(`Rekening "${updated.name}" berhasil diperbarui`);
  }

  function handleTransfer(_txs: Omit<Transaction, 'id'>[]) {
    setShowTransferModal(false);
    showToast('Transfer berhasil dicatat');
  }

  function handleDelete(id: string) {
    const name = accounts.find(a => a.id === id)?.name ?? '';
    setAccounts(prev => prev.filter(a => a.id !== id));
    showToast(`Rekening "${name}" telah dihapus`, false);
  }

  function handleToggleHide(id: string) {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, hidden: !a.hidden } : a));
  }

  const visibleAccounts = accounts.filter(a => !a.hidden);
  const totalBalance = visibleAccounts.reduce((s, a) => s + a.balance, 0);
  const hiddenCount = accounts.length - visibleAccounts.length;
  const monthlyNet = transactions
    .filter(t => t.type !== 'transfer' && visibleAccounts.some(a => a.id === t.acct))
    .reduce((s, t) => s + t.amount, 0);

  return {
    accounts,
    visibleAccounts,
    totalBalance,
    hiddenCount,
    monthlyNet,
    showAddModal,
    showTransferModal,
    editingAccount,
    toast,
    setShowAddModal,
    setShowTransferModal,
    setEditingAccount,
    handleAdd,
    handleSave,
    handleTransfer,
    handleDelete,
    handleToggleHide,
  };
}
