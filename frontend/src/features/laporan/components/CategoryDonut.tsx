import { PieChart, Pie, Cell } from 'recharts';
import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';
import { Surface } from '@/components/ui/surface';
import { compactRp } from '../hooks/useLaporan';
import type { CatBreakdownItem } from '../types';

type Props = {
  breakdown: CatBreakdownItem[];
  totalCat: number;
};

export function CategoryDonut({ breakdown, totalCat }: Props) {
  return (
    <Surface pad={22}>
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>Berdasarkan Kategori</h3>
      <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 3, marginBottom: 16 }}>Total {formatRp(totalCat)}</div>

      {breakdown.length > 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <div style={{ position: 'relative', width: 150, height: 150, flexShrink: 0 }}>
            <PieChart width={150} height={150}>
              <Pie data={breakdown} cx={75} cy={75} innerRadius={42} outerRadius={64}
                dataKey="value" strokeWidth={0} startAngle={90} endAngle={-270} paddingAngle={3} cornerRadius={4}>
                {breakdown.map((c, i) => <Cell key={i} fill={c.color} opacity={0.92} />)}
              </Pie>
            </PieChart>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <div style={{ fontSize: 10.5, color: T.textMuted, fontWeight: 600, letterSpacing: 0.3 }}>TOTAL</div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: T.text, marginTop: 1, fontVariantNumeric: 'tabular-nums' }}>
                {compactRp(totalCat)}
              </div>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
            {breakdown.map((c, i) => {
              const pct = Math.round((c.value / totalCat) * 100);
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 2, background: c.color, flexShrink: 0, display: 'block' }} />
                  <span style={{ flex: 1, color: T.text, fontWeight: 500 }}>{c.name}</span>
                  <span style={{ color: T.textMuted, fontVariantNumeric: 'tabular-nums', minWidth: 28, textAlign: 'right' }}>{pct}%</span>
                  <span style={{ color: T.textMuted, fontVariantNumeric: 'tabular-nums', minWidth: 70, textAlign: 'right', fontSize: 11.5 }}>
                    {formatRp(c.value)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 150, color: T.textSubtle, fontSize: 13 }}>
          Tidak ada data untuk periode ini
        </div>
      )}
    </Surface>
  );
}
