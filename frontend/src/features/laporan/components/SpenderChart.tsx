import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';
import { UserBadge } from '@/components/shared/UserBadge';
import type { HWDataItem } from '../types';

function HWTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-app-border rounded-lg py-2 px-3 text-xs shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <div className="font-semibold text-app-text mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="mb-0.5" style={{ color: p.color }}>{p.name}: {formatRp(p.value)}</div>
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
    <div className="bg-white border border-app-border rounded-xl p-4 md:p-5.5">
      <div className="flex flex-col gap-2.5 mb-4 lg:flex-row lg:items-start lg:justify-between lg:mb-4.5">
        <div>
          <h3 className="m-0 text-[15px] lg:text-[17px] font-bold text-app-text">Suami vs Istri</h3>
          <div className="text-xs text-app-text-subtle mt-0.75">Pengeluaran berdasarkan kategori</div>
        </div>
        <div className="grid grid-cols-2 w-full gap-2 lg:flex lg:w-auto lg:gap-4.5 lg:items-start">
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <UserBadge user="H" size={20} />
              <span className="text-[11px] text-app-text-muted">Suami</span>
            </div>
            <div className="text-[15px] lg:text-[17px] font-bold mt-1 tabular-nums text-app-text">
              {formatRp(hTotal)}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <UserBadge user="W" size={20} />
              <span className="text-[11px] text-app-text-muted">Istri</span>
            </div>
            <div className="text-[15px] lg:text-[17px] font-bold mt-1 tabular-nums text-app-text">
              {formatRp(wTotal)}
            </div>
          </div>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="h-40 md:h-50">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" barCategoryGap="30%" margin={{ top: 0, right: 12, bottom: 0, left: 0 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="cat" width={82} tickLine={false} axisLine={false}
                tick={{ fontSize: 12, fill: T.textMuted, fontWeight: 500 }} />
              <Tooltip content={<HWTooltip />} cursor={{ fill: T.surfaceAlt }} />
              <Bar dataKey="h" name="Suami" fill={T.primary}  opacity={0.85} radius={[0, 3, 3, 0]} />
              <Bar dataKey="w" name="Istri"  fill="#A82672" opacity={0.85} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center h-40 md:h-50 text-app-text-subtle text-[13px]">
          Tidak ada data untuk periode ini
        </div>
      )}
    </div>
  );
}
