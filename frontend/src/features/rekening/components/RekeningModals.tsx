import type { Account, Transaction } from '../types';
import { AddAccountModal } from './AddAccountModal';
import { EditAccountModal } from './EditAccountModal';
import { AddTransactionModal } from '@/features/transaksi/components/AddTransactionModal';

interface RekeningModalsProps {
  showAddModal: boolean;
  showTransferModal: boolean;
  editingAccount: Account | null;
  onCloseAddModal: () => void;
  onCloseTransferModal: () => void;
  onCloseEditModal: () => void;
  onAdd: (account: Account) => void;
  onSave: (account: Account) => void;
  onDelete: (id: string) => void;
  onTransfer: (txs: Omit<Transaction, 'id'>[]) => void;
}

export function RekeningModals({
  showAddModal,
  showTransferModal,
  editingAccount,
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
        />
      )}

      {editingAccount && (
        <EditAccountModal
          account={editingAccount}
          onSave={onSave}
          onDelete={onDelete}
          onClose={onCloseEditModal}
        />
      )}

      {showTransferModal && (
        <AddTransactionModal
          initialType="transfer"
          onClose={onCloseTransferModal}
          onSave={onTransfer}
        />
      )}
    </>
  );
}
