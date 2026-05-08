import type { Account, CreateAccountInput, UpdateAccountInput } from '../types';
import { AddAccountModal } from './AddAccountModal';
import { EditAccountModal } from './EditAccountModal';
import { AddTransactionModal } from '@/features/transaksi/components/AddTransactionModal';

interface RekeningModalsProps {
  accounts:             Account[];
  showAddModal:         boolean;
  showTransferModal:    boolean;
  editingAccount:       Account | null;
  isSubmitting:         boolean;
  onCloseAddModal:      () => void;
  onCloseTransferModal: () => void;
  onCloseEditModal:     () => void;
  onAdd:                (input: CreateAccountInput) => void;
  onSave:               (accountId: string, input: UpdateAccountInput) => void;
  onDelete:             (id: string) => void;
  onTransfer:           () => void;
}

export function RekeningModals({
  accounts,
  showAddModal,
  showTransferModal,
  editingAccount,
  isSubmitting,
  onCloseAddModal,
  onCloseTransferModal,
  onCloseEditModal,
  onAdd,
  onSave,
  onDelete,
  onTransfer,
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
          onSave={() => onTransfer()}
        />
      )}
    </>
  );
}
