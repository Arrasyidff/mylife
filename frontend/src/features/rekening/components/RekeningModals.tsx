import type { Account, CreateAccountInput, UpdateAccountInput } from '../types';
import type { Transaction } from '@/features/transaksi/types';
import { AddAccountModal } from './AddAccountModal';
import { EditAccountModal } from './EditAccountModal';
import { AddTransactionModal } from '@/features/transaksi/components/AddTransactionModal';

interface RekeningModalsProps {
  accounts:              Account[];
  showAddModal:          boolean;
  showTransferModal:     boolean;
  editingAccount:        Account | null;
  isSubmitting:          boolean;
  isTransferSubmitting:  boolean;
  onCloseAddModal:       () => void;
  onCloseTransferModal:  () => void;
  onCloseEditModal:      () => void;
  onAdd:                 (input: CreateAccountInput) => void;
  onSave:                (accountId: string, input: UpdateAccountInput) => void;
  onDelete:              (id: string) => void;
  onTransferSave:        (drafts: Omit<Transaction, 'id'>[]) => void;
}

export function RekeningModals({
  accounts,
  showAddModal,
  showTransferModal,
  editingAccount,
  isSubmitting,
  isTransferSubmitting,
  onCloseAddModal,
  onCloseTransferModal,
  onCloseEditModal,
  onAdd,
  onSave,
  onDelete,
  onTransferSave,
}: RekeningModalsProps) {
  return (
    <>
      {showAddModal && (
        <AddAccountModal
          onClose={onCloseAddModal}
          onAdd={onAdd}
          isSubmitting={isSubmitting}
        />
      )}

      {editingAccount && (
        <EditAccountModal
          account={editingAccount}
          onSave={onSave}
          onDelete={onDelete}
          onClose={onCloseEditModal}
          isSubmitting={isSubmitting}
        />
      )}

      {showTransferModal && (
        <AddTransactionModal
          accounts={accounts}
          initialType="transfer"
          onClose={onCloseTransferModal}
          onSave={onTransferSave}
          isSubmitting={isTransferSubmitting}
        />
      )}
    </>
  );
}
