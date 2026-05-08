"use client";
import { useState, useEffect } from 'react';
import { BASE, TODAY, MONTH_NAMES } from '../constants';
import type { Budget, StatusFilter, Toast, CreateAnggaranInput, UpdateAnggaranInput } from '../types';
import { listAnggaran, createAnggaran, updateAnggaran, deleteAnggaran } from '../services/anggaranService';

export function useAnggaran() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [viewMonth, setViewMonth] = useState(BASE.getMonth());
  const [viewYear, setViewYear] = useState(BASE.getFullYear());
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const currentDate  = new Date(viewYear, viewMonth);
  const btnLabel     = `${MONTH_NAMES[viewMonth]} ${viewYear}`;

  const isViewingCurrentMonth = viewYear === TODAY.getFullYear() && viewMonth === TODAY.getMonth();
  const displayBudgets = isViewingCurrentMonth
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
    setIsSubmitting(true);
    try {
      await Promise.all([
        createAnggaran(input).then(() => loadBudgets()),
        new Promise<void>(resolve => setTimeout(resolve, 500)),
      ]);
      showToast(`Anggaran "${input.name}" berhasil ditambahkan`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Gagal menambah anggaran', false);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSave(id: string, input: UpdateAnggaranInput): Promise<void> {
    const budgetName = budgets.find(budget => budget.id === id)?.name ?? '';
    setIsSubmitting(true);
    try {
      await Promise.all([
        updateAnggaran(id, input).then(() => loadBudgets()),
        new Promise<void>(resolve => setTimeout(resolve, 500)),
      ]);
      showToast(`Anggaran "${budgetName}" berhasil diperbarui`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Gagal memperbarui anggaran', false);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string): Promise<void> {
    const budgetName = budgets.find(budget => budget.id === id)?.name ?? '';
    setIsSubmitting(true);
    try {
      await Promise.all([
        deleteAnggaran(id).then(() => loadBudgets()),
        new Promise<void>(resolve => setTimeout(resolve, 500)),
      ]);
      showToast(`Anggaran "${budgetName}" telah dihapus`, false);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Gagal menghapus anggaran', false);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSetViewMonth(month: number) {
    setViewMonth(month);
    setStatusFilter('all');
  }

  function handleSetViewYear(fn: (year: number) => number) {
    setViewYear(fn);
    setStatusFilter('all');
  }

  return {
    isLoading,
    isSubmitting,
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
    viewMonth,
    viewYear,
    btnLabel,
    setShowModal,
    setEditingBudget,
    setStatusFilter,
    handleAdd,
    handleSave,
    handleDelete,
    handleSetViewMonth,
    handleSetViewYear,
  };
}
