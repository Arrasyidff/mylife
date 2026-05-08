"use client";
import { useState } from 'react';
import { X, Check, CalendarDays } from 'lucide-react';
import { useScrollLock } from '@/lib/hooks/useScrollLock';
import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';
import { CatBubble } from '@/components/shared/CatBubble';
import { CATS, PERIODS, AMOUNT_PRESETS, AMOUNT_WORDS, MONTHLY_INCOME } from '../constants';
import type { BudgetPeriod, CreateAnggaranInput } from '../types';

interface AddBudgetModalProps {
  onClose: () => void;
  onAdd: (input: CreateAnggaranInput) => Promise<void>;
  totalExisting: number;
  isSubmitting: boolean;
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

export function AddBudgetModal({ onClose, onAdd, totalExisting, isSubmitting }: AddBudgetModalProps) {
  useScrollLock();
  const [selectedCat, setSelectedCat]       = useState('fun');
  const [selectedPeriod, setSelectedPeriod] = useState<BudgetPeriod>('MONTHLY');
  const [amount, setAmount]                 = useState(1_500_000);
  const [notifs, setNotifs]                 = useState({ pct75: true, pct100: true, weekly: false });
  const [carryOver, setCarryOver]           = useState(false);

  const totalAfter = totalExisting + amount;
  const remaining  = MONTHLY_INCOME - totalAfter;

  async function handleSave() {
    try {
      const catLabel  = CATS.find(c => c.id === selectedCat)?.name ?? selectedCat;
      const now       = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();
      const input: CreateAnggaranInput = {
        name:       catLabel,
        category:   selectedCat,
        total:      amount,
        period:     selectedPeriod,
        carry_over: carryOver,
        start_date: startDate,
      };
      await onAdd(input);
      onClose();
    } catch {
      // error shown via toast in hook
    }
  }

  return (
    <>
      <div
        onClick={!isSubmitting ? onClose : undefined}
        className="fixed inset-0 bg-[rgba(20,30,25,0.35)] backdrop-blur-[2px] z-40"
      />

      <div className="fixed inset-0 sm:inset-y-0 sm:left-auto sm:right-0 sm:w-120 bg-white flex flex-col overflow-hidden z-50 shadow-[-16px_0_40px_rgba(20,30,25,0.18),-1px_0_0_rgba(20,30,25,0.06)]" style={{ isolation: 'isolate' }}>
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-[#EEF2F0] flex items-start justify-between shrink-0">
          <div>
            <div className="text-[11px] text-[#1D9E75] font-bold tracking-[0.5px] mb-[3px]">
              ANGGARAN BARU
            </div>
            <h2 className="m-0 text-lg sm:text-[19px] font-bold tracking-[-0.025rem] text-[#1A2420]">
              Tambah Anggaran
            </h2>
            <div className="text-xs sm:text-[12.5px] text-[#7D9590] mt-1">
              Tetapkan batas pengeluaran untuk satu kategori
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
                      border: `1px solid ${active ? T.primary : T.border}`,
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
                <span className="text-[38px] font-bold tracking-[-0.0625rem] text-[#1A2420] tabular-nums">
                  {amount.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="text-[11.5px] text-[#15735A] mt-1 font-medium">
                {AMOUNT_WORDS[amount] ?? formatRp(amount)}
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

          {/* Start date */}
          <Field label="Mulai Berlaku">
            <div className="flex items-center bg-[#F6F9F7] border border-[#E0EAE6] rounded-[9px] py-2.5 px-3 text-[13.5px]">
              <span className="flex-1 font-medium text-[#1A2420]">1 Mei 2026</span>
              <CalendarDays size={15} color={T.textSubtle} />
            </div>
          </Field>

          {/* Notification toggles */}
          <Field label="Notifikasi" hint="Kami akan mengirim peringatan saat anggaran mencapai ambang ini.">
            <div className="bg-[#F6F9F7] border border-[#E0EAE6] rounded-[10px] py-1 px-3.5">
              {([
                { key: 'pct75'  as const, label: 'Saat mencapai 75%',  dotColor: T.warning    },
                { key: 'pct100' as const, label: 'Saat mencapai 100%', dotColor: T.danger      },
                { key: 'weekly' as const, label: 'Ringkasan mingguan',  dotColor: T.textSubtle },
              ] as const).map((row, i, arr) => (
                <div
                  key={row.key}
                  className={`flex items-center gap-3 py-2.5 ${i < arr.length - 1 ? 'border-b border-[#EEF2F0]' : ''}`}
                >
                  <span className="w-2 h-2 rounded-full shrink-0 block" style={{ background: row.dotColor }} />
                  <span className="flex-1 text-[13px] text-[#1A2420]">{row.label}</span>
                  <Toggle
                    on={notifs[row.key]}
                    onChange={val => setNotifs(prev => ({ ...prev, [row.key]: val }))}
                  />
                </div>
              ))}
            </div>
          </Field>

          {/* Carry over */}
          <Field label="Lanjut ke Bulan Berikutnya" optional>
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

          {/* Forecast preview */}
          <div className="bg-[#F0FAF6] border border-[#1D9E7530] rounded-[12px] py-3.5 px-4 mb-1">
            <div className="flex items-center gap-[7px] mb-2.5">
              <CatBubble cat={selectedCat} size={26} />
              <span className="text-[12.5px] font-semibold text-[#1A2420]">
                Setelah anggaran ini ditambahkan
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[11.5px] text-[#7D9590]">Total anggaran bulanan</span>
              <span className="text-[13px] tabular-nums text-[#7D9590]">
                <span className="line-through">{formatRp(totalExisting)}</span>
                <span className="mx-1.5">→</span>
                <strong className="text-[#15735A] font-bold">{formatRp(totalAfter)}</strong>
              </span>
            </div>
            <div className="flex justify-between items-baseline mt-1.5">
              <span className="text-[11.5px] text-[#7D9590]">Sisa kapasitas (vs pemasukan)</span>
              <span className={`text-[13px] font-semibold tabular-nums ${remaining >= 0 ? 'text-[#15735A]' : 'text-[#C0392B]'}`}>
                {formatRp(Math.abs(remaining))} {remaining >= 0 ? 'aman' : 'melebihi'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-[#EEF2F0] bg-[#F6F9F7] flex gap-2.5 shrink-0">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-[11px] rounded-[9px] border border-[#E0EAE6] bg-white text-[#1A2420] text-[13.5px] font-semibold cursor-pointer font-sans disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex-[2] py-[11px] rounded-[9px] border-none bg-[#1D9E75] text-white text-[13.5px] font-semibold cursor-pointer font-sans flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Check size={14} />
            Simpan Anggaran
          </button>
        </div>

        {/* Loading overlay */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-[3px] border-app-border border-t-brand animate-spin" />
              <div className="text-[0.875rem] font-semibold text-app-text">Menyimpan...</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
