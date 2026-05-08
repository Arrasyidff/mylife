'use client';
import { AddTransactionModal } from '@/features/transaksi/components/AddTransactionModal';
import { useDashboard } from '../hooks/useDashboard';
import { DashboardToast } from './DashboardToast';
import { DashboardHeader } from './DashboardHeader';
import { DashboardStats } from './DashboardStats';
import { DashboardAccounts } from './DashboardAccounts';
import { DashboardBudgets } from './DashboardBudgets';
import { DashboardTransactions } from './DashboardTransactions';

export function DashboardPage() {
  const {
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
  } = useDashboard();

  if (isLoading) {
    return (
      <div className="font-sans animate-pulse">
        <div className="h-8 bg-gray-100 rounded-lg w-40 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-64 mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 bg-gray-100 rounded-xl" />
          ))}
        </div>
        <div className="h-6 bg-gray-100 rounded w-24 mb-3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-28 bg-gray-100 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
          <div className="h-72 bg-gray-100 rounded-xl" />
          <div className="h-72 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-sans flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-[14px] text-[#C0392B] font-semibold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-[13px] text-[#1D9E75] font-semibold underline"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <DashboardToast toast={toast} />

      <DashboardHeader
        currentMonth={currentMonth}
        currentYear={currentYear}
        isCurrentMonth={isCurrentMonth}
        daysLeft={daysLeft}
        viewMonth={viewMonth}
        viewYear={viewYear}
        setViewMonth={setViewMonth}
        setViewYear={setViewYear}
        onAddClick={() => setShowAdd(true)}
      />

      <DashboardStats
        totalAssets={totalAssets}
        totalAccounts={totalAccounts}
        monthIncome={monthIncome}
        monthExpense={monthExpense}
        net={net}
        savingsRate={savingsRate}
        currentMonth={currentMonth}
      />

      <DashboardAccounts displayedAccounts={displayedAccounts} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
        <DashboardBudgets
          budgets={budgets}
          currentMonth={currentMonth}
          currentYear={currentYear}
          totalUsed={totalUsed}
          totalBudget={totalBudget}
          alertCount={alertCount}
        />
        <DashboardTransactions
          recentTransactions={recentTransactions}
          currentMonth={currentMonth}
          currentYear={currentYear}
        />
      </div>

      {showAdd && (
        <AddTransactionModal
          accounts={accounts}
          onClose={() => setShowAdd(false)}
          onSave={handleAdd}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
