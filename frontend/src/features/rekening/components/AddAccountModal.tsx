"use client";
import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useScrollLock } from '@/lib/hooks/useScrollLock';
import { BALANCE_PRESETS } from '../constants';
import {
  Field,
  inputCls,
  buildPreviewData,
  parseBalanceInput,
  AccountPreviewCard,
  AccountTypeSelector,
  ColorPicker,
  ModalLoadingOverlay,
} from './_AccountModalShared';
import type { CreateAccountInput, AccountType } from '../types';

interface AddAccountModalProps {
  onClose: () => void;
  onAdd: (input: CreateAccountInput) => void;
  isSubmitting: boolean;
}

export function AddAccountModal({ onClose, onAdd, isSubmitting }: AddAccountModalProps) {
  useScrollLock();
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('tabungan');
  const [color, setColor] = useState('#1565C0');
  const [balance, setBalance] = useState(0);
  const [accountNumber, setAccountNumber] = useState('');

  const { previewGlyph, typeLabel, previewSubtitle } = buildPreviewData(name, type, accountNumber);

  function handleSave() {
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      type,
      color,
      balance,
      account_number: accountNumber.trim() || undefined,
      subtitle: previewSubtitle || typeLabel,
      glyph: name.slice(0, 3).toUpperCase(),
    });
  }

  return (
    <>
      <div
        onClick={!isSubmitting ? onClose : undefined}
        className="fixed inset-0 bg-[rgba(20,30,25,0.35)] backdrop-blur-[2px] z-40"
      />

      <div className="fixed inset-0 sm:inset-y-0 sm:left-auto sm:right-0 sm:w-120 bg-white flex flex-col overflow-hidden z-50 shadow-[-16px_0_40px_rgba(20,30,25,0.18),-1px_0_0_rgba(20,30,25,0.06)]" style={{ isolation: 'isolate' }}>
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-[#EEF2F0] flex items-start justify-between shrink-0">
          <div>
            <div className="text-[0.6875rem] text-[#1D9E75] font-bold tracking-[0.03125rem] mb-0.75">
              REKENING BARU
            </div>
            <h2 className="m-0 text-[1.1875rem] font-bold tracking-[-0.025rem] text-[#1A2420]">
              Tambah Rekening
            </h2>
            <div className="text-[0.78125rem] text-[#7D9590] mt-1">
              Sambungkan rekening bank, e-wallet, atau tunai
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-[0.5rem] border-none bg-[#F6F9F7] cursor-pointer text-[#7D9590] flex items-center justify-center shrink-0 mt-0.5"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4.5 sm:px-6 sm:py-5.5">
          <AccountPreviewCard
            name={name}
            color={color}
            balance={balance}
            previewGlyph={previewGlyph}
            previewSubtitle={previewSubtitle}
            fallbackSubtitle="Jenis rekening"
          />

          <Field label="Nama Rekening">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="cth: BCA Utama, GoPay, Dompet Harian…"
              className={inputCls}
            />
          </Field>

          <Field label="Jenis Rekening">
            <AccountTypeSelector selectedType={type} onSelect={setType} />
          </Field>

          <Field label="Warna Label">
            <ColorPicker selectedColor={color} onSelect={setColor} />
          </Field>

          <Field label="Nomor Rekening / ID" optional>
            <input
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value)}
              placeholder="cth: 1234567890 atau 0812-3456-7890"
              className={inputCls}
            />
          </Field>

          <Field label="Saldo Awal" hint="Masukkan saldo saat ini agar total aset akurat.">
            <div className="bg-[#F0FAF6] border-[1.5px] border-[#1D9E75] rounded-[0.75rem] py-4 px-4.5 text-center mb-2.5">
              <div className="inline-flex items-baseline gap-2">
                <span className="text-[1.0625rem] text-[#15735A] font-semibold">Rp</span>
                <input
                  type="text"
                  value={balance.toLocaleString('id-ID')}
                  onChange={e => setBalance(parseBalanceInput(e.target.value))}
                  className="text-[1.75rem] sm:text-[2.125rem] font-bold tracking-[-0.0625rem] text-[#1A2420] tabular-nums border-none bg-transparent outline-none font-sans text-center w-40 sm:w-50"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {BALANCE_PRESETS.map(preset => {
                const isActive = preset === balance;
                return (
                  <button
                    key={preset}
                    onClick={() => setBalance(preset)}
                    className={`py-1.5 px-3 rounded-full text-xs font-semibold cursor-pointer font-sans tabular-nums border ${
                      isActive ? 'bg-[#1D9E75] text-white border-[#1D9E75]' : 'bg-white text-[#7D9590] border-[#E0EAE6]'
                    }`}
                  >
                    {preset === 0 ? 'Rp 0' : `Rp ${preset.toLocaleString('id-ID')}`}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>

        <div className="px-5 sm:px-6 py-3.5 border-t border-[#EEF2F0] bg-[#F6F9F7] flex gap-2.5 shrink-0">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2.75 rounded-[0.5625rem] border border-[#E0EAE6] bg-white text-[#1A2420] text-[0.84375rem] font-semibold cursor-pointer font-sans disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || isSubmitting}
            className={`flex-2 py-2.75 rounded-[0.5625rem] border-none text-white text-[0.84375rem] font-semibold font-sans flex items-center justify-center gap-1.5 ${
              name.trim() && !isSubmitting ? 'bg-brand cursor-pointer' : 'bg-app-border-strong cursor-not-allowed'
            }`}
          >
            <Check size={14} />
            Simpan Rekening
          </button>
        </div>

        {isSubmitting && <ModalLoadingOverlay />}
      </div>
    </>
  );
}
