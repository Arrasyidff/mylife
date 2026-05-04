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
    <div className="bg-white border border-[#E0EAE6] rounded-xl overflow-hidden">
      <div className="px-5.5 py-4.5 border-b border-[#EEF2F0]">
        <h3 className="m-0 text-[15px] font-bold text-[#1A2420]">Perbandingan Bulan</h3>
        <div className="text-xs text-[#A4B8B2] mt-0.75">3 bulan terakhir</div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#F6F9F7]">
            {['Bulan', 'Pemasukan', 'Pengeluaran', 'Net', 'Tabungan', ''].map((h, i) => (
              <th key={i} className={`py-2.5 px-5.5 text-[11px] font-semibold text-[#7D9590] tracking-[0.3px] border-b border-[#EEF2F0] ${i === 0 ? 'text-left' : 'text-right'}`}>
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
                <td className={`py-3.5 px-5.5 ${!isLast ? 'border-b border-[#EEF2F0]' : ''}`}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[13.5px] font-semibold text-[#1A2420]">{m.m}</span>
                    {isToday && <Pill tone="success" size="sm">Berjalan</Pill>}
                  </div>
                </td>
                <td className={`py-3.5 px-5.5 text-right tabular-nums text-[13px] font-semibold text-[#15735A] ${!isLast ? 'border-b border-[#EEF2F0]' : ''}`}>
                  {formatRp(m.income)}
                </td>
                <td className={`py-3.5 px-5.5 text-right tabular-nums text-[13px] font-semibold text-[#C0392B] ${!isLast ? 'border-b border-[#EEF2F0]' : ''}`}>
                  {formatRp(m.expense)}
                </td>
                <td className={`py-3.5 px-5.5 text-right tabular-nums text-[13px] font-bold text-[#1A2420] ${!isLast ? 'border-b border-[#EEF2F0]' : ''}`}>
                  {formatRp(net)}
                </td>
                <td className={`py-3.5 px-5.5 text-right ${!isLast ? 'border-b border-[#EEF2F0]' : ''}`}>
                  <div className="inline-flex items-center gap-2">
                    <div className="w-17.5 h-1.5 rounded-[3px] bg-[#E8E9E4] overflow-hidden">
                      <div className="h-full rounded-[3px] bg-[#1D9E75]" style={{ width: `${Math.max(0, Math.min(100, savings))}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-[#1A2420] tabular-nums min-w-7">
                      {savings}%
                    </span>
                  </div>
                </td>
                <td className={`py-3.5 px-5.5 text-right ${!isLast ? 'border-b border-[#EEF2F0]' : ''}`}>
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
  );
}
