"use client";
import { useState, useMemo } from 'react';
import { transactions, budgets } from '@/lib/dashboard-data';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';
import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';
import { Surface } from '@/components/ui/surface';
import { Pill } from '@/components/ui/pill';
import { UserBadge } from '@/components/dashboard/user-badge';

// ── Constants ───────────────────────────────────────────────────
const TODAY = new Date(2026, 3, 27);
const PERIODS = ['Mingguan', 'Bulanan', 'Tahunan'] as const;
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const MONTH_FULL  = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const DAY_SHORT   = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];

const CAT_COLORS: Record<string, string> = {
  food: '#C24A1B', transport: '#1E5BB8', shopping: '#7036A6',
  bills: '#A66A0E', health: '#C0392B', home: '#5C815B', fun: '#A82672', edu: '#2E7D32',
};
const CAT_LABEL: Record<string, string> = {
  food: 'Makanan', transport: 'Transportasi', shopping: 'Belanja',
  bills: 'Tagihan', health: 'Kesehatan', home: 'Rumah', fun: 'Hiburan', edu: 'Pendidikan',
};

type MonthRow = { m: string; income: number; expense: number; idx: number };
const MONTH_HISTORY: MonthRow[] = [
  { m: 'Feb 2026', income: 14_200_000, expense: 8_950_000,  idx: 1 },
  { m: 'Mar 2026', income: 14_500_000, expense: 10_120_000, idx: 2 },
];

