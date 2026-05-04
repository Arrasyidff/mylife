"use client";
import { useState } from 'react';
import { X, Check, Trash2, AlertTriangle } from 'lucide-react';
import { useScrollLock } from '@/lib/hooks/useScrollLock';
import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';
import { CatBubble } from '@/components/shared/CatBubble';
import { CATS, PERIODS, AMOUNT_PRESETS } from '../constants';
import type { Budget, BudgetPeriod } from '../types';

interface EditBudgetModalProps {
  budget: Budget;
  onSave: (budget: Budget) => void;
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
    <div className="mb-[18px]">
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

function Toggle({ on, onChange }: { on: boolean; onChange: (val: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="relative shrink-0 border-none cursor-pointer transition-colors duration-150"
      style={{
        width: 32, height: 18, borderRadius: 9,
        background: on ? T.primary : '#D6D8D0',
      }}
    >
      <span
        className="absolute top-[2px] w-3.5 h-3.5 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.18)] block transition-[left] duration-150"
        style={{ left: on ? 16 : 2 }}
      />
    </button>
  );
}

export function EditBudgetModal({ budget, onSave, onDelete, onClose }: EditBudgetModalProps) {
  useScrollLock();
  const [selectedCat, setSelectedCat]       = useState(budget.cat);
  const [selectedPeriod, setSelectedPeriod] = useState<BudgetPeriod>(budget.period ?? 'monthly');
  const [amount, setAmount]                 = useState(budget.total);
  const [carryOver, setCarryOver]           = useState(budget.carryOver ?? false);
  const [confirmDelete, setConfirmDelete]   = useState(false);

  const catName = CATS.find(c => c.id === selectedCat)?.name ?? selectedCat;

  function handleSave() {
    onSave({ ...budget, name: catName, cat: selectedCat, total: amount, period: selectedPeriod, carryOver });
    onClose();
  }

  function handleDelete() {
    onDelete(budget.id);
    onClose();
  }

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-[rgba(20,30,25,0.35)] backdrop-blur-[2px] z-40" />

      <div className="fixed inset-0 sm:inset-y-0 sm:left-auto sm:right-0 sm:w-120 bg-white flex flex-col overflow-hidden z-50 shadow-[-16px_0_40px_rgba(20,30,25,0.18),-1px_0_0_rgba(20,30,25,0.06)]">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-[#EEF2F0] flex items-start justify-between shrink-0">
          <div>
            <div className="text-[11px] text-[#D4860B] font-bold tracking-[0.5px] mb-[3px]">
              EDIT ANGGARAN
            </div>
            <h2 className="m-0 text-lg sm:text-[19px] font-bold tracking-[-0.025rem] text-[#1A2420]">
              {budget.name}
            </h2>
            <div className="text-xs sm:text-[12.5px] text-[#7D9590] mt-1">
              Perbarui batas dan pengaturan anggaran
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
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">

          {/* Preview */}
          <div
            className="bg-[#F0FAF6] rounded-[12px] py-3.5 px-[18px] mb-[22px] flex items-center gap-3.5"
            style={{ border: `1px solid ${T.primary}30`, borderLeft: `4px solid ${T.primary}` }}
          >
            <CatBubble cat={selectedCat} size={38} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[#1A2420]">{catName}</div>
              <div className="text-[11.5px] text-[#A4B8B2] mt-0.5">
                {formatRp(budget.used)} terpakai dari {formatRp(amount)}
              </div>
            </div>
            <div className="text-[15px] font-bold text-[#15735A] tabular-nums">{formatRp(amount)}</div>
          </div>

          {/* Category */}
          <Field label="Kategori">
            <div className="grid grid-cols-4 gap-2">
              {CATS.map(c => {
                const active = c.id === selectedCat;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCat(c.id)}
                    className="flex flex-col items-center gap-1.5 py-[11px] px-1 rounded-[10px] cursor-pointer font-sans relative"
                    style={{
                      background: active ? T.primaryLight : T.surfaceAlt,
                      border:     `1px solid ${active ? T.primary : T.border}`,
                    }}
                  >
                    {active && (
                      <span className="absolute top-[5px] right-[5px] w-3.5 h-3.5 rounded-full bg-[#1D9E75] text-white flex items-center justify-center">
                        <Check size={9} strokeWidth={3} />
                      </span>
                    )}
                    <CatBubble cat={c.id} size={32} />
                    <span className="text-[11px] font-semibold" style={{ color: active ? T.primaryDark : T.textMuted }}>
                      {c.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Amount */}
          <Field label="Batas Anggaran">
            <div className="bg-[#F0FAF6] border-[1.5px] border-[#1D9E75] rounded-[12px] py-[18px] px-[18px] pb-4 text-center mb-2.5">
              <div className="inline-flex items-baseline gap-2">
                <span className="text-[18px] text-[#15735A] font-semibold">Rp</span>
                <input
                  type="text"
                  value={amount.toLocaleString('id-ID')}
                  onChange={e => {
                    const raw = e.target.value.replace(/[^\d]/g, '');
                    setAmount(raw ? parseInt(raw) : 0);
                  }}
                  className="text-[34px] font-bold tracking-[-0.0625rem] text-[#1A2420] tabular-nums border-none bg-transparent outline-none font-sans text-center w-[200px]"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {AMOUNT_PRESETS.map(p => {
                const active = p === amount;
                return (
                  <button
                    key={p}
                    onClick={() => setAmount(p)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer font-sans tabular-nums"
                    style={{
                      background: active ? T.primary : T.surface,
                      color:      active ? 'white'   : T.textMuted,
                      border:     `1px solid ${active ? T.primary : T.border}`,
                    }}
                  >
                    Rp {p.toLocaleString('id-ID')}
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Period */}
          <Field label="Periode">
            <div className="flex gap-2">
              {PERIODS.map(p => {
                const active = p.id === selectedPeriod;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPeriod(p.id as BudgetPeriod)}
                    className="flex-1 py-3 px-2.5 rounded-[10px] cursor-pointer flex flex-col items-center gap-[3px] font-sans"
                    style={{
                      background: active ? T.primaryLight : T.surfaceAlt,
                      border:     `1px solid ${active ? T.primary : T.border}`,
                    }}
                  >
                    <span className="text-[13px] font-semibold" style={{ color: active ? T.primaryDark : T.text }}>
                      {p.label}
                    </span>
                    <span className="text-[10.5px] text-[#A4B8B2]">{p.hint}</span>
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Carry over */}
          <Field label="Lanjut ke Periode Berikutnya" optional>
            <div className="flex items-start gap-3 py-3 px-3.5 bg-[#F6F9F7] border border-[#E0EAE6] rounded-[10px]">
              <div className="mt-0.5">
                <Toggle on={carryOver} onChange={setCarryOver} />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-[#1A2420]">Sisa anggaran dilanjutkan</div>
                <div className="text-[11.5px] text-[#A4B8B2] mt-0.5 leading-[1.45]">
                  Jika tidak terpakai, sisa akan ditambahkan ke periode berikutnya.
                </div>
              </div>
            </div>
          </Field>

          {/* Danger zone */}
          <div className="py-4 px-[18px] bg-[#FDEEEE] rounded-[10px] border border-[#C0392B22]">
            <div className="text-xs font-semibold text-[#C0392B] mb-2.5">Zona Bahaya</div>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 py-2 px-3.5 rounded-[7px] border border-[#C0392B44] bg-white text-[#C0392B] text-[12.5px] font-semibold cursor-pointer font-sans"
              >
                <Trash2 size={13} />
                Hapus Anggaran Ini
              </button>
            ) : (
              <div>
                <div className="flex items-start gap-[7px] text-[12.5px] text-[#C0392B] mb-3 leading-[1.5]">
                  <AlertTriangle size={14} className="shrink-0 mt-[1px]" />
                  <span>
                    Yakin hapus anggaran <strong>{budget.name}</strong>?
                    Tindakan ini tidak dapat dibatalkan.
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="py-[7px] px-4 rounded-[7px] border border-[#E0EAE6] bg-white text-[#1A2420] text-[12.5px] font-semibold cursor-pointer font-sans"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleDelete}
                    className="py-[7px] px-4 rounded-[7px] border-none bg-[#C0392B] text-white text-[12.5px] font-semibold cursor-pointer font-sans"
                  >
                    Ya, Hapus
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-[#EEF2F0] bg-[#F6F9F7] flex gap-2.5 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-[11px] rounded-[9px] border border-[#E0EAE6] bg-white text-[#1A2420] text-[13.5px] font-semibold cursor-pointer font-sans"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="flex-[2] py-[11px] rounded-[9px] border-none bg-[#1D9E75] text-white text-[13.5px] font-semibold cursor-pointer font-sans flex items-center justify-center gap-1.5"
          >
            <Check size={14} />
            Simpan Perubahan
          </button>
        </div>
      </div>
    </>
  );
}
