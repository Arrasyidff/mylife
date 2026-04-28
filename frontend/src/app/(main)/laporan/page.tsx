"use client";
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { Loader2, XCircle } from 'lucide-react';
import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';
import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';
import { Surface } from '@/components/ui/surface';
import { Pill } from '@/components/ui/pill';
import { UserBadge } from '@/components/dashboard/user-badge';
import {
  reportService,
  type ReportPeriod,
  type ReportSummaryResponse,
  type MonthlyComparisonResponse,
  type MonthRow,
} from '@/lib/services/report';

// ── Constants ───────────────────────────────────────────────────
const PERIODS = ['Mingguan', 'Bulanan', 'Tahunan'] as const;
const PERIOD_TO_BACKEND: Record<number, ReportPeriod> = { 0: 'WEEKLY', 1: 'MONTHLY', 2: 'YEARLY' };
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const MONTH_FULL  = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

const CAT_COLORS: Record<string, string> = {
  food: '#C24A1B', transport: '#1E5BB8', shopping: '#7036A6',
  bills: '#A66A0E', health: '#C0392B', home: '#5C815B', fun: '#A82672', edu: '#2E7D32',
  salary: '#2E7D32',
};
const CAT_LABEL: Record<string, string> = {
  food: 'Makanan', transport: 'Transportasi', shopping: 'Belanja',
  bills: 'Tagihan', health: 'Kesehatan', home: 'Rumah', fun: 'Hiburan', edu: 'Pendidikan',
  salary: 'Gaji',
};

const FALLBACK_COLORS = ['#1E5BB8', '#A82672', '#5C815B', '#A66A0E', '#7036A6', '#C24A1B', '#C0392B', '#2E7D32'];

function colorForCat(cat: string, idx: number): string {
  return CAT_COLORS[cat] ?? FALLBACK_COLORS[idx % FALLBACK_COLORS.length] ?? '#888';
}

function labelForCat(cat: string): string {
  return CAT_LABEL[cat] ?? cat.charAt(0).toUpperCase() + cat.slice(1);
}

