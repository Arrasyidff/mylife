import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';
import { compactRp } from '@/lib/format';
import type { Period, ChartBar } from '../types';

function DailyTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + p.value, 0);
  if (!total) return null;
  return (
    <div className="bg-white border border-app-border rounded-lg py-2 px-3 text-xs shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <div className="font-semibold text-app-text mb-1">{label}</div>
      {[...payload].reverse().map((p, i) => p.value > 0 && (
        <div key={i} className="mb-0.5" style={{ color: p.color }}>{p.name}: {formatRp(p.value)}</div>
      ))}
      <div className="font-semibold text-app-text mt-1 pt-1 border-t border-app-border">Total: {formatRp(total)}</div>
    </div>
  );
}

type Props = {
  data: ChartBar[];
  title: string;
  periodLabel: string;
  avgAmount: number;
  maxValue: number;
  period: Period;
};

export function SpendingBarChart({ data, title, periodLabel, avgAmount, maxValue, period }: Props) {
  function tickFmt(v: string | number): string {
    if (period === 1) return [1, 5, 10, 15, 20, 25, 30].includes(Number(v)) ? String(v) : '';
    return String(v);
  }

  return (
    <div className="bg-white border border-app-border rounded-xl p-4 md:p-5.5 mb-4.5">
      <div className="flex flex-col gap-2.5 mb-4 md:flex-row md:items-baseline md:justify-between md:mb-4.5">
        <div>
          <h3 className="m-0 text-[15px] font-bold text-app-text">{title}</h3>
          <div className="text-xs text-app-text-subtle mt-0.75">{periodLabel}</div>
        </div>
        <div className="flex flex-wrap gap-3 md:gap-4 text-[11.5px] text-app-text-muted">
          <span className="inline-flex items-center gap-1.25">
            <span className="w-2.5 h-2.5 rounded-xs bg-brand block" /> Suami
          </span>
          <span className="inline-flex items-center gap-1.25">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#A82672] block" /> Istri
          </span>
          {avgAmount > 0 && (
            <span className="inline-flex items-center gap-1.25">
              <span className="w-4.5 h-0 block" style={{ borderTop: `1.5px dashed ${T.warning}` }} /> Rata-rata
            </span>
          )}
        </div>
      </div>

      <div className="h-40 md:h-50">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="20%" barGap={0} margin={{ top: 4, right: 40, bottom: 0, left: 0 }}>
            <XAxis dataKey="key" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: T.textSubtle }} tickFormatter={tickFmt} />
            <YAxis hide domain={[0, maxValue * 1.15]} />
            <Tooltip content={<DailyTooltip />} cursor={{ fill: T.surfaceAlt }} />
            {avgAmount > 0 && (
              <ReferenceLine y={avgAmount} stroke={T.warning} strokeDasharray="4 3" strokeWidth={1.5}
                label={{ value: compactRp(avgAmount), position: 'right', fontSize: 10, fill: T.warning, fontWeight: 600 }} />
            )}
            <Bar dataKey="istri" name="Istri"  stackId="a" fill="#A82672" opacity={0.85} />
            <Bar dataKey="suami" name="Suami" stackId="a" fill={T.primary} opacity={0.85} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
