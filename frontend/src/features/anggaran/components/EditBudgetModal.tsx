"use client";
import { useState, useEffect } from 'react';
import { X, Check, Trash2, AlertTriangle } from 'lucide-react';
import { useScrollLock } from '@/lib/hooks/useScrollLock';
import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';
import { CatBubble } from '@/components/shared/CatBubble';
import { CATS } from '../constants';
import { updateAnggaranSchema } from '../schemas/anggaran.schema';
import type { Budget, BudgetPeriod, UpdateAnggaranInput } from '../types';
import {
  Field,
  ModalLoadingOverlay,
  CategorySelector,
  AmountPresets,
  PeriodSelector,
  CarryOverField,
} from './_BudgetModalShared';

interface EditBudgetModalProps {
  budget: Budget;
  onSave: (id: string, input: UpdateAnggaranInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
}

export function EditBudgetModal({ budget, onSave, onDelete, onClose, isSubmitting }: EditBudgetModalProps) {
  useScrollLock();
  const [selectedCat, setSelectedCat] = useState(budget.category);
  const [selectedPeriod, setSelectedPeriod] = useState<BudgetPeriod>(budget.period ?? 'MONTHLY');
  const [amount, setAmount] = useState(budget.total);
  const [carryOver, setCarryOver] = useState(budget.carry_over);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isClosing) return;
    const timer = setTimeout(onClose, 300);
    return () => clearTimeout(timer);
  }, [isClosing, onClose]);

  function handleClose() {
    if (isSubmitting) return;
    setIsClosing(true);
  }

  const catName = CATS.find(category => category.id === selectedCat)?.name ?? selectedCat;

  async function handleSave() {
    setValidationErrors({});

    const parseResult = updateAnggaranSchema.safeParse({
      name: catName,
      category: selectedCat,
      total: amount,
      period: selectedPeriod,
      carry_over: carryOver,
    });

    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parseResult.error.issues) {
        const fieldKey = issue.path[0] as string;
        if (!fieldErrors[fieldKey]) fieldErrors[fieldKey] = issue.message;
      }
      setValidationErrors(fieldErrors);
      return;
    }

    try {
      await onSave(budget.id, parseResult.data as UpdateAnggaranInput);
      setIsClosing(true);
    } catch {
      // error shown via toast in hook
    }
  }

  async function handleDelete() {
    try {
      await onDelete(budget.id);
      setIsClosing(true);
    } catch {
      // error shown via toast in hook
    }
  }

  return (
    <>
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-[rgba(20,30,25,0.35)] backdrop-blur-[2px] z-40 ${isClosing ? 'animate-out fade-out fill-mode-forwards duration-300' : 'animate-in fade-in duration-200'}`}
      />

      <div
        className={`fixed inset-0 sm:inset-y-0 sm:left-auto sm:right-0 sm:w-120 bg-white flex flex-col overflow-hidden z-50 shadow-[-16px_0_40px_rgba(20,30,25,0.18),-1px_0_0_rgba(20,30,25,0.06)] ${isClosing ? 'animate-out slide-out-to-bottom sm:slide-out-to-right sm:[--tw-exit-translate-y:0] fill-mode-forwards duration-300 ease-in' : 'animate-in slide-in-from-bottom sm:slide-in-from-right sm:[--tw-enter-translate-y:0] duration-300 ease-out'}`}
        style={{ isolation: 'isolate' }}
      >
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-app-divider flex items-start justify-between shrink-0">
          <div>
            <div className="text-[11px] text-app-warning font-bold tracking-[0.5px] mb-0.75">
              EDIT ANGGARAN
            </div>
            <h2 className="m-0 text-lg sm:text-[19px] font-bold tracking-[-0.025rem] text-app-text">
              {budget.name}
            </h2>
            <div className="text-xs sm:text-[12.5px] text-app-text-muted mt-1">
              Perbarui batas dan pengaturan anggaran
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-[8px] border-none bg-surface-alt cursor-pointer text-app-text-muted flex items-center justify-center shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">
          <div
            className="bg-brand-soft rounded-[12px] py-3.5 px-4.5 mb-5.5 flex items-center gap-3.5"
            style={{ border: `1px solid ${T.primary}30`, borderLeft: `4px solid ${T.primary}` }}
          >
            <CatBubble cat={selectedCat} size={38} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-app-text">{catName}</div>
              <div className="text-[11.5px] text-app-text-subtle mt-0.5">
                {formatRp(budget.spent)} terpakai dari {formatRp(amount)}
              </div>
            </div>
            <div className="text-[15px] font-bold text-brand-dark tabular-nums">{formatRp(amount)}</div>
          </div>

          <Field label="Kategori" error={validationErrors.category}>
            <CategorySelector selectedCat={selectedCat} onSelect={setSelectedCat} />
          </Field>

          <Field label="Batas Anggaran" error={validationErrors.total}>
            <div
              className="rounded-[12px] py-4.5 px-4.5 pb-4 text-center mb-2.5"
              style={{
                background: validationErrors.total ? '#FFF5F5' : '#F0FAF6',
                border: `1.5px solid ${validationErrors.total ? '#C0392B' : '#1D9E75'}`,
              }}
            >
              <div className="inline-flex items-baseline gap-2">
                <span
                  className="text-[18px] font-semibold"
                  style={{ color: validationErrors.total ? '#C0392B' : '#15735A' }}
                >
                  Rp
                </span>
                <input
                  type="text"
                  value={amount === 0 ? '' : amount.toLocaleString('id-ID')}
                  onChange={event => {
                    const digits = event.target.value.replace(/[^\d]/g, '');
                    setAmount(digits ? parseInt(digits, 10) : 0);
                    if (validationErrors.total) setValidationErrors(prev => ({ ...prev, total: '' }));
                  }}
                  placeholder="0"
                  className="text-[34px] font-bold tracking-[-0.0625rem] text-app-text tabular-nums border-none bg-transparent outline-none font-sans text-center w-50"
                />
              </div>
            </div>
            <AmountPresets amount={amount} onSelect={setAmount} />
          </Field>

          <Field label="Periode" error={validationErrors.period}>
            <PeriodSelector selectedPeriod={selectedPeriod} onSelect={setSelectedPeriod} />
          </Field>

          <CarryOverField carryOver={carryOver} onToggle={setCarryOver} />

          <div className="py-4 px-4.5 bg-app-danger-light rounded-[10px] border border-[#C0392B22]">
            <div className="text-xs font-semibold text-app-danger mb-2.5">Zona Bahaya</div>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 py-2 px-3.5 rounded-[7px] border border-[#C0392B44] bg-white text-app-danger text-[12.5px] font-semibold cursor-pointer font-sans"
              >
                <Trash2 size={13} />
                Hapus Anggaran Ini
              </button>
            ) : (
              <div>
                <div className="flex items-start gap-1.75 text-[12.5px] text-app-danger mb-3 leading-normal">
                  <AlertTriangle size={14} className="shrink-0 mt-px" />
                  <span>
                    Yakin hapus anggaran <strong>{budget.name}</strong>?
                    Tindakan ini tidak dapat dibatalkan.
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="py-1.75 px-4 rounded-[7px] border border-app-border bg-white text-app-text text-[12.5px] font-semibold cursor-pointer font-sans"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="py-1.75 px-4 rounded-[7px] border-none bg-app-danger text-white text-[12.5px] font-semibold cursor-pointer font-sans disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Ya, Hapus
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-5 sm:px-6 py-3.5 border-t border-app-divider bg-surface-alt flex gap-2.5 shrink-0">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 py-2.75 rounded-[9px] border border-app-border bg-white text-app-text text-[13.5px] font-semibold cursor-pointer font-sans disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex-2 py-2.75 rounded-[9px] border-none bg-brand text-white text-[13.5px] font-semibold cursor-pointer font-sans flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Check size={14} />
            Simpan Perubahan
          </button>
        </div>

        {isSubmitting && <ModalLoadingOverlay />}
      </div>
    </>
  );
}
