import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';
import { Surface } from '@/components/ui/surface';
import { compactRp } from '../hooks/useLaporan';
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
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: '8px 12px', fontSize: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div style={{ fontWeight: 600, color: T.text, marginBottom: 4 }}>{label}</div>
      {[...payload].reverse().map((p, i) => p.value > 0 && (
        <div key={i} style={{ color: p.color, marginBottom: 2 }}>{p.name}: {formatRp(p.value)}</div>
      ))}
      <div style={{ fontWeight: 600, color: T.text, marginTop: 4, borderTop: `1px solid ${T.border}`, paddingTop: 4 }}>Total: {formatRp(total)}</div>
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
    <Surface pad={22} style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>{title}</h3>
          <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 3 }}>{periodLabel}</div>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 11.5, color: T.textMuted }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: T.primary, display: 'block' }} /> Suami
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: '#A82672', display: 'block' }} /> Istri
          </span>
          {avgAmount > 0 && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 18, height: 0, borderTop: `1.5px dashed ${T.warning}`, display: 'block' }} /> Rata-rata
            </span>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
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
    </Surface>
  );
}
