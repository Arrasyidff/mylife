import { PieChart, Pie, Cell } from 'recharts';
import { formatRp } from '@/lib/format';
import { compactRp } from '../hooks/useLaporan';
import type { CatBreakdownItem } from '../types';

type Props = {
  breakdown: CatBreakdownItem[];
  totalCat: number;
};

export function CategoryDonut({ breakdown, totalCat }: Props) {
  return (
    <div className="bg-white border border-app-border rounded-xl p-4 md:p-5.5">
      <h3 className="m-0 text-[15px] font-bold text-app-text">Berdasarkan Kategori</h3>
      <div className="text-xs text-app-text-subtle mt-0.75 mb-4">{formatRp(totalCat)}</div>

      {breakdown.length > 0 ? (
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-5.5">
          <div className="relative w-37.5 h-37.5 shrink-0">
            <PieChart width={150} height={150}>
              <Pie data={breakdown} cx={75} cy={75} innerRadius={42} outerRadius={64}
                dataKey="value" strokeWidth={0} startAngle={90} endAngle={-270} paddingAngle={3} cornerRadius={4}>
                {breakdown.map((c, i) => <Cell key={i} fill={c.color} opacity={0.92} />)}
              </Pie>
            </PieChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-[10.5px] text-app-text-muted font-semibold tracking-[0.3px]">TOTAL</div>
              <div className="text-[13.5px] font-bold text-app-text mt-px tabular-nums">
                {compactRp(totalCat)}
              </div>
            </div>
          </div>

          <div className="w-full min-w-0 flex flex-col gap-1.75">
            {breakdown.map((c, i) => {
              const pct = Math.round((c.value / totalCat) * 100);
              return (
                <div key={i} className="flex items-center gap-2 text-[12.5px]">
                  <span className="w-2.25 h-2.25 rounded-xs shrink-0 block" style={{ background: c.color }} />
                  <span className="flex-1 min-w-0 truncate text-app-text font-medium">{c.name}</span>
                  <span className="text-app-text-muted tabular-nums min-w-7 text-right">{pct}%</span>
                  <span className="text-app-text-muted tabular-nums min-w-17.5 text-right text-[11.5px]">
                    {formatRp(c.value)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-37.5 text-app-text-subtle text-[13px]">
          Tidak ada data untuk periode ini
        </div>
      )}
    </div>
  );
}
