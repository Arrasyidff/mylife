"use client";
import { useAnggaran } from '../hooks/useAnggaran';
import { AnggaranModals } from './AnggaranModals';
import { AnggaranToast } from './AnggaranToast';
import { AnggaranHeader } from './AnggaranHeader';
import { AnggaranSummary } from './AnggaranSummary';
import { AnggaranBudgetGrid } from './AnggaranBudgetGrid';

export function AnggaranPage() {
  const {
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
  } = useAnggaran();

  return (
    <div className="font-sans">
      {toast && <AnggaranToast toast={toast} />}

      <AnggaranHeader
        prevLabel={prevLabel}
        currentLabel={currentLabel}
        nextLabel={nextLabel}
        onMonthPrev={handleMonthPrev}
        onMonthNext={handleMonthNext}
        onAddBudget={() => setShowModal(true)}
      />

      <AnggaranSummary
        currentDate={currentDate}
        totalUsed={totalUsed}
        totalBudget={totalBudget}
        overallPct={overallPct}
        daysLeft={daysLeft}
        safeCount={safeCount}
        warnCount={warnCount}
        overCount={overCount}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <AnggaranBudgetGrid
        visibleBudgets={visibleBudgets}
        statusFilter={statusFilter}
        onEditBudget={setEditingBudget}
        onAddBudget={() => setShowModal(true)}
      />

      <AnggaranModals
        showAddModal={showModal}
        editingBudget={editingBudget}
        totalBudget={totalBudget}
        isSubmitting={isSubmitting}
        onCloseAddModal={() => setShowModal(false)}
        onCloseEditModal={() => setEditingBudget(null)}
        onAdd={handleAdd}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
