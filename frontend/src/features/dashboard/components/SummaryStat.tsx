import type { ReactNode } from 'react';
import { T } from '@/lib/tokens';

interface SummaryStatProps {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: 'up' | 'down' | 'neutral';
  large?: boolean;
  icon?: ReactNode;
}

export function SummaryStat({ label, value, delta, deltaTone, large, icon }: SummaryStatProps) {
  return (
    <div
      className={`flex-1 min-w-0 rounded-xl ${
        large
          ? 'p-[20px_22px] text-white border-0'
          : 'p-[16px_18px] bg-white border border-[#E0EAE6]'
      }`}
      style={large ? { background: `linear-gradient(135deg, ${T.primaryDark} 0%, ${T.primary} 100%)` } : undefined}
    >
      <div className={`text-xs font-medium flex items-center gap-1.5 ${large ? 'text-white/75' : 'text-[#7D9590]'}`}>
        {icon}
        {label}
      </div>
      <div className={`font-bold mt-1.5 tracking-[-0.5px] tabular-nums ${large ? 'text-[28px]' : 'text-[22px]'}`}>
        {value}
      </div>
      {delta && (
        <div className={`text-xs mt-1.5 flex items-center gap-1 ${
          large             ? 'text-white/85'   :
          deltaTone === 'up'   ? 'text-[#15735A]' :
          deltaTone === 'down' ? 'text-[#A52826]' :
          'text-[#7D9590]'
        }`}>
          {deltaTone === 'up' ? '↑' : deltaTone === 'down' ? '↓' : ''}
          {delta}
        </div>
      )}
    </div>
  );
}
