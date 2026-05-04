import { T } from '@/lib/tokens';
import { Icon } from '@/components/ui/icon';
import { Surface } from '@/components/ui/surface';
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
    <Surface pad={0}>
      <div style={{ padding: '18px 22px', borderBottom: `1px solid ${T.divider}` }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>Perbandingan Bulan</h3>
        <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 3 }}>3 bulan terakhir</div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: T.surfaceAlt }}>
            {['Bulan', 'Pemasukan', 'Pengeluaran', 'Net', 'Tabungan', ''].map((h, i) => (
              <th key={i} style={{
                textAlign: i === 0 ? 'left' : 'right', padding: '10px 22px',
                fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: 0.3,
                borderBottom: `1px solid ${T.divider}`,
              }}>
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
            const bdColor   = i < rows.length - 1 ? `1px solid ${T.divider}` : 'none';
            return (
              <tr key={i} style={{ background: isViewing ? T.primarySoft : 'transparent' }}>
                <td style={{ padding: '14px 22px', borderBottom: bdColor }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: T.text }}>{m.m}</span>
                    {isToday && <Pill tone="success" size="sm">Berjalan</Pill>}
                  </div>
                </td>
                <td style={{ padding: '14px 22px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontSize: 13, color: T.primaryDark, fontWeight: 600, borderBottom: bdColor }}>
                  {formatRp(m.income)}
                </td>
                <td style={{ padding: '14px 22px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontSize: 13, color: T.danger, fontWeight: 600, borderBottom: bdColor }}>
                  {formatRp(m.expense)}
                </td>
                <td style={{ padding: '14px 22px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontSize: 13, fontWeight: 700, color: T.text, borderBottom: bdColor }}>
                  {formatRp(net)}
                </td>
                <td style={{ padding: '14px 22px', textAlign: 'right', borderBottom: bdColor }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 70, height: 6, borderRadius: 3, background: '#E8E9E4', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.max(0, Math.min(100, savings))}%`, height: '100%', background: T.primary, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.text, fontVariantNumeric: 'tabular-nums', minWidth: 28 }}>
                      {savings}%
                    </span>
                  </div>
                </td>
                <td style={{ padding: '14px 22px', textAlign: 'right', borderBottom: bdColor }}>
                  <button
                    onClick={() => gotoMonth(m)}
                    disabled={isViewing}
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 28, height: 28, borderRadius: 7, border: 'none',
                      background: isViewing ? T.primaryLight : T.surfaceAlt,
                      color: isViewing ? T.primary : T.textMuted,
                      cursor: isViewing ? 'default' : 'pointer',
                      transition: 'background 0.12s, color 0.12s',
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
    </Surface>
  );
}
