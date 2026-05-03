"use client";
import { useState } from 'react';
import { X, Check, Trash2, AlertTriangle } from 'lucide-react';
import { formatRp } from '@/lib/format';
import { useScrollLock } from '@/lib/hooks/useScrollLock';
import { ACCOUNT_TYPES, COLORS } from '../constants';
import type { Account, AccountType } from '../types';

interface EditAccountModalProps {
  account: Account;
  onSave: (account: Account) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

function Field({ label, children, hint, optional }: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  optional?: boolean;
}) {
  return (
    <div className="mb-4.5">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[11.5px] font-semibold text-[#7D9590] tracking-[0.3px]">
          {label.toUpperCase()}
        </div>
        {optional && <span className="text-[11px] text-[#A4B8B2] font-medium">opsional</span>}
      </div>
      {children}
      {hint && <div className="text-[11.5px] text-[#A4B8B2] mt-1.5 leading-[1.45]">{hint}</div>}
    </div>
  );
}

const inputCls = "w-full py-2.5 px-3 rounded-[9px] border border-[#E0EAE6] bg-[#F6F9F7] text-[13.5px] text-[#1A2420] font-sans outline-none box-border";

export function EditAccountModal({ account, onSave, onDelete, onClose }: EditAccountModalProps) {
  useScrollLock();
  const [name, setName] = useState(account.name);
  const [type, setType] = useState<AccountType>(account.type);
  const [color, setColor] = useState(account.color);
  const [balance, setBalance] = useState(account.balance);
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const previewGlyph = name ? name.slice(0, 3).toUpperCase() : '···';
  const typeLabel = ACCOUNT_TYPES.find(t => t.id === type)?.label ?? '';
  const previewSubtitle = `${typeLabel}${accountNumber ? ' · ****' + accountNumber.slice(-4) : ''}`;

  function handleBalanceInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^\d]/g, '');
    setBalance(raw ? parseInt(raw) : 0);
  }

  function handleSave() {
    if (!name.trim()) return;
    onSave({
      ...account,
      name: name.trim(),
      subtitle: previewSubtitle || typeLabel,
      balance,
      color,
      glyph: name.slice(0, 3).toUpperCase(),
      type,
    });
    onClose();
  }

  function handleDelete() {
    onDelete(account.id);
    onClose();
  }

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[rgba(20,30,25,0.35)] backdrop-blur-[2px] z-40"
      />

      <div className="fixed inset-y-0 right-0 w-120 bg-white shadow-[-16px_0_40px_rgba(20,30,25,0.18),-1px_0_0_rgba(20,30,25,0.06)] flex flex-col z-50">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#EEF2F0] flex items-start justify-between">
          <div>
            <div className="text-[11px] text-[#D4860B] font-bold tracking-[0.5px] mb-0.75">
              EDIT REKENING
            </div>
            <h2 className="m-0 text-[19px] font-bold tracking-[-0.4px] text-[#1A2420]">
              {account.name}
            </h2>
            <div className="text-[12.5px] text-[#7D9590] mt-1">
              Perbarui detail rekening
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-[8px] border-none bg-[#F6F9F7] cursor-pointer text-[#7D9590] flex items-center justify-center shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5.5">

          {/* Preview card */}
          <div
            className="rounded-[12px] py-4 px-4.5 mb-5.5 flex items-center gap-3.5"
            style={{
              background: color + '14',
              border: `1px solid ${color}30`,
              borderLeft: `4px solid ${color}`,
            }}
          >
            <div
              className="w-10 h-10 rounded-[11px] flex items-center justify-center text-xs font-bold shrink-0 text-white"
              style={{ background: color }}
            >
              {previewGlyph}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[#1A2420]">
                {name || 'Nama Rekening'}
              </div>
              <div className="text-[11.5px] text-[#A4B8B2] mt-0.5">
                {previewSubtitle || account.subtitle}
              </div>
            </div>
            <div className="tabular-nums font-bold text-[15px] text-[#1A2420]">
              {formatRp(balance)}
            </div>
          </div>

          <Field label="Nama Rekening">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="cth: BCA Utama, GoPay, Dompet Harian…"
              className={inputCls}
            />
          </Field>

          <Field label="Jenis Rekening">
            <div className="flex flex-col gap-1.5">
              {ACCOUNT_TYPES.map(t => {
                const active = t.id === type;
                return (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={`flex items-center gap-3 py-2.75 px-3.5 rounded-[9px] border cursor-pointer font-sans text-left ${
                      active ? 'bg-[#E6F6F0] border-[#1D9E75]' : 'bg-[#F6F9F7] border-[#E0EAE6]'
                    }`}
                  >
                    <div className="flex-1">
                      <div className={`text-[13px] font-semibold ${active ? 'text-[#15735A]' : 'text-[#1A2420]'}`}>
                        {t.label}
                      </div>
                      <div className="text-[11.5px] text-[#A4B8B2]">{t.hint}</div>
                    </div>
                    {active && (
                      <div className="w-4.5 h-4.5 rounded-full bg-[#1D9E75] text-white flex items-center justify-center">
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Warna Label">
            <div className="flex flex-wrap gap-2">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-[9px] cursor-pointer outline-none flex items-center justify-center transition-[border-color] duration-100"
                  style={{
                    background: c,
                    border: color === c ? `3px solid #1A2420` : '3px solid transparent',
                  }}
                >
                  {color === c && <Check size={14} color="white" strokeWidth={3} />}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Nomor Rekening / ID" optional>
            <input
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value)}
              placeholder={account.subtitle}
              className={inputCls}
            />
          </Field>

          <Field label="Saldo Terkini" hint="Perbarui jika ada perbedaan dengan saldo aktual.">
            <div className="bg-[#F0FAF6] border-[1.5px] border-[#1D9E75] rounded-[12px] py-4 px-4.5 text-center mb-2.5">
              <div className="inline-flex items-baseline gap-2">
                <span className="text-[17px] text-[#15735A] font-semibold">Rp</span>
                <input
                  type="text"
                  value={balance.toLocaleString('id-ID')}
                  onChange={handleBalanceInput}
                  className="text-[34px] font-bold tracking-[-1px] text-[#1A2420] tabular-nums border-none bg-transparent outline-none font-sans text-center w-50"
                />
              </div>
            </div>
          </Field>

          {/* Danger zone */}
          <div className="py-4 px-4.5 bg-[#FDEEEE] rounded-[10px] border border-[#C0392B22]">
            <div className="text-xs font-semibold text-[#C0392B] mb-2.5">
              Zona Bahaya
            </div>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 py-2 px-3.5 rounded-[7px] border border-[#C0392B44] bg-white text-[#C0392B] text-[12.5px] font-semibold cursor-pointer font-sans"
              >
                <Trash2 size={13} />
                Hapus Rekening Ini
              </button>
            ) : (
              <div>
                <div className="flex items-start gap-1.75 text-[12.5px] text-[#C0392B] mb-3 leading-normal">
                  <AlertTriangle size={14} className="shrink-0 mt-px" />
                  <span>
                    Yakin hapus rekening <strong>{account.name}</strong>?
                    Tindakan ini tidak dapat dibatalkan.
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="py-1.75 px-4 rounded-[7px] border border-[#E0EAE6] bg-white text-[#1A2420] text-[12.5px] font-semibold cursor-pointer font-sans"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleDelete}
                    className="py-1.75 px-4 rounded-[7px] border-none bg-[#C0392B] text-white text-[12.5px] font-semibold cursor-pointer font-sans"
                  >
                    Ya, Hapus
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#EEF2F0] bg-[#F6F9F7] flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2.75 rounded-[9px] border border-[#E0EAE6] bg-white text-[#1A2420] text-[13.5px] font-semibold cursor-pointer font-sans"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className={`flex-2 py-2.75 rounded-[9px] border-none text-white text-[13.5px] font-semibold font-sans flex items-center justify-center gap-1.5 ${
              name.trim() ? 'bg-[#1D9E75] cursor-pointer' : 'bg-[#CEDAD4] cursor-not-allowed'
            }`}
          >
            <Check size={14} />
            Simpan Perubahan
          </button>
        </div>
      </div>
    </>
  );
}
