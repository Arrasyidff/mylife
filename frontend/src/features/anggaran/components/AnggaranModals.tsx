import type { Budget, CreateAnggaranInput, UpdateAnggaranInput } from '../types';
import { AddBudgetModal } from './AddBudgetModal';
import { EditBudgetModal } from './EditBudgetModal';

interface AnggaranModalsProps {
  showAddModal: boolean;
  editingBudget: Budget | null;
  totalBudget: number;
  isSubmitting: boolean;
  onCloseAddModal: () => void;
  onCloseEditModal: () => void;
  onAdd: (input: CreateAnggaranInput) => Promise<void>;
  onSave: (id: string, input: UpdateAnggaranInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function AnggaranModals({
  showAddModal,
  editingBudget,
  totalBudget,
  isSubmitting,
  onCloseAddModal,
  onCloseEditModal,
  onAdd,
  onSave,
  onDelete,
}: AnggaranModalsProps) {
  return (
    <>
      {showAddModal && (
        <AddBudgetModal
          onClose={onCloseAddModal}
          onAdd={onAdd}
          totalExisting={totalBudget}
          isSubmitting={isSubmitting}
        />
      )}

      {editingBudget && (
        <EditBudgetModal
          budget={editingBudget}
          onSave={onSave}
          onDelete={onDelete}
          onClose={onCloseEditModal}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}
