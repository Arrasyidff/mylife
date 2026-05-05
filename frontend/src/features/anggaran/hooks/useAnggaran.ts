"use client";
import { useState, useEffect } from 'react';
import { BASE, TODAY, MONTH_NAMES } from '../constants';
import type { Budget, StatusFilter, Toast, CreateAnggaranInput, UpdateAnggaranInput } from '../types';
import { listAnggaran, createAnggaran, updateAnggaran, deleteAnggaran } from '../services/anggaranService';

export function useAnggaran() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [monthOffset, setMonthOffset] = useState(0);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const currentDate  = new Date(BASE.getFullYear(), BASE.getMonth() + monthOffset);
  const prevDate     = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
  const nextDate     = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
  const currentLabel = `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  const prevLabel    = MONTH_NAMES[prevDate.getMonth()];
  const nextLabel    = MONTH_NAMES[nextDate.getMonth()];

  const displayBudgets = monthOffset === 0
    ? budgets
    : budgets.map(budget => ({ ...budget, spent: 0, remaining: budget.total }));

  const totalBudget = displayBudgets.reduce((sum, budget) => sum + budget.total, 0);
  const totalUsed   = displayBudgets.reduce((sum, budget) => sum + budget.spent, 0);
  const overallPct  = totalBudget > 0 ? Math.round((totalUsed / totalBudget) * 100) : 0;

  const daysInMonth    = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const isCurrentMonth = currentDate.getFullYear() === TODAY.getFullYear() && currentDate.getMonth() === TODAY.getMonth();
  const daysLeft       = isCurrentMonth ? daysInMonth - TODAY.getDate() : currentDate > TODAY ? daysInMonth : 0;

  const safeCount = displayBudgets.filter(budget => budget.spent / budget.total < 0.75).length;
  const warnCount = displayBudgets.filter(budget => { const pct = budget.spent / budget.total; return pct >= 0.75 && pct < 1; }).length;
  const overCount = displayBudgets.filter(budget => budget.spent >= budget.total).length;

  const visibleBudgets = displayBudgets.filter(budget => {
    if (statusFilter === 'all') return true;
    const pct = budget.spent / budget.total;
    if (statusFilter === 'safe') return pct < 0.75;
    if (statusFilter === 'warn') return pct >= 0.75 && pct < 1;
    if (statusFilter === 'over') return budget.spent >= budget.total;
    return true;
  });

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    loadBudgets();
  }, []);

  async function loadBudgets() {
    setIsLoading(true);
    try {
      const data = await listAnggaran();
      setBudgets(data);
    } catch {
      showToast('Gagal memuat anggaran', false);
    } finally {
      setIsLoading(false);
    }
  }

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
  }

  async function handleAdd(input: CreateAnggaranInput): Promise<void> {
    try {
      await createAnggaran(input);
      await loadBudgets();
      showToast(`Anggaran "${input.name}" berhasil ditambahkan`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Gagal menambah anggaran', false);
      throw error;
    }
  }

  async function handleSave(id: string, input: UpdateAnggaranInput): Promise<void> {
    const budgetName = budgets.find(budget => budget.id === id)?.name ?? '';
    try {
      await updateAnggaran(id, input);
      await loadBudgets();
      showToast(`Anggaran "${budgetName}" berhasil diperbarui`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Gagal memperbarui anggaran', false);
      throw error;
    }
  }

  async function handleDelete(id: string): Promise<void> {
    const budgetName = budgets.find(budget => budget.id === id)?.name ?? '';
    try {
      await deleteAnggaran(id);
      await loadBudgets();
      showToast(`Anggaran "${budgetName}" telah dihapus`, false);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Gagal menghapus anggaran', false);
      throw error;
    }
  }

  function handleMonthPrev() {
    setMonthOffset(offset => offset - 1);
    setStatusFilter('all');
  }

  function handleMonthNext() {
    setMonthOffset(offset => offset + 1);
    setStatusFilter('all');
  }

  return {
    isLoading,
    visibleBudgets,
    totalBudget,
    totalUsed,
    overallPct,
    daysLeft,
    safeCount,
    warnCount,
    overCount,
    showModal,
    editingBudget,
    toast,
    statusFilter,
    currentDate,
    currentLabel,
    prevLabel,
    nextLabel,
    setShowModal,
    setEditingBudget,
    setStatusFilter,
    handleAdd,
    handleSave,
    handleDelete,
    handleMonthPrev,
    handleMonthNext,
  };
}
