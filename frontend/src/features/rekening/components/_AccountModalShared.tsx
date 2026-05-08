"use client";
import { Check } from 'lucide-react';
import { ACCOUNT_TYPES, COLORS } from '../constants';
import type { AccountType } from '../types';
import { formatRp } from '@/lib/format';

export function Field({ label, children, hint, optional, error }: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  optional?: boolean;
  error?: string;
}) {
  return (
    <div className="mb-4.5">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[0.71875rem] font-semibold text-[#7D9590] tracking-[0.01875rem]">
          {label.toUpperCase()}
        </div>
        {optional && <span className="text-[0.6875rem] text-[#A4B8B2] font-medium">opsional</span>}
      </div>
      {children}
      {error
        ? <div className="text-[0.71875rem] text-app-danger mt-1.5 leading-[1.45]">{error}</div>
        : hint && <div className="text-[0.71875rem] text-app-text-subtle mt-1.5 leading-[1.45]">{hint}</div>
      }
    </div>
  );
}

export const inputCls = "w-full py-2.5 px-3 rounded-[0.5625rem] border border-[#E0EAE6] bg-[#F6F9F7] text-[0.84375rem] text-[#1A2420] font-sans outline-none box-border";
export const inputErrorCls = "w-full py-2.5 px-3 rounded-[0.5625rem] border border-[#C0392B] bg-[#FFF8F8] text-[0.84375rem] text-[#1A2420] font-sans outline-none box-border";

export function buildPreviewData(name: string, type: AccountType, accountNumber: string) {
  const previewGlyph = name ? name.slice(0, 3).toUpperCase() : '···';
  const typeLabel = ACCOUNT_TYPES.find(accountType => accountType.id === type)?.label ?? '';
  const previewSubtitle = `${typeLabel}${accountNumber ? ' · ****' + accountNumber.slice(-4) : ''}`;
  return { previewGlyph, typeLabel, previewSubtitle };
}

export function parseBalanceInput(rawValue: string): number {
  const digits = rawValue.replace(/[^\d]/g, '');
  return digits ? parseInt(digits) : 0;
}

interface AccountPreviewCardProps {
  name: string;
  color: string;
  balance: number;
  previewGlyph: string;
  previewSubtitle: string;
  fallbackSubtitle: string;
}

export function AccountPreviewCard({ name, color, balance, previewGlyph, previewSubtitle, fallbackSubtitle }: AccountPreviewCardProps) {
  return (
    <div
      className="rounded-[0.75rem] py-4 px-4.5 mb-5.5 flex items-center gap-3.5"
      style={{
        background: color + '14',
        border: `1px solid ${color}30`,
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div
        className="w-10 h-10 rounded-[0.6875rem] flex items-center justify-center text-xs font-bold shrink-0 text-white"
        style={{ background: color }}
      >
        {previewGlyph}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-[#1A2420]">
          {name || 'Nama Rekening'}
        </div>
        <div className="text-[0.71875rem] text-[#A4B8B2] mt-0.5">
          {previewSubtitle || fallbackSubtitle}
        </div>
      </div>
      <div className="tabular-nums font-bold text-[0.9375rem] text-[#1A2420]">
        {formatRp(balance)}
      </div>
    </div>
  );
}

interface AccountTypeSelectorProps {
  selectedType: AccountType;
  onSelect: (type: AccountType) => void;
}

export function AccountTypeSelector({ selectedType, onSelect }: AccountTypeSelectorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {ACCOUNT_TYPES.map(accountType => {
        const isActive = accountType.id === selectedType;
        return (
          <button
            key={accountType.id}
            onClick={() => onSelect(accountType.id)}
            className={`flex items-center gap-3 py-2.75 px-3.5 rounded-[0.5625rem] border cursor-pointer font-sans text-left ${
              isActive ? 'bg-[#E6F6F0] border-[#1D9E75]' : 'bg-[#F6F9F7] border-[#E0EAE6]'
            }`}
          >
            <div className="flex-1">
              <div className={`text-[0.8125rem] font-semibold ${isActive ? 'text-[#15735A]' : 'text-[#1A2420]'}`}>
                {accountType.label}
              </div>
              <div className="text-[0.71875rem] text-[#A4B8B2]">{accountType.hint}</div>
            </div>
            {isActive && (
              <div className="w-4.5 h-4.5 rounded-full bg-[#1D9E75] text-white flex items-center justify-center">
                <Check size={10} strokeWidth={3} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

interface ColorPickerProps {
  selectedColor: string;
  onSelect: (color: string) => void;
}

export function ColorPicker({ selectedColor, onSelect }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {COLORS.map(color => (
        <button
          key={color}
          onClick={() => onSelect(color)}
          className="w-8 h-8 rounded-[0.5625rem] cursor-pointer outline-none flex items-center justify-center transition-[border-color] duration-100"
          style={{
            background: color,
            border: selectedColor === color ? `3px solid #1A2420` : '3px solid transparent',
          }}
        >
          {selectedColor === color && <Check size={14} color="white" strokeWidth={3} />}
        </button>
      ))}
    </div>
  );
}

export function ModalLoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] z-10 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-[3px] border-app-border border-t-brand animate-spin" />
        <div className="text-[0.875rem] font-semibold text-app-text">Menyimpan...</div>
      </div>
    </div>
  );
}
