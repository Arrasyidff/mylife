"use client";
import { useState } from 'react';
import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';
import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';
import { Surface } from '@/components/ui/surface';
import { Pill } from '@/components/ui/pill';
import { UserBadge } from '@/components/dashboard/user-badge';

// ── Data ───────────────────────────────────────────────────────
const daily = [
  180, 320,  95,   0, 410, 280, 215, 380, 120,   0,
  520, 285, 195, 340, 410,  90, 235, 605, 175, 320,
  280, 425, 180, 310, 245,
]; // thousands

type CatRow = { name: string; value: number; cat: string; color: string };
const catBreakdown: CatRow[] = [
  { name: 'Tagihan',   value: 2_950_000, cat: 'bills',     color: '#A66A0E' },
  { name: 'Makanan',   value: 2_180_000, cat: 'food',      color: '#C24A1B' },
  { name: 'Belanja',   value: 1_870_000, cat: 'shopping',  color: '#7036A6' },
  { name: 'Transport', value: 1_465_000, cat: 'transport', color: '#1E5BB8' },
  { name: 'Hiburan',   value:   615_000, cat: 'fun',       color: '#A82672' },
  { name: 'Lainnya',   value:   332_500, cat: 'home',      color: '#5C815B' },
];

type HWRow = { cat: string; h: number; w: number };
const hwData: HWRow[] = [
  { cat: 'Makanan',   h: 1_120_000, w: 1_060_000 },
  { cat: 'Transport', h:   980_000, w:   485_000  },
  { cat: 'Belanja',   h:   245_000, w: 1_625_000  },
  { cat: 'Tagihan',   h: 2_180_000, w:   770_000  },
  { cat: 'Hiburan',   h:   430_000, w:   185_000  },
];

type MonthRow = { m: string; income: number; expense: number; current?: boolean };
const months: MonthRow[] = [
  { m: 'Feb', income: 14_200_000, expense:  8_950_000 },
  { m: 'Mar', income: 14_500_000, expense: 10_120_000 },
  { m: 'Apr', income: 14_750_000, expense:  9_412_500, current: true },
];

const PERIODS = ['Mingguan', 'Bulanan', 'Tahunan'];

