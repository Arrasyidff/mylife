"use client";
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { CatBubble } from '@/components/shared/CatBubble';
import { formatRp } from '@/lib/format';
import { PERIOD_LABEL } from '../constants';
import type { Budget } from '../types';

interface BudgetCardProps {
  b: Budget;
  onEdit: () => void;
}

export function BudgetCard({ b, onEdit }: BudgetCardProps) {
  const pct       = Math.round((b.used / b.total) * 100);
  const remaining = b.total - b.used;
  const over      = pct >= 100;
  const warn      = pct >= 75 && !over;

  const bgCls     = over ? 'bg-[#FDEEEE]'    : warn ? 'bg-[#FDF1DD]'    : 'bg-white';
  const bdCls     = over ? 'border-[#F0B7B5]' : warn ? 'border-[#F4D7A0]' : 'border-[#E0EAE6]';
  const accentCls = over ? 'text-[#C0392B]'   : warn ? 'text-[#D4860B]'   : 'text-[#1D9E75]';

  return (
    <div className={`${bgCls} border ${bdCls} rounded-[0.75rem] p-[18px] flex flex-col gap-3`}>
      <div className="flex items-center gap-[11px]">
        <CatBubble cat={b.cat} size={38} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <div className="text-sm font-semibold text-[#1A2420]">{b.name}</div>
            {over && (
              <div className="inline-flex items-center gap-[3px] px-1.5 py-[2px] bg-[#C0392B] text-white rounded-full text-[10px] font-bold tracking-[0.3px]">
                {Icon.warn(10)} OVER
              </div>
            )}
          </div>
          <div className="text-[11.5px] text-[#A4B8B2]">
            {PERIOD_LABEL[b.period ?? 'monthly']}
          </div>
        </div>
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1 py-1 px-2 rounded-[6px] border border-[#E0EAE6] bg-white text-[#7D9590] cursor-pointer text-[11.5px] font-semibold font-sans shrink-0"
        >
          {Icon.edit(12)} Edit
        </button>
      </div>

      <div>
        <div className="text-[22px] font-bold text-[#1A2420] tracking-[-0.025rem] tabular-nums">
          {formatRp(b.used)}
        </div>
        <div className="text-[11.5px] text-[#7D9590] mt-0.5 tabular-nums">
          dari {formatRp(b.total)}
        </div>
      </div>

      <ProgressBar pct={pct} height={8} />

      <div className="flex items-center justify-between">
        <span className="text-[11.5px] text-[#7D9590] tabular-nums">
          {over
            ? <span className="text-[#C0392B] font-semibold">Lewat {formatRp(b.used - b.total)}</span>
            : `Sisa ${formatRp(remaining)}`}
        </span>
        <span className={`text-xs font-bold tabular-nums ${accentCls}`}>
          {pct}%
        </span>
      </div>
    </div>
  );
}
