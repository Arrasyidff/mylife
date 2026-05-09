import type { ReactNode } from 'react';
import { T } from '@/lib/tokens';

interface SummaryStatProps {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: 'up' | 'down' | 'neutral';
  large?: boolean;
  icon?: ReactNode;
  className?: string;
}

export function SummaryStat({ label, value, delta, deltaTone, large, icon, className }: SummaryStatProps) {
  return (
    <div
      className={`min-w-0 rounded-xl ${
        large
          ? 'p-[16px_18px] md:p-[20px_22px] text-white border-0'
          : 'p-[14px_16px] md:p-[16px_18px] bg-white dark:bg-gray-800 border border-app-border dark:border-gray-700'
      } ${className ?? ''}`}
      style={large ? { background: `linear-gradient(135deg, ${T.primaryDark} 0%, ${T.primary} 100%)` } : undefined}
    >
      <div className={`text-xs font-medium flex items-center gap-1.5 ${large ? 'text-white/75' : 'text-app-text-muted'}`}>
        {icon}
        {label}
      </div>
      <div className={`font-bold mt-1.5 tracking-[-0.5px] tabular-nums ${large ? 'text-[22px] md:text-[28px]' : 'text-[17px] md:text-[22px] text-app-text'}`}>
        {value}
      </div>
      {delta && (
        <div className={`text-xs mt-1.5 flex items-center gap-1 overflow-hidden ${
          large             ? 'text-white/85'         :
          deltaTone === 'up'   ? 'text-brand-dark'    :
          deltaTone === 'down' ? 'text-app-danger'    :
          'text-app-text-muted'
        }`}>
          {deltaTone === 'up' ? '↑' : deltaTone === 'down' ? '↓' : ''}
          <span className="truncate">{delta}</span>
        </div>
      )}
    </div>
  );
}
