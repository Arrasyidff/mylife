import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';
import { Surface } from '@/components/ui/surface';
import { UserBadge } from '@/components/dashboard/user-badge';
import type { HWDataItem } from '../types';

function HWTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: '8px 12px', fontSize: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div style={{ fontWeight: 600, color: T.text, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 2 }}>{p.name}: {formatRp(p.value)}</div>
      ))}
    </div>
  );
}

type Props = {
  data: HWDataItem[];
  hTotal: number;
  wTotal: number;
};

export function SpenderChart({ data, hTotal, wTotal }: Props) {
  return (
    <Surface pad={22}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>Suami vs Istri</h3>
          <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 3 }}>Pengeluaran berdasarkan kategori</div>
        </div>
        <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
              <UserBadge user="H" size={20} />
              <span style={{ fontSize: 11, color: T.textMuted }}>Suami</span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4, fontVariantNumeric: 'tabular-nums', color: T.text }}>
              {formatRp(hTotal)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
              <UserBadge user="W" size={20} />
              <span style={{ fontSize: 11, color: T.textMuted }}>Istri</span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4, fontVariantNumeric: 'tabular-nums', color: T.text }}>
              {formatRp(wTotal)}
            </div>
          </div>
        </div>
      </div>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} layout="vertical" barCategoryGap="30%" margin={{ top: 0, right: 12, bottom: 0, left: 0 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="cat" width={82} tickLine={false} axisLine={false}
              tick={{ fontSize: 12, fill: T.textMuted, fontWeight: 500 }} />
            <Tooltip content={<HWTooltip />} cursor={{ fill: T.surfaceAlt }} />
            <Bar dataKey="h" name="Suami" fill={T.primary}  opacity={0.85} radius={[0, 3, 3, 0]} />
            <Bar dataKey="w" name="Istri"  fill="#A82672" opacity={0.85} radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: T.textSubtle, fontSize: 13 }}>
          Tidak ada data untuk periode ini
        </div>
      )}
    </Surface>
  );
}
