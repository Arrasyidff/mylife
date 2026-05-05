"use client";
import { GROUP_CONFIG } from '../constants';
import { useRekening } from '../hooks/useRekening';
import { RekeningToast } from './RekeningToast';
import { RekeningHeader } from './RekeningHeader';
import { RekeningSummaryBanner } from './RekeningSummaryBanner';
import { RekeningAccountGrid } from './RekeningAccountGrid';
import { RekeningModals } from './RekeningModals';

export function RekeningPage() {
  const {
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
  } = useRekening();

  const visibleGroupsWithBalance = GROUP_CONFIG.filter(group =>
    visibleAccounts.some(account => (group.types as readonly string[]).includes(account.type))
  );

  return (
    <div className="font-sans">
      {toast && <RekeningToast toast={toast} />}

      <RekeningHeader
        accountCount={accounts.length}
        hiddenCount={hiddenCount}
        onTransfer={() => setShowTransferModal(true)}
        onAddAccount={() => setShowAddModal(true)}
      />

      <RekeningSummaryBanner
        totalBalance={totalBalance}
        hiddenCount={hiddenCount}
        monthlyNet={monthlyNet}
        visibleAccounts={visibleAccounts}
        visibleGroupsWithBalance={visibleGroupsWithBalance}
      />

      <RekeningAccountGrid
        accounts={accounts}
        onEdit={setEditingAccount}
        onToggleHide={handleToggleHide}
        onAddAccount={() => setShowAddModal(true)}
      />

      <RekeningModals
        accounts={accounts}
        showAddModal={showAddModal}
        showTransferModal={showTransferModal}
        editingAccount={editingAccount}
        onCloseAddModal={() => setShowAddModal(false)}
        onCloseTransferModal={() => setShowTransferModal(false)}
        onCloseEditModal={() => setEditingAccount(null)}
        onAdd={handleAdd}
        onSave={handleSave}
        onDelete={handleDelete}
        onTransfer={handleTransfer}
      />
    </div>
  );
}
