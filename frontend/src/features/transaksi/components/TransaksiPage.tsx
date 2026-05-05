"use client";
import { T } from '@/lib/tokens';
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
  } = useTransaksi();

  return (
    <div style={{ fontFamily: T.fontSans }}>
      <TransaksiToast toast={toast} />

      <TransaksiHeader
        filteredCount={filtered.length}
        totalCount={txList.length}
        monthLabel={monthLabel}
        onExport={handleExport}
        exportDisabled={filtered.length === 0}
        onAdd={() => setShowAdd(true)}
      />

      <TransaksiFilter
        search={search}                   setSearch={setSearch}
        typeFilter={typeFilter}           setTypeFilter={setTypeFilter}
        userFilter={userFilter}           setUserFilter={setUserFilter}
        monthFilter={monthFilter}         setMonthFilter={setMonthFilter}
        showMonthPicker={showMonthPicker} setShowMonthPicker={setShowMonthPicker}
        pickerYear={pickerYear}           setPickerYear={setPickerYear}
        monthPickerRef={monthPickerRef}
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

      {showAdd && (
        <AddTransactionModal onClose={() => setShowAdd(false)} onSave={handleAdd} />
      )}
      {editTx && (
        <EditTransactionModal
          tx={editTx}
          onClose={() => setEditTx(null)}
          onSave={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
