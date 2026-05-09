"use client";
import { useTransaksi } from '../hooks/useTransaksi';
import { TransaksiToast } from './TransaksiToast';
import { TransaksiHeader } from './TransaksiHeader';
import { TransaksiFilter } from './TransaksiFilter';
import { TransaksiSummary } from './TransaksiSummary';
import { TransaksiList } from './TransaksiList';
import { AddTransactionModal } from './AddTransactionModal';
import { EditTransactionModal } from './EditTransactionModal';

export function TransaksiPage() {
  const {
    txList,
    filtered,
    groups,
    accounts,
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
  } = useTransaksi();

  function handleAddClick() {
    if (accounts.length === 0) {
      showToast('Tambah rekening dulu sebelum mencatat transaksi', false);
    } else {
      setShowAdd(true);
    }
  }

  return (
    <div className="font-sans">
      <TransaksiToast toast={toast} />

      <TransaksiHeader
        filteredCount={filtered.length}
        totalCount={txList.length}
        monthLabel={monthLabel}
        onExport={handleExport}
        exportDisabled={filtered.length === 0}
        onAdd={handleAddClick}
      />

      <TransaksiFilter
        search={search}           setSearch={setSearch}
        typeFilter={typeFilter}   setTypeFilter={setTypeFilter}
        userFilter={userFilter}   setUserFilter={setUserFilter}
        monthFilter={monthFilter} setMonthFilter={setMonthFilter}
        pickerYear={pickerYear}   setPickerYear={setPickerYear}
        monthLabel={monthLabel}
        hasFilters={hasFilters}
        typeCounts={typeCounts}
        resetFilters={resetFilters}
      />

      <TransaksiSummary
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        filteredCount={filtered.length}
      />

      <TransaksiList
        groups={groups}
        hasFilters={hasFilters}
        expandedId={expandedId}
        setExpandedId={setExpandedId}
        onEdit={t => setEditTx(t)}
        resetFilters={resetFilters}
      />

      {showAdd && accounts.length > 0 && (
        <AddTransactionModal
          accounts={accounts}
          onClose={() => setShowAdd(false)}
          onSave={handleAdd}
          isSubmitting={isSubmitting}
        />
      )}
      {editTx && (
        <EditTransactionModal
          tx={editTx}
          accounts={accounts}
          onClose={() => setEditTx(null)}
          onSave={handleEdit}
          onDelete={handleDelete}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
