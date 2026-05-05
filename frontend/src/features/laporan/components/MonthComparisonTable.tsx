import { T } from '@/lib/tokens';
import { Icon } from '@/components/ui/icon';
import { Pill } from '@/components/ui/pill';
import { formatRp } from '@/lib/format';
import { TODAY } from '../constants';
import type { MonthRow } from '../types';

type Props = {
  rows: MonthRow[];
  viewMonth: number;
  gotoMonth: (m: MonthRow) => void;
};

export function MonthComparisonTable({ rows, viewMonth, gotoMonth }: Props) {
  return (
    <div className="bg-white border border-app-border rounded-xl overflow-hidden">
      <div className="px-4 py-3.5 md:px-5.5 md:py-4.5 border-b border-app-divider">
        <h3 className="m-0 text-[15px] font-bold text-app-text">Perbandingan Bulan</h3>
        <div className="text-xs text-app-text-subtle mt-0.75">3 bulan terakhir</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-130">
          <thead>
            <tr className="bg-surface-alt">
              {['Bulan', 'Pemasukan', 'Pengeluaran', 'Net', 'Tabungan', ''].map((h, i) => (
                <th key={i} className={`py-2.5 px-5.5 text-[11px] font-semibold text-app-text-muted tracking-[0.3px] border-b border-app-divider ${i === 0 ? 'text-left' : 'text-right'}`}>
                  {h.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((m, i) => {
              const isViewing = m.idx === viewMonth;
              const isToday   = m.idx === TODAY.getMonth();
              const net       = m.income - m.expense;
              const savings   = Math.round((net / m.income) * 100);
              const isLast    = i === rows.length - 1;
              return (
                <tr key={i} style={{ background: isViewing ? T.primarySoft : 'transparent' }}>
                  <td className={`py-3.5 px-5.5 ${!isLast ? 'border-b border-app-divider' : ''}`}>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[13.5px] font-semibold text-app-text">{m.m}</span>
                      {isToday && <Pill tone="success" size="sm">Berjalan</Pill>}
                    </div>
                  </td>
                  <td className={`py-3.5 px-5.5 text-right tabular-nums text-[13px] font-semibold text-brand-dark ${!isLast ? 'border-b border-app-divider' : ''}`}>
                    {formatRp(m.income)}
                  </td>
                  <td className={`py-3.5 px-5.5 text-right tabular-nums text-[13px] font-semibold text-app-danger ${!isLast ? 'border-b border-app-divider' : ''}`}>
                    {formatRp(m.expense)}
                  </td>
                  <td className={`py-3.5 px-5.5 text-right tabular-nums text-[13px] font-bold text-app-text ${!isLast ? 'border-b border-app-divider' : ''}`}>
                    {formatRp(net)}
                  </td>
                  <td className={`py-3.5 px-5.5 text-right ${!isLast ? 'border-b border-app-divider' : ''}`}>
                    <div className="inline-flex items-center gap-2">
                      <div className="w-17.5 h-1.5 rounded-[3px] bg-[#E8E9E4] overflow-hidden">
                        <div className="h-full rounded-[3px] bg-brand" style={{ width: `${Math.max(0, Math.min(100, savings))}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-app-text tabular-nums min-w-7">
                        {savings}%
                      </span>
                    </div>
                  </td>
                  <td className={`py-3.5 px-5.5 text-right ${!isLast ? 'border-b border-app-divider' : ''}`}>
                    <button
                      onClick={() => gotoMonth(m)}
                      disabled={isViewing}
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-[7px] border-none transition-[background,color] duration-120 ${isViewing ? 'cursor-default' : 'cursor-pointer'}`}
                      style={{
                        background: isViewing ? T.primaryLight : T.surfaceAlt,
                        color: isViewing ? T.primary : T.textMuted,
                      }}
                    >
                      {Icon.chev(13, 'right')}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