// ── Helpers ─────────────────────────────────────────────────────
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
  const TODAY = useMemo(() => new Date(), []);

  const [period,     setPeriod]    = useState(1);      // 0=Mingguan 1=Bulanan 2=Tahunan
  const [viewMonth,  setViewMonth] = useState(TODAY.getMonth());
  const [viewYear,   setViewYear]  = useState(TODAY.getFullYear());
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const [summary,    setSummary]    = useState<ReportSummaryResponse | null>(null);
  const [comparison, setComparison] = useState<MonthlyComparisonResponse | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  useEffect(() => {
    if (!pickerOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [pickerOpen]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const backendPeriod = PERIOD_TO_BACKEND[period] ?? 'MONTHLY';
      const summaryParams = {
        period: backendPeriod,
        ...(backendPeriod !== 'WEEKLY' ? { year: viewYear } : {}),
        ...(backendPeriod === 'MONTHLY' ? { month: viewMonth + 1 } : {}),
      };
      const comparisonParams = backendPeriod === 'MONTHLY'
        ? { months: 3, year: viewYear, month: viewMonth + 1 }
        : null;

      const [summaryData, comparisonData] = await Promise.all([
        reportService.summary(summaryParams),
        comparisonParams
          ? reportService.monthlyComparison(comparisonParams)
          : Promise.resolve(null),
      ]);
      setSummary(summaryData);
      setComparison(comparisonData);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat laporan');
    } finally {
      setLoading(false);
    }
  }, [period, viewMonth, viewYear]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Derived display values ───────────────────────────────────
  const periodLabel = useMemo(() => {
    if (!summary) return '';
    if (period === 0) {
      const start = new Date(summary.date_from);
      const end   = new Date(summary.date_to);
      return `${start.getDate()}–${end.getDate()} ${MONTH_SHORT[end.getMonth()]} ${end.getFullYear()}`;
    }
    if (period === 1) {
      const end = new Date(summary.date_to);
      return `1–${end.getDate()} ${MONTH_FULL[viewMonth]} ${viewYear}`;
    }
    return `Januari – Desember ${viewYear}`;
  }, [summary, period, viewMonth, viewYear]);

  const btnLabel = useMemo(() => {
    if (period === 0 && summary) {
      const start = new Date(summary.date_from);
      const end   = new Date(summary.date_to);
      return `${start.getDate()}–${end.getDate()} ${MONTH_SHORT[end.getMonth()]}`;
    }
    if (period === 1) return `${MONTH_SHORT[viewMonth]} ${viewYear}`;
    return `Tahun ${viewYear}`;
  }, [period, viewMonth, viewYear, summary]);

  const chartTitle = period === 0
    ? 'Pengeluaran 7 Hari Terakhir'
    : period === 1
      ? 'Pengeluaran Harian'
      : 'Pengeluaran per Bulan';

  const chartData = summary?.chart_data ?? [];
  const avgAmount = summary ? Math.round(parseFloat(summary.avg_daily_expense)) : 0;
  const maxChart  = Math.max(...chartData.map(d => d.suami + d.istri), 1);

  const catBreakdown = useMemo(() => {
    if (!summary) return [] as { name: string; value: number; cat: string; color: string }[];
    return summary.categories
      .map((c, i) => ({
        name: labelForCat(c.category),
        value: parseFloat(c.total),
        cat: c.category,
        color: colorForCat(c.category, i),
      }))
      .filter(c => c.value > 0);
  }, [summary]);

  const totalCat = catBreakdown.reduce((s, c) => s + c.value, 0);

  const hwData = useMemo(() => {
    if (!summary) return [] as { cat: string; h: number; w: number }[];
    return summary.categories
      .map(c => ({
        cat: labelForCat(c.category),
        h: parseFloat(c.suami),
        w: parseFloat(c.istri),
      }))
      .sort((a, b) => (b.h + b.w) - (a.h + a.w))
      .slice(0, 5);
  }, [summary]);

  const hTotal = summary ? parseFloat(summary.by_recorder.SUAMI) : 0;
  const wTotal = summary ? parseFloat(summary.by_recorder.ISTRI) : 0;

  // ── Top stats ────────────────────────────────────────────────
  const topStats = useMemo(() => {
    if (!summary) return [];
    const topCat = summary.top_category;
    const big    = summary.biggest_transaction;
    const bigDate = big ? new Date(big.date) : null;
    return [
      {
        label: 'KATEGORI TERATAS',
        value: topCat ? labelForCat(topCat.category) : '—',
        sub:   topCat ? formatRp(parseFloat(topCat.total)) : '—',
        tone:  T.text,
      },
      {
        label: 'PENGELUARAN TERBESAR',
        value: big ? formatRp(parseFloat(big.amount)) : '—',
        sub:   big && bigDate
          ? `${big.merchant} · ${bigDate.getDate()} ${MONTH_SHORT[bigDate.getMonth()]}`
          : '—',
        tone:  T.danger,
      },
      {
        label: 'RATA-RATA HARIAN',
        value: formatRp(avgAmount),
        sub:   'per hari',
        tone:  T.text,
      },
      {
        label: 'HARI TANPA SPENDING',
        value: `${summary.days_without_spending} hari`,
        sub:   `dari ${summary.total_days} hari`,
        tone:  T.primaryDark,
      },
    ];
  }, [summary, avgAmount]);

  const monthRows: MonthRow[] = comparison?.months ?? [];

  // ── Axis tick formatter ──────────────────────────────────────
  const tickFmt = (v: string | number): string => {
    if (period === 1) return [1, 5, 10, 15, 20, 25, 30].includes(Number(v)) ? String(v) : '';
    return String(v);
  };

  function gotoMonth(m: MonthRow) {
    setViewYear(m.year);
    setViewMonth(m.month - 1);
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
        <div ref={pickerRef} style={{ position: 'relative' }}>
          <Btn
            kind="ghost" size="sm" icon={Icon.calendar(14)}
            onClick={() => setPickerOpen(o => !o)}
            style={{ userSelect: 'none' }}
          >
            {btnLabel}
          </Btn>
          {pickerOpen && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 6px)', zIndex: 200,
              background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10,
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)', padding: 14, width: 220,
            }}>
              {/* Year navigation */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: period === 1 ? 12 : 0 }}>
                <button
                  onClick={() => setViewYear(y => y - 1)}
                  style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${T.border}`, background: T.surfaceAlt, color: T.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {Icon.chev(12, 'left')}
                </button>
                <span style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{viewYear}</span>
                <button
                  onClick={() => setViewYear(y => y + 1)}
                  style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${T.border}`, background: T.surfaceAlt, color: T.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {Icon.chev(12, 'right')}
                </button>
              </div>
              {/* Month grid — only in Bulanan mode */}
              {period === 1 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5 }}>
                  {MONTH_SHORT.map((m, i) => {
                    const isCurrent = i === TODAY.getMonth() && viewYear === TODAY.getFullYear();
                    return (
                      <button
                        key={i}
                        onClick={() => { setViewMonth(i); setPickerOpen(false); }}
                        style={{
                          padding: '7px 4px', borderRadius: 7, border: 'none', fontSize: 12.5, fontWeight: 600,
                          background: i === viewMonth ? T.primaryLight : 'transparent',
                          color: i === viewMonth ? T.primaryDark : isCurrent ? T.primary : T.text,
                          cursor: 'pointer', fontFamily: T.fontSans,
                          outline: isCurrent && i !== viewMonth ? `1.5px solid ${T.primaryLight}` : 'none',
                        }}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div style={{
          background: T.dangerLight, border: `1px solid ${T.danger}33`,
          borderRadius: T.radius.lg, padding: '16px 20px',
          marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <XCircle size={18} color={T.danger} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: T.danger }}>{error}</div>
          </div>
          <button
            onClick={fetchData}
            style={{
              padding: '6px 14px', borderRadius: 7,
              border: `1px solid ${T.danger}44`,
              background: T.surface, color: T.danger,
              fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
              fontFamily: T.fontSans,
            }}
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '60px 0', color: T.textMuted, gap: 10,
        }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: 13.5, fontWeight: 500 }}>Memuat laporan…</span>
        </div>
      )}

      {!loading && !error && summary && (
        <>
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
            {chartData.length > 0 ? (
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
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: T.textSubtle, fontSize: 13 }}>
                Tidak ada data untuk periode ini
              </div>
            )}
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
                      const pct = totalCat > 0 ? Math.round((c.value / totalCat) * 100) : 0;
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
          {period === 1 && monthRows.length > 0 && (
            <Surface pad={0}>
              <div style={{ padding: '18px 22px', borderBottom: `1px solid ${T.divider}` }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>Perbandingan Bulan</h3>
                <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 3 }}>{monthRows.length} bulan terakhir</div>
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
                    const income  = parseFloat(m.income);
                    const expense = parseFloat(m.expense);
                    const net     = parseFloat(m.net);
                    const savings = m.savings_rate;
                    const isViewing = m.year === viewYear && m.month - 1 === viewMonth;
                    const isToday   = m.year === TODAY.getFullYear() && m.month - 1 === TODAY.getMonth();
                    const bdColor   = i < monthRows.length - 1 ? `1px solid ${T.divider}` : 'none';
                    return (
                      <tr key={`${m.year}-${m.month}`} style={{ background: isViewing ? T.primarySoft : 'transparent' }}>
                        <td style={{ padding: '14px 22px', borderBottom: bdColor }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 13.5, fontWeight: 600, color: T.text }}>{m.label}</span>
                            {isToday && <Pill tone="success" size="sm">Berjalan</Pill>}
                          </div>
                        </td>
                        <td style={{ padding: '14px 22px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontSize: 13, color: T.primaryDark, fontWeight: 600, borderBottom: bdColor }}>
                          {formatRp(income)}
                        </td>
                        <td style={{ padding: '14px 22px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontSize: 13, color: T.danger, fontWeight: 600, borderBottom: bdColor }}>
                          {formatRp(expense)}
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
        </>
      )}
    </div>
  );
}
