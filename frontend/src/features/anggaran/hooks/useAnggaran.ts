"use client";
import { useState, useEffect } from 'react';
import { budgets as INITIAL_BUDGETS } from '@/lib/dashboard-data';
import { BASE, TODAY, MONTH_NAMES } from '../constants';
import type { Budget, StatusFilter, Toast } from '../types';

export function useAnggaran() {
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
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
    : budgets.map(b => ({ ...b, used: 0 }));

  const totalBudget = displayBudgets.reduce((s, b) => s + b.total, 0);
  const totalUsed   = displayBudgets.reduce((s, b) => s + b.used,  0);
  const overallPct  = totalBudget > 0 ? Math.round((totalUsed / totalBudget) * 100) : 0;

  const daysInMonth    = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const isCurrentMonth = currentDate.getFullYear() === TODAY.getFullYear() && currentDate.getMonth() === TODAY.getMonth();
  const daysLeft       = isCurrentMonth ? daysInMonth - TODAY.getDate() : currentDate > TODAY ? daysInMonth : 0;

  const safeCount = displayBudgets.filter(b => b.used / b.total < 0.75).length;
  const warnCount = displayBudgets.filter(b => { const p = b.used / b.total; return p >= 0.75 && p < 1; }).length;
  const overCount = displayBudgets.filter(b => b.used >= b.total).length;

  const visibleBudgets = displayBudgets.filter(b => {
    if (statusFilter === 'all') return true;
    const pct = b.used / b.total;
    if (statusFilter === 'safe') return pct < 0.75;
    if (statusFilter === 'warn') return pct >= 0.75 && pct < 1;
    if (statusFilter === 'over') return b.used >= b.total;
    return true;
  });

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
  }

  function handleAdd(budget: Budget) {
    setBudgets(prev => [...prev, budget]);
    showToast(`Anggaran "${budget.name}" berhasil ditambahkan`);
  }

  function handleSave(updated: Budget) {
    setBudgets(prev => prev.map(b => b.id === updated.id ? updated : b));
    showToast(`Anggaran "${updated.name}" berhasil diperbarui`);
  }

  function handleDelete(id: string) {
    const name = budgets.find(b => b.id === id)?.name ?? '';
    setBudgets(prev => prev.filter(b => b.id !== id));
    showToast(`Anggaran "${name}" telah dihapus`, false);
  }

  function handleMonthPrev() {
    setMonthOffset(o => o - 1);
    setStatusFilter('all');
  }

  function handleMonthNext() {
    setMonthOffset(o => o + 1);
    setStatusFilter('all');
  }

  return {
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
