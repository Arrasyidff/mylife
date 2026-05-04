"use client";
import { useState, useMemo } from 'react';
import { transactions, budgets } from '@/lib/dashboard-data';
import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';
import {
  TODAY, MONTH_SHORT, MONTH_FULL, DAY_SHORT,
  CAT_COLORS, CAT_LABEL, MONTH_HISTORY,
} from '../constants';
import type { Period, MonthRow, StatItem, CatBreakdownItem, HWDataItem, ChartBar } from '../types';

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function compactRp(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}jt`;
  if (amount >= 1_000)     return `${Math.round(amount / 1_000)}k`;
  return `Rp ${amount}`;
}

export function useLaporan() {
  const [period,    setPeriod]    = useState<Period>(1);
  const [viewMonth, setViewMonth] = useState(TODAY.getMonth());
  const [viewYear,  setViewYear]  = useState(TODAY.getFullYear());

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
      const isCurrentMonth = viewYear === TODAY.getFullYear() && viewMonth === TODAY.getMonth();
      const daysInMonth    = new Date(viewYear, viewMonth + 1, 0).getDate();
      const lastDay        = isCurrentMonth ? TODAY.getDate() : daysInMonth;
      return {
        periodExpenses: expenses.filter(t => {
          const d = new Date(t.date);
          return d.getFullYear() === viewYear && d.getMonth() === viewMonth;
        }),
        periodLabel: `1–${lastDay} ${MONTH_FULL[viewMonth]} ${viewYear}`,
        btnLabel: `${MONTH_SHORT[viewMonth]} ${viewYear}`,
      };
    }

    return {
      periodExpenses: expenses.filter(t => new Date(t.date).getFullYear() === viewYear),
      periodLabel: `Januari – Desember ${viewYear}`,
      btnLabel: `Tahun ${viewYear}`,
    };
  }, [period, viewMonth, viewYear]);

  const catBreakdown = useMemo((): CatBreakdownItem[] => {
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

  const hwData = useMemo((): HWDataItem[] => {
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

  const { chartData, chartTitle, avgAmount } = useMemo(() => {
    if (period === 0) {
      const start = new Date(TODAY); start.setDate(TODAY.getDate() - 6); start.setHours(0, 0, 0, 0);
      const data: ChartBar[] = Array.from({ length: 7 }, (_, i) => {
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
      const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
      const data: ChartBar[] = Array.from({ length: daysInMonth }, (_, i) => {
        const date  = new Date(viewYear, viewMonth, i + 1);
        const dayTx = periodExpenses.filter(t => isSameDay(new Date(t.date), date));
        return {
          key: String(i + 1),
          suami: dayTx.filter(t => t.user === 'H').reduce((s, t) => s + Math.abs(t.amount), 0),
          istri: dayTx.filter(t => t.user === 'W').reduce((s, t) => s + Math.abs(t.amount), 0),
        };
      });
      const divisor = (viewYear === TODAY.getFullYear() && viewMonth === TODAY.getMonth()) ? TODAY.getDate() : daysInMonth;
      const total   = data.reduce((s, d) => s + d.suami + d.istri, 0);
      return { chartData: data, chartTitle: 'Pengeluaran Harian', avgAmount: Math.round(total / divisor) };
    }

    const data: ChartBar[] = MONTH_SHORT.map((label, i) => {
      const monthTx = periodExpenses.filter(t => new Date(t.date).getMonth() === i);
      return {
        key: label,
        suami: monthTx.filter(t => t.user === 'H').reduce((s, t) => s + Math.abs(t.amount), 0),
        istri: monthTx.filter(t => t.user === 'W').reduce((s, t) => s + Math.abs(t.amount), 0),
      };
    });
    const total = data.reduce((s, d) => s + d.suami + d.istri, 0);
    return { chartData: data, chartTitle: 'Pengeluaran per Bulan', avgAmount: Math.round(total / 12) };
  }, [period, viewMonth, viewYear, periodExpenses]);

  const maxChart = Math.max(...chartData.map(d => d.suami + d.istri), 1);

  const topStats = useMemo((): StatItem[] => {
    const topCat     = catBreakdown[0];
    const biggestTx  = [...periodExpenses].sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))[0];
    const biggestDate = biggestTx ? new Date(biggestTx.date) : null;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysRange   = period === 0 ? 7 : period === 1
      ? ((viewYear === TODAY.getFullYear() && viewMonth === TODAY.getMonth()) ? TODAY.getDate() : daysInMonth)
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
  }, [catBreakdown, periodExpenses, avgAmount, period, viewMonth, viewYear]);

  const monthRows = useMemo((): MonthRow[] => {
    const aprilIncome  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const aprilExpense = budgets.reduce((s, b) => s + b.used, 0);
    return [...MONTH_HISTORY, { m: 'Apr 2026', income: aprilIncome, expense: aprilExpense, idx: 3 }];
  }, []);

  function gotoMonth(m: MonthRow) {
    setViewMonth(m.idx);
    setPeriod(1);
  }

  return {
    period, setPeriod,
    viewMonth, setViewMonth,
    viewYear, setViewYear,
    periodLabel, btnLabel,
    catBreakdown, totalCat,
    hwData, hTotal, wTotal,
    chartData, chartTitle, avgAmount, maxChart,
    topStats,
    monthRows,
    gotoMonth,
  };
}