// ── Donut math ─────────────────────────────────────────────────
function buildDonut(items: CatRow[]) {
  const total = items.reduce((s, c) => s + c.value, 0);
  const r = 60, cx = 75, cy = 75;
  let acc = 0;
  return items.map(c => {
    const frac  = c.value / total;
    const start = acc * 2 * Math.PI - Math.PI / 2;
    acc += frac;
    const end   = acc * 2 * Math.PI - Math.PI / 2;
    const large = frac > 0.5 ? 1 : 0;
    const x1 = (cx + r * Math.cos(start)).toFixed(2);
    const y1 = (cy + r * Math.sin(start)).toFixed(2);
    const x2 = (cx + r * Math.cos(end)).toFixed(2);
    const y2 = (cy + r * Math.sin(end)).toFixed(2);
    return {
      ...c,
      frac,
      path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`,
    };
  });
}

// ── Page ───────────────────────────────────────────────────────
export default function LaporanPage() {
  const [period, setPeriod] = useState(1);

  const maxDaily  = Math.max(...daily);
  const totalCat  = catBreakdown.reduce((s, c) => s + c.value, 0);
  const hwMax     = Math.max(...hwData.flatMap(r => [r.h, r.w]));
  const donutData = buildDonut(catBreakdown);
  const avgBottom = (376 / maxDaily) * 100; // avg spending 376k vs max 605k

  const topStats = [
    { label: 'KATEGORI TERATAS',     value: 'Tagihan',         sub: formatRp(2_950_000),    tone: T.text        },
    { label: 'PENGELUARAN TERBESAR', value: formatRp(1_245_000), sub: 'IKEA · 22 Apr',      tone: T.danger      },
    { label: 'RATA-RATA HARIAN',     value: formatRp(376_500), sub: '−12% vs Maret',         tone: T.text        },
    { label: 'HARI TANPA SPENDING',  value: '3 hari',          sub: 'streak terpanjang: 2',  tone: T.primaryDark },
  ];

  return (
    <div style={{ fontFamily: T.fontSans }}>

      {/* Period toggle + actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, marginBottom: 22 }}>
        <div style={{
          display: 'inline-flex',
          padding: 3,
          background: T.surfaceAlt,
          borderRadius: 9,
          border: `1px solid ${T.border}`,
        }}>
          {PERIODS.map((p, i) => {
            const active = i === period;
            return (
              <button
                key={p}
                onClick={() => setPeriod(i)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 7,
                  border: 'none',
                  background: active ? T.surface : 'transparent',
                  color: active ? T.text : T.textMuted,
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: T.fontSans,
                  boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                {p}
              </button>
            );
          })}
        </div>
        <Btn kind="ghost" size="sm" icon={Icon.calendar(14)}>April 2026</Btn>
        <Btn kind="ghost" size="sm" icon={Icon.download(14)}>Ekspor PDF</Btn>
      </div>

      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        {topStats.map((s, i) => (
          <div key={i} style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: T.radius.lg,
            padding: '16px 18px',
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: 0.4 }}>{s.label}</div>
            <div style={{
              fontSize: 19,
              fontWeight: 700,
              marginTop: 6,
              color: s.tone,
              letterSpacing: -0.4,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11.5, color: T.textSubtle, marginTop: 3 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Daily bar chart */}
      <Surface pad={22} style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>Pengeluaran Harian</h3>
            <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 3 }}>1 – 25 April 2026</div>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 11.5, color: T.textMuted }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: T.primary, display: 'block' }} />
              Suami
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: '#A82672', display: 'block' }} />
              Istri
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 18, height: 0, borderTop: `1.5px dashed ${T.warning}`, display: 'block' }} />
              Rata-rata
            </span>
          </div>
        </div>

        <div style={{ position: 'relative', height: 200, display: 'flex', alignItems: 'flex-end', gap: 6, paddingBottom: 20 }}>
          {/* Average dashed line */}
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: `calc(${avgBottom}% + 20px)`,
            borderTop: `1px dashed ${T.warning}`,
            pointerEvents: 'none',
            zIndex: 1,
          }}>
            <span style={{
              position: 'absolute',
              right: 0,
              top: -15,
              fontSize: 10,
              color: T.warning,
              fontWeight: 600,
              background: T.surface,
              padding: '0 4px',
            }}>
              Rp 376k
            </span>
          </div>

          {daily.map((d, i) => {
            const h = maxDaily > 0 ? (d / maxDaily) * 100 : 0;
            const isW     = i % 3 === 0;
            const wH      = isW ? h * 0.6 : h * 0.35;
            const hH      = isW ? h * 0.4 : h * 0.65;
            const isToday = i === daily.length - 1;

            return (
              <div key={i} style={{
                flex: 1,
                height: 'calc(100% - 20px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 1,
                position: 'relative',
              }}>
                {d > 0 ? (
                  <>
                    <div style={{
                      width: '100%',
                      height: `${hH}%`,
                      background: isToday ? T.primaryDark : T.primary,
                      borderRadius: '3px 3px 0 0',
                      opacity: isToday ? 1 : 0.85,
                    }} />
                    <div style={{
                      width: '100%',
                      height: `${wH}%`,
                      background: isToday ? '#7c2052' : '#A82672',
                      opacity: 0.85,
                    }} />
                  </>
                ) : (
                  <div style={{ width: '100%', height: 2, background: T.border }} />
                )}
                {(i === 0 || (i + 1) % 5 === 0) && (
                  <div style={{
                    position: 'absolute',
                    bottom: -18,
                    fontSize: 10,
                    color: T.textSubtle,
                  }}>
                    {i + 1}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Surface>

      {/* Donut + H/W comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 18, marginBottom: 18 }}>

        {/* Donut */}
        <Surface pad={22}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>Berdasarkan Kategori</h3>
          <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 3, marginBottom: 16 }}>
            Total {formatRp(totalCat)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <div style={{ position: 'relative', width: 150, height: 150, flexShrink: 0 }}>
              <svg width="150" height="150" viewBox="0 0 150 150">
                {donutData.map((s, i) => (
                  <path key={i} d={s.path} fill={s.color} opacity="0.92" />
                ))}
                <circle cx="75" cy="75" r="38" fill={T.surface} />
              </svg>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}>
                <div style={{ fontSize: 10.5, color: T.textMuted, fontWeight: 600, letterSpacing: 0.3 }}>TOTAL</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: T.text, marginTop: 1, fontVariantNumeric: 'tabular-nums' }}>
                  9.4 jt
                </div>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {catBreakdown.map((c, i) => {
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
        </Surface>

        {/* H vs W */}
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
                  {formatRp(4_955_000)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                  <UserBadge user="W" size={20} />
                  <span style={{ fontSize: 11, color: T.textMuted }}>Istri</span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4, fontVariantNumeric: 'tabular-nums', color: T.text }}>
                  {formatRp(4_457_500)}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {hwData.map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 1fr', gap: 10, alignItems: 'center' }}>
                <div style={{ fontSize: 12, color: T.textMuted, fontWeight: 500 }}>{row.cat}</div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: T.textSubtle, fontVariantNumeric: 'tabular-nums' }}>
                    {formatRp(row.h)}
                  </span>
                  <div style={{
                    width: `${(row.h / hwMax) * 100}%`,
                    height: 14,
                    background: T.primary,
                    borderRadius: '3px 0 0 3px',
                    minWidth: 2,
                  }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: `${(row.w / hwMax) * 100}%`,
                    height: 14,
                    background: '#A82672',
                    borderRadius: '0 3px 3px 0',
                    minWidth: 2,
                  }} />
                  <span style={{ fontSize: 11, color: T.textSubtle, fontVariantNumeric: 'tabular-nums' }}>
                    {formatRp(row.w)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      {/* Month-over-month table */}
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
                  textAlign: i === 0 ? 'left' : 'right',
                  padding: '10px 22px',
                  fontSize: 11,
                  fontWeight: 600,
                  color: T.textMuted,
                  letterSpacing: 0.3,
                  borderBottom: `1px solid ${T.divider}`,
                }}>
                  {h.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {months.map((m, i) => {
              const net     = m.income - m.expense;
              const savings = Math.round((net / m.income) * 100);
              const bdColor = i < months.length - 1 ? `1px solid ${T.divider}` : 'none';
              return (
                <tr key={i} style={{ background: m.current ? T.primarySoft : 'transparent' }}>
                  <td style={{ padding: '14px 22px', borderBottom: bdColor }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: T.text }}>{m.m} 2026</span>
                      {m.current && <Pill tone="success" size="sm">Berjalan</Pill>}
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
                        <div style={{ width: `${savings}%`, height: '100%', background: T.primary, borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: T.text, fontVariantNumeric: 'tabular-nums', minWidth: 28 }}>
                        {savings}%
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 22px', textAlign: 'right', borderBottom: bdColor }}>
                    <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: T.textSubtle, display: 'flex' }}>
                      {Icon.chev(14, 'right')}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Surface>
    </div>
  );
}
