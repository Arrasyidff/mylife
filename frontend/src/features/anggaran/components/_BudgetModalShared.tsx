"use client";
import { Check } from 'lucide-react';
import { T } from '@/lib/tokens';
import { CatBubble } from '@/components/shared/CatBubble';
import { CATS, PERIODS, AMOUNT_PRESETS } from '../constants';
import type { BudgetPeriod } from '../types';

export function Field({ label, children, hint, optional, error }: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  optional?: boolean;
  error?: string;
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
      {error
        ? <div className="text-[11.5px] text-app-danger mt-1.5 leading-[1.45]">{error}</div>
        : hint && <div className="text-[11.5px] text-app-text-subtle mt-1.5 leading-[1.45]">{hint}</div>
      }
    </div>
  );
}

export function Toggle({ on, onChange }: { on: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="relative shrink-0 border-none cursor-pointer transition-colors duration-150"
      style={{ width: 32, height: 18, borderRadius: 9, background: on ? T.primary : '#D6D8D0' }}
    >
      <span
        className="absolute top-[2px] w-3.5 h-3.5 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.18)] block transition-[left] duration-150"
        style={{ left: on ? 16 : 2 }}
      />
    </button>
  );
}

export function ModalLoadingOverlay({ label = 'Menyimpan...' }: { label?: string }) {
  return (
    <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] z-10 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-[3px] border-app-border border-t-brand animate-spin" />
        <div className="text-[0.875rem] font-semibold text-app-text">{label}</div>
      </div>
    </div>
  );
}

interface CategorySelectorProps {
  selectedCat: string;
  onSelect: (catId: string) => void;
}

export function CategorySelector({ selectedCat, onSelect }: CategorySelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {CATS.map(category => {
        const isActive = category.id === selectedCat;
        return (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className="flex flex-col items-center gap-1.5 py-[11px] px-1 rounded-[10px] cursor-pointer font-sans relative"
            style={{
              background: isActive ? T.primaryLight : T.surfaceAlt,
              border: `1px solid ${isActive ? T.primary : T.border}`,
            }}
          >
            {isActive && (
              <span className="absolute top-[5px] right-[5px] w-3.5 h-3.5 rounded-full bg-[#1D9E75] text-white flex items-center justify-center">
                <Check size={9} strokeWidth={3} />
              </span>
            )}
            <CatBubble cat={category.id} size={32} />
            <span className="text-[11px] font-semibold" style={{ color: isActive ? T.primaryDark : T.textMuted }}>
              {category.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

interface AmountPresetsProps {
  amount: number;
  onSelect: (amount: number) => void;
}

export function AmountPresets({ amount, onSelect }: AmountPresetsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {AMOUNT_PRESETS.map(preset => {
        const isActive = preset === amount;
        return (
          <button
            key={preset}
            onClick={() => onSelect(preset)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer font-sans tabular-nums"
            style={{
              background: isActive ? T.primary : T.surface,
              color: isActive ? 'white' : T.textMuted,
              border: `1px solid ${isActive ? T.primary : T.border}`,
            }}
          >
            Rp {preset.toLocaleString('id-ID')}
          </button>
        );
      })}
    </div>
  );
}

interface PeriodSelectorProps {
  selectedPeriod: BudgetPeriod;
  onSelect: (period: BudgetPeriod) => void;
}

export function PeriodSelector({ selectedPeriod, onSelect }: PeriodSelectorProps) {
  return (
    <div className="flex gap-2">
      {PERIODS.map(period => {
        const isActive = period.id === selectedPeriod;
        return (
          <button
            key={period.id}
            onClick={() => onSelect(period.id as BudgetPeriod)}
            className="flex-1 py-3 px-2.5 rounded-[10px] cursor-pointer flex flex-col items-center gap-[3px] font-sans"
            style={{
              background: isActive ? T.primaryLight : T.surfaceAlt,
              border: `1px solid ${isActive ? T.primary : T.border}`,
            }}
          >
            <span className="text-[13px] font-semibold" style={{ color: isActive ? T.primaryDark : T.text }}>
              {period.label}
            </span>
            <span className="text-[10.5px] text-[#A4B8B2]">{period.hint}</span>
          </button>
        );
      })}
    </div>
  );
}

interface CarryOverFieldProps {
  carryOver: boolean;
  onToggle: (value: boolean) => void;
  label?: string;
}

export function CarryOverField({ carryOver, onToggle, label = 'Lanjut ke Periode Berikutnya' }: CarryOverFieldProps) {
  return (
    <Field label={label} optional>
      <div className="flex items-start gap-3 py-3 px-3.5 bg-[#F6F9F7] border border-[#E0EAE6] rounded-[10px]">
        <div className="mt-0.5">
          <Toggle on={carryOver} onChange={onToggle} />
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-[#1A2420]">Sisa anggaran dilanjutkan</div>
          <div className="text-[11.5px] text-[#A4B8B2] mt-0.5 leading-[1.45]">
            Jika tidak terpakai, sisa akan ditambahkan ke periode berikutnya.
          </div>
        </div>
      </div>
    </Field>
  );
}
