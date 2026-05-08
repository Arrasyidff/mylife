"use client";
import { useState, useEffect } from 'react';
import { X, Check, CalendarDays } from 'lucide-react';
import { useScrollLock } from '@/lib/hooks/useScrollLock';
import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';
import { CatBubble } from '@/components/shared/CatBubble';
import { AMOUNT_WORDS, MONTHLY_INCOME } from '../constants';
import { createAnggaranSchema } from '../schemas/anggaran.schema';
import type { BudgetPeriod, CreateAnggaranInput } from '../types';
import {
  Field,
  Toggle,
  ModalLoadingOverlay,
  CategorySelector,
  AmountPresets,
  PeriodSelector,
  CarryOverField,
} from './_BudgetModalShared';

interface AddBudgetModalProps {
  onClose: () => void;
  onAdd: (input: CreateAnggaranInput) => Promise<void>;
  totalExisting: number;
  isSubmitting: boolean;
}

export function AddBudgetModal({ onClose, onAdd, totalExisting, isSubmitting }: AddBudgetModalProps) {
  useScrollLock();
  const [selectedCat, setSelectedCat] = useState('fun');
  const [selectedPeriod, setSelectedPeriod] = useState<BudgetPeriod>('MONTHLY');
  const [amount, setAmount] = useState(1_500_000);
  const [notifs, setNotifs] = useState({ pct75: true, pct100: true, weekly: false });
  const [carryOver, setCarryOver] = useState(false);
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

  const totalAfter = totalExisting + amount;
  const remaining = MONTHLY_INCOME - totalAfter;

  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const startDateDisplay = startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  async function handleSave() {
    setValidationErrors({});

    const parseResult = createAnggaranSchema.safeParse({
      name: selectedCat,
      category: selectedCat,
      total: amount,
      period: selectedPeriod,
      carry_over: carryOver,
      start_date: startDate.toISOString(),
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
      await onAdd(parseResult.data as CreateAnggaranInput);
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
            <div className="text-[11px] text-[#1D9E75] font-bold tracking-[0.5px] mb-0.75">
              ANGGARAN BARU
            </div>
            <h2 className="m-0 text-lg sm:text-[19px] font-bold tracking-[-0.025rem] text-app-text">
              Tambah Anggaran
            </h2>
            <div className="text-xs sm:text-[12.5px] text-app-text-muted mt-1">
              Tetapkan batas pengeluaran untuk satu kategori
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
          <Field label="Kategori" error={validationErrors.category}>
            <CategorySelector selectedCat={selectedCat} onSelect={setSelectedCat} />
          </Field>

          <Field label="Batas Anggaran" error={validationErrors.total}>
            <div className="bg-brand-soft border-[1.5px] border-[#1D9E75] rounded-[12px] py-4.5 px-4.5 pb-4 text-center mb-2.5">
              <div className="inline-flex items-baseline gap-2">
                <span className="text-[18px] text-brand-dark font-semibold">Rp</span>
                <span className="text-[38px] font-bold tracking-[-0.0625rem] text-app-text tabular-nums">
                  {amount.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="text-[11.5px] text-brand-dark mt-1 font-medium">
                {AMOUNT_WORDS[amount] ?? formatRp(amount)}
              </div>
            </div>
            <AmountPresets amount={amount} onSelect={setAmount} />
          </Field>

          <Field label="Periode" error={validationErrors.period}>
            <PeriodSelector selectedPeriod={selectedPeriod} onSelect={setSelectedPeriod} />
          </Field>

          <Field label="Mulai Berlaku" error={validationErrors.start_date}>
            <div className="flex items-center bg-surface-alt border border-app-border rounded-[9px] py-2.5 px-3 text-[13.5px]">
              <span className="flex-1 font-medium text-app-text">{startDateDisplay}</span>
              <CalendarDays size={15} color={T.textSubtle} />
            </div>
          </Field>

          <Field label="Notifikasi" hint="Kami akan mengirim peringatan saat anggaran mencapai ambang ini.">
            <div className="bg-surface-alt border border-app-border rounded-[10px] py-1 px-3.5">
              {([
                { key: 'pct75' as const,  label: 'Saat mencapai 75%',  dotColor: T.warning    },
                { key: 'pct100' as const, label: 'Saat mencapai 100%', dotColor: T.danger      },
                { key: 'weekly' as const, label: 'Ringkasan mingguan',  dotColor: T.textSubtle },
              ] as const).map((row, index, rows) => (
                <div
                  key={row.key}
                  className={`flex items-center gap-3 py-2.5 ${index < rows.length - 1 ? 'border-b border-app-divider' : ''}`}
                >
                  <span className="w-2 h-2 rounded-full shrink-0 block" style={{ background: row.dotColor }} />
                  <span className="flex-1 text-[13px] text-app-text">{row.label}</span>
                  <Toggle
                    on={notifs[row.key]}
                    onChange={value => setNotifs(prev => ({ ...prev, [row.key]: value }))}
                  />
                </div>
              ))}
            </div>
          </Field>

          <CarryOverField
            carryOver={carryOver}
            onToggle={setCarryOver}
            label="Lanjut ke Bulan Berikutnya"
          />

          <div className="bg-brand-soft border border-[#1D9E7530] rounded-[12px] py-3.5 px-4 mb-1">
            <div className="flex items-center gap-1.75 mb-2.5">
              <CatBubble cat={selectedCat} size={26} />
              <span className="text-[12.5px] font-semibold text-app-text">
                Setelah anggaran ini ditambahkan
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[11.5px] text-app-text-muted">Total anggaran bulanan</span>
              <span className="text-[13px] tabular-nums text-app-text-muted">
                <span className="line-through">{formatRp(totalExisting)}</span>
                <span className="mx-1.5">→</span>
                <strong className="text-brand-dark font-bold">{formatRp(totalAfter)}</strong>
              </span>
            </div>
            <div className="flex justify-between items-baseline mt-1.5">
              <span className="text-[11.5px] text-app-text-muted">Sisa kapasitas (vs pemasukan)</span>
              <span className={`text-[13px] font-semibold tabular-nums ${remaining >= 0 ? 'text-brand-dark' : 'text-app-danger'}`}>
                {formatRp(Math.abs(remaining))} {remaining >= 0 ? 'aman' : 'melebihi'}
              </span>
            </div>
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
            Simpan Anggaran
          </button>
        </div>

        {isSubmitting && <ModalLoadingOverlay />}
      </div>
    </>
  );
}