// ── Helpers ─────────────────────────────────────────────────────
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function compactRp(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}jt`;
  if (amount >= 1_000)     return `${Math.round(amount / 1_000)}k`;
  return `Rp ${amount}`;
}

// ── Tooltips ────────────────────────────────────────────────────
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

// ── Page ────────────────────────────────────────────────────────
export default function LaporanPage() {
  const [period,    setPeriod]    = useState(1);      // 0=Mingguan 1=Bulanan 2=Tahunan
  const [viewMonth, setViewMonth] = useState(TODAY.getMonth()); // 0-indexed; only used in Bulanan mode

  // ── Filtered expense transactions ────────────────────────────
  const { periodExpenses, periodLabel, btnLabel } = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');

    if (period === 0) {
      const start = new Date(TODAY); start.setDate(TODAY.getDate() - 6); start.setHours(0, 0, 0, 0);
      const end   = new Date(TODAY); end.setHours(23, 59, 59, 999);
      return {
        periodExpenses: expenses.filter(t => { const d = new Date(t.date); return d >= start && d <= end; }),
        periodLabel: `${start.getDate()}–${TODAY.getDate()} Apr 2026`,
        btnLabel: `${start.getDate()}–${TODAY.getDate()} Apr`,
      };
    }

    if (period === 1) {
      const isCurrentMonth = viewMonth === TODAY.getMonth();
      const daysInMonth    = new Date(2026, viewMonth + 1, 0).getDate();
      const lastDay        = isCurrentMonth ? TODAY.getDate() : daysInMonth;
      return {
        periodExpenses: expenses.filter(t => {
          const d = new Date(t.date);
          return d.getFullYear() === 2026 && d.getMonth() === viewMonth;
        }),
        periodLabel: `1–${lastDay} ${MONTH_FULL[viewMonth]} 2026`,
        btnLabel: `${MONTH_SHORT[viewMonth]} 2026`,
      };
    }

    return {
      periodExpenses: expenses.filter(t => new Date(t.date).getFullYear() === 2026),
      periodLabel: 'Januari – April 2026',
      btnLabel: 'Tahun 2026',
    };
  }, [period, viewMonth]);

  // ── Category breakdown ───────────────────────────────────────
  const catBreakdown = useMemo(() => {
    if (period === 1 && viewMonth === TODAY.getMonth()) {
      return budgets.filter(b => b.used > 0).sort((a, b) => b.used - a.used)
        .map(b => ({ name: b.name, value: b.used, cat: b.cat, color: CAT_COLORS[b.cat] ?? '#888' }));
    }
    const map: Record<string, number> = {};
    for (const tx of periodExpenses) map[tx.cat] = (map[tx.cat] ?? 0) + Math.abs(tx.amount);
    return Object.entries(map).sort((a, b) => b[1] - a[1])
      .map(([cat, value]) => ({ name: CAT_LABEL[cat] ?? cat, value, cat, color: CAT_COLORS[cat] ?? '#888' }));
  }, [period, viewMonth, periodExpenses]);

  const totalCat = catBreakdown.reduce((s, c) => s + c.value, 0);

  // ── H/W per category ─────────────────────────────────────────
  const hwData = useMemo(() => {
    const map: Record<string, { h: number; w: number }> = {};
    for (const tx of periodExpenses) {
      if (!map[tx.cat]) map[tx.cat] = { h: 0, w: 0 };
      const amt = Math.abs(tx.amount);
      if (tx.user === 'H') map[tx.cat].h += amt; else map[tx.cat].w += amt;
    }
    return Object.entries(map)
      .map(([cat, v]) => ({ cat: CAT_LABEL[cat] ?? cat, h: v.h, w: v.w }))
      .sort((a, b) => (b.h + b.w) - (a.h + a.w)).slice(0, 5);
  }, [periodExpenses]);

  const hTotal = periodExpenses.filter(t => t.user === 'H').reduce((s, t) => s + Math.abs(t.amount), 0);
  const wTotal = periodExpenses.filter(t => t.user === 'W').reduce((s, t) => s + Math.abs(t.amount), 0);

  // ── Bar chart data ───────────────────────────────────────────
  const { chartData, chartTitle, avgAmount } = useMemo(() => {
    if (period === 0) {
      const start = new Date(TODAY); start.setDate(TODAY.getDate() - 6); start.setHours(0, 0, 0, 0);
      const data = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(start); date.setDate(start.getDate() + i);
        const dayTx = periodExpenses.filter(t => isSameDay(new Date(t.date), date));
        return {
          key: `${DAY_SHORT[date.getDay()]} ${date.getDate()}`,
          suami: dayTx.filter(t => t.user === 'H').reduce((s, t) => s + Math.abs(t.amount), 0),
          istri: dayTx.filter(t => t.user === 'W').reduce((s, t) => s + Math.abs(t.amount), 0),
        };
      });
      const total = data.reduce((s, d) => s + d.suami + d.istri, 0);
      return { chartData: data, chartTitle: 'Pengeluaran 7 Hari Terakhir', avgAmount: Math.round(total / 7) };
    }

    if (period === 1) {
      const daysInMonth = new Date(2026, viewMonth + 1, 0).getDate();
      const data = Array.from({ length: daysInMonth }, (_, i) => {
        const date  = new Date(2026, viewMonth, i + 1);
        const dayTx = periodExpenses.filter(t => isSameDay(new Date(t.date), date));
        return {
          key: String(i + 1),
          suami: dayTx.filter(t => t.user === 'H').reduce((s, t) => s + Math.abs(t.amount), 0),
          istri: dayTx.filter(t => t.user === 'W').reduce((s, t) => s + Math.abs(t.amount), 0),
        };
      });
      const divisor = viewMonth === TODAY.getMonth() ? TODAY.getDate() : daysInMonth;
      const total   = data.reduce((s, d) => s + d.suami + d.istri, 0);
      return { chartData: data, chartTitle: 'Pengeluaran Harian', avgAmount: Math.round(total / divisor) };
    }

    const data = MONTH_SHORT.map((label, i) => {
      const monthTx = periodExpenses.filter(t => new Date(t.date).getMonth() === i);
      return {
        key: label,
        suami: monthTx.filter(t => t.user === 'H').reduce((s, t) => s + Math.abs(t.amount), 0),
        istri: monthTx.filter(t => t.user === 'W').reduce((s, t) => s + Math.abs(t.amount), 0),
      };
    });
    const total = data.reduce((s, d) => s + d.suami + d.istri, 0);
    return { chartData: data, chartTitle: 'Pengeluaran per Bulan', avgAmount: Math.round(total / 12) };
  }, [period, viewMonth, periodExpenses]);

  const maxChart = Math.max(...chartData.map(d => d.suami + d.istri), 1);

  // ── Top stats ────────────────────────────────────────────────
  const topStats = useMemo(() => {
    const topCat     = catBreakdown[0];
    const biggestTx  = [...periodExpenses].sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))[0];
    const biggestDate = biggestTx ? new Date(biggestTx.date) : null;
    const daysInMonth = new Date(2026, viewMonth + 1, 0).getDate();
    const daysRange   = period === 0 ? 7 : period === 1
      ? (viewMonth === TODAY.getMonth() ? TODAY.getDate() : daysInMonth)
      : 365;
    const spendingDays = new Set(periodExpenses.map(t => t.date.split('T')[0])).size;
    return [
      { label: 'KATEGORI TERATAS',    value: topCat?.name ?? '—',       sub: topCat ? formatRp(topCat.value) : '—',   tone: T.text },
      {
        label: 'PENGELUARAN TERBESAR', value: biggestTx ? formatRp(Math.abs(biggestTx.amount)) : '—',
        sub: biggestTx && biggestDate ? `${biggestTx.merch} · ${biggestDate.getDate()} ${MONTH_SHORT[biggestDate.getMonth()]}` : '—',
        tone: T.danger,
      },
      { label: 'RATA-RATA HARIAN',     value: formatRp(avgAmount),        sub: period === 1 && viewMonth === 2 ? '−12% vs Maret' : 'per hari', tone: T.text },
      { label: 'HARI TANPA SPENDING',  value: `${daysRange - spendingDays} hari`, sub: `dari ${daysRange} hari`, tone: T.primaryDark },
    ];
  }, [catBreakdown, periodExpenses, avgAmount, period, viewMonth]);

  // ── Month comparison rows (Bulanan only) ─────────────────────
  const monthRows = useMemo((): MonthRow[] => {
    const aprilIncome  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const aprilExpense = budgets.reduce((s, b) => s + b.used, 0);
    return [...MONTH_HISTORY, { m: 'Apr 2026', income: aprilIncome, expense: aprilExpense, idx: 3 }];
  }, []);

  // ── Axis tick formatter ──────────────────────────────────────
  const tickFmt = (v: string | number): string => {
    if (period === 1) return [1, 5, 10, 15, 20, 25, 30].includes(Number(v)) ? String(v) : '';
    return String(v);
  };

  function gotoMonth(m: MonthRow) {
    setViewMonth(m.idx);
    setPeriod(1);
  }

  return (
    <div style={{ fontFamily: T.fontSans }}>

      {/* Period toggle + actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, marginBottom: 22 }}>
        <div style={{ display: 'inline-flex', padding: 3, background: T.surfaceAlt, borderRadius: 9, border: `1px solid ${T.border}` }}>
          {PERIODS.map((p, i) => {
            const active = i === period;
            return (
              <button key={p} onClick={() => setPeriod(i)} style={{
                padding: '6px 14px', borderRadius: 7, border: 'none',
                background: active ? T.surface : 'transparent',
                color: active ? T.text : T.textMuted,
                fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: T.fontSans,
                boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                transition: 'background 0.12s, color 0.12s',
              }}>
                {p}
              </button>
            );
          })}
        </div>
        <Btn kind="ghost" size="sm" icon={Icon.calendar(14)}>{btnLabel}</Btn>
      </div>

      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        {topStats.map((s, i) => (
          <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius.lg, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: 0.4 }}>{s.label}</div>
            <div style={{ fontSize: 19, fontWeight: 700, marginTop: 6, color: s.tone, letterSpacing: -0.4, fontVariantNumeric: 'tabular-nums' }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11.5, color: T.textSubtle, marginTop: 3 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <Surface pad={22} style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>{chartTitle}</h3>
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
          <BarChart data={chartData} barCategoryGap="20%" barGap={0} margin={{ top: 4, right: 40, bottom: 0, left: 0 }}>
            <XAxis dataKey="key" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: T.textSubtle }} tickFormatter={tickFmt} />
            <YAxis hide domain={[0, maxChart * 1.15]} />
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

      {/* Donut + H/W */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 18, marginBottom: 18 }}>

        {/* Donut */}
        <Surface pad={22}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>Berdasarkan Kategori</h3>
          <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 3, marginBottom: 16 }}>Total {formatRp(totalCat)}</div>
          {catBreakdown.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
              <div style={{ position: 'relative', width: 150, height: 150, flexShrink: 0 }}>
                <PieChart width={150} height={150}>
                  <Pie data={catBreakdown} cx={75} cy={75} innerRadius={42} outerRadius={64}
                    dataKey="value" strokeWidth={0} startAngle={90} endAngle={-270} paddingAngle={3} cornerRadius={4}>
                    {catBreakdown.map((c, i) => <Cell key={i} fill={c.color} opacity={0.92} />)}
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
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 150, color: T.textSubtle, fontSize: 13 }}>
              Tidak ada data untuk periode ini
            </div>
          )}
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
          {hwData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={hwData} layout="vertical" barCategoryGap="30%" margin={{ top: 0, right: 12, bottom: 0, left: 0 }}>
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
      </div>

      {/* Month comparison — Bulanan only */}
      {period === 1 && (
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
              {monthRows.map((m, i) => {
                const isViewing = m.idx === viewMonth;
                const isToday   = m.idx === TODAY.getMonth();
                const net       = m.income - m.expense;
                const savings   = Math.round((net / m.income) * 100);
                const bdColor   = i < monthRows.length - 1 ? `1px solid ${T.divider}` : 'none';
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
      )}
    </div>
  );
}
