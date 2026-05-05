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
    txList, accounts, showAdd, setShowAdd, toast,
    selectedMonth, setSelectedMonth,
    showMonthPicker, setShowMonthPicker, monthPickerRef,
    totalAssets, availableMonths, displayedAccounts, lastTxByAcct,
    budgets, monthTxList, monthIncome, monthExpense, net,
    currentMonth, currentYear, isCurrentMonth, daysLeft,
    totalBudget, totalUsed, alertCount,
    handleAdd,
  } = useDashboard();

  return (
    <div className="font-sans">
      <DashboardToast toast={toast} />

      <DashboardHeader
        currentMonth={currentMonth}
        currentYear={currentYear}
        isCurrentMonth={isCurrentMonth}
        daysLeft={daysLeft}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        showMonthPicker={showMonthPicker}
        setShowMonthPicker={setShowMonthPicker}
        monthPickerRef={monthPickerRef}
        availableMonths={availableMonths}
        onAddClick={() => setShowAdd(true)}
      />

      <DashboardStats
        totalAssets={totalAssets}
        monthIncome={monthIncome}
        monthExpense={monthExpense}
        net={net}
        currentMonth={currentMonth}
        monthTxList={monthTxList}
      />

      <DashboardAccounts
        displayedAccounts={displayedAccounts}
        lastTxByAcct={lastTxByAcct}
        txList={txList}
      />

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
          monthTxList={monthTxList}
          currentMonth={currentMonth}
          currentYear={currentYear}
        />
      </div>

      {showAdd && (
        <AddTransactionModal
          accounts={accounts}
          onClose={() => setShowAdd(false)}
          onSave={drafts => handleAdd(drafts.map(draft => ({ ...draft, note: draft.note ?? undefined })))}
        />
      )}
    </div>
  );
}
