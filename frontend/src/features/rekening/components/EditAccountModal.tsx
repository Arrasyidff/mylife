"use client";
import { useState, useEffect } from 'react';
import { X, Check, Trash2, AlertTriangle } from 'lucide-react';
import { useScrollLock } from '@/lib/hooks/useScrollLock';
import {
  Field,
  inputCls,
  inputErrorCls,
  buildPreviewData,
  parseBalanceInput,
  AccountPreviewCard,
  AccountTypeSelector,
  ColorPicker,
  ModalLoadingOverlay,
} from './_AccountModalShared';
import { createAccountSchema } from '../schemas/rekening.schema';
import type { Account, AccountType, UpdateAccountInput } from '../types';

interface EditAccountModalProps {
  account: Account;
  onSave: (accountId: string, input: UpdateAccountInput) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

export function EditAccountModal({ account, onSave, onDelete, onClose, isSubmitting }: EditAccountModalProps) {
  useScrollLock();
  const [name, setName] = useState(account.name);
  const [type, setType] = useState<AccountType>(account.type);
  const [color, setColor] = useState(account.color);
  const [balance, setBalance] = useState(account.balance);
  const [accountNumber, setAccountNumber] = useState(account.account_number ?? '');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
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

  const { previewGlyph, typeLabel, previewSubtitle } = buildPreviewData(name, type, accountNumber);

  function handleSave() {
    const input = {
      name: name.trim(),
      type,
      color,
      balance,
      account_number: accountNumber.trim() || undefined,
      subtitle: previewSubtitle || typeLabel,
      glyph: name.slice(0, 3).toUpperCase() || '···',
    };

    const result = createAccountSchema.safeParse(input);
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = String(issue.path[0]);
        if (!errors[field]) errors[field] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    onSave(account.id, {
      ...result.data,
      account_number: accountNumber.trim() || null,
    });
  }

  function handleDelete() {
    onDelete(account.id);
    onClose();
  }

  return (
    <>
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-[rgba(20,30,25,0.35)] backdrop-blur-[2px] z-40 ${isClosing ? 'animate-out fade-out fill-mode-forwards duration-300' : 'animate-in fade-in duration-200'}`}
      />

      <div className={`fixed inset-0 sm:inset-y-0 sm:left-auto sm:right-0 sm:w-120 bg-white flex flex-col overflow-hidden z-50 shadow-[-16px_0_40px_rgba(20,30,25,0.18),-1px_0_0_rgba(20,30,25,0.06)] ${isClosing ? 'animate-out slide-out-to-bottom sm:slide-out-to-right sm:[--tw-exit-translate-y:0] fill-mode-forwards duration-300 ease-in' : 'animate-in slide-in-from-bottom sm:slide-in-from-right sm:[--tw-enter-translate-y:0] duration-300 ease-out'}`} style={{ isolation: 'isolate' }}>
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-app-divider flex items-start justify-between shrink-0">
          <div>
            <div className="text-[0.6875rem] text-app-warning font-bold tracking-[0.03125rem] mb-0.75">
              EDIT REKENING
            </div>
            <h2 className="m-0 text-[1.1875rem] font-bold tracking-[-0.025rem] text-app-text">
              {account.name}
            </h2>
            <div className="text-[0.78125rem] text-app-text-muted mt-1">
              Perbarui detail rekening
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-[0.5rem] border-none bg-surface-alt cursor-pointer text-app-text-muted flex items-center justify-center shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4.5 sm:py-5.5">
          <AccountPreviewCard
            name={name}
            color={color}
            balance={balance}
            previewGlyph={previewGlyph}
            previewSubtitle={previewSubtitle}
            fallbackSubtitle={account.subtitle ?? 'Jenis rekening'}
          />

          <Field label="Nama Rekening" error={fieldErrors.name}>
            <input
              value={name}
              onChange={e => { setName(e.target.value); setFieldErrors(prev => ({ ...prev, name: '' })); }}
              placeholder="cth: BCA Utama, GoPay, Dompet Harian…"
              className={fieldErrors.name ? inputErrorCls : inputCls}
            />
          </Field>

          <Field label="Jenis Rekening">
            <AccountTypeSelector selectedType={type} onSelect={setType} />
          </Field>

          <Field label="Warna Label">
            <ColorPicker selectedColor={color} onSelect={setColor} />
          </Field>

          <Field label="Nomor Rekening / ID" optional error={fieldErrors.account_number}>
            <input
              value={type === 'tunai' ? '' : accountNumber}
              onChange={e => { setAccountNumber(e.target.value); setFieldErrors(prev => ({ ...prev, account_number: '' })); }}
              placeholder={type === 'tunai' ? 'Tidak tersedia untuk tunai' : (account.subtitle ?? 'cth: 1234567890 atau 0812-3456-7890')}
              disabled={type === 'tunai'}
              className={fieldErrors.account_number ? inputErrorCls : `${inputCls} disabled:opacity-50 disabled:cursor-not-allowed`}
            />
          </Field>

          <Field label="Saldo Terkini" hint="Perbarui jika ada perbedaan dengan saldo aktual." error={fieldErrors.balance}>
            <div className="bg-brand-soft border-[1.5px] border-brand rounded-[0.75rem] py-4 px-4.5 text-center mb-2.5">
              <div className="inline-flex items-baseline gap-2">
                <span className="text-[1.0625rem] text-brand-dark font-semibold">Rp</span>
                <input
                  type="text"
                  value={balance.toLocaleString('id-ID')}
                  onChange={e => setBalance(parseBalanceInput(e.target.value))}
                  className="text-[2.125rem] font-bold tracking-[-0.0625rem] text-app-text tabular-nums border-none bg-transparent outline-none font-sans text-center w-50"
                />
              </div>
            </div>
          </Field>

          <div className="py-4 px-4.5 bg-app-danger-light rounded-[0.625rem] border border-[#C0392B22]">
            <div className="text-xs font-semibold text-app-danger mb-2.5">
              Zona Bahaya
            </div>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 py-2 px-3.5 rounded-[0.4375rem] border border-[#C0392B44] bg-white text-app-danger text-[0.78125rem] font-semibold cursor-pointer font-sans"
              >
                <Trash2 size={13} />
                Hapus Rekening Ini
              </button>
            ) : (
              <div>
                <div className="flex items-start gap-1.75 text-[0.78125rem] text-app-danger mb-3 leading-normal">
                  <AlertTriangle size={14} className="shrink-0 mt-px" />
                  <span>
                    Yakin hapus rekening <strong>{account.name}</strong>?
                    Tindakan ini tidak dapat dibatalkan.
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="py-1.75 px-4 rounded-[0.4375rem] border border-app-border bg-white text-app-text text-[0.78125rem] font-semibold cursor-pointer font-sans"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleDelete}
                    className="py-1.75 px-4 rounded-[0.4375rem] border-none bg-app-danger text-white text-[0.78125rem] font-semibold cursor-pointer font-sans"
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
            className="flex-1 py-2.75 rounded-[0.5625rem] border border-app-border bg-white text-app-text text-[0.84375rem] font-semibold cursor-pointer font-sans disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className={`flex-2 py-2.75 rounded-[0.5625rem] border-none text-white text-[0.84375rem] font-semibold font-sans flex items-center justify-center gap-1.5 ${
              !isSubmitting ? 'bg-brand cursor-pointer' : 'bg-app-border-strong cursor-not-allowed'
            }`}
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
