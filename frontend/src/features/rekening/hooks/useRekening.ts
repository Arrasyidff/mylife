"use client";
import { useState, useEffect } from 'react';
import type { Account, CreateAccountInput, UpdateAccountInput } from '../types';
import {
  listAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from '../services/rekeningService';

type Toast = { msg: string; ok: boolean };

export function useRekening() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
  }

  useEffect(() => {
    if (!toast) return;
    const toastTimer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(toastTimer);
  }, [toast]);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const { accounts: fetchedAccounts } = await listAccounts(true);
        setAccounts(fetchedAccounts);
      } catch {
        showToast('Gagal memuat rekening', false);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAccounts();
  }, []);

  async function handleAdd(input: CreateAccountInput) {
    try {
      const newAccount = await createAccount(input);
      setAccounts(prev => [...prev, newAccount]);
      setShowAddModal(false);
      showToast(`Rekening "${newAccount.name}" berhasil ditambahkan`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Gagal menambah rekening', false);
    }
  }

  async function handleSave(accountId: string, input: UpdateAccountInput) {
    try {
      const updatedAccount = await updateAccount(accountId, input);
      setAccounts(prev =>
        prev.map(account => (account.id === updatedAccount.id ? updatedAccount : account))
      );
      setEditingAccount(null);
      showToast(`Rekening "${updatedAccount.name}" berhasil diperbarui`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Gagal memperbarui rekening', false);
    }
  }

  async function handleDelete(accountId: string) {
    const accountName = accounts.find(account => account.id === accountId)?.name ?? '';
    try {
      await deleteAccount(accountId);
      setAccounts(prev => prev.filter(account => account.id !== accountId));
      showToast(`Rekening "${accountName}" telah dihapus`, false);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Gagal menghapus rekening', false);
    }
  }

  async function handleToggleHide(accountId: string) {
    const targetAccount = accounts.find(account => account.id === accountId);
    if (!targetAccount) return;
    try {
      const updatedAccount = await updateAccount(accountId, { hidden: !targetAccount.hidden });
      setAccounts(prev =>
        prev.map(account => (account.id === updatedAccount.id ? updatedAccount : account))
      );
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Gagal mengubah visibilitas rekening', false);
    }
  }

  function handleTransfer() {
    setShowTransferModal(false);
    showToast('Transfer berhasil dicatat');
  }

  const visibleAccounts = accounts.filter(account => !account.hidden);
  const totalBalance = visibleAccounts.reduce((sum, account) => sum + account.balance, 0);
  const hiddenCount = accounts.length - visibleAccounts.length;
  const monthlyNet = 0;

  return {
    accounts,
    isLoading,
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
