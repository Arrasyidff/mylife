"use client";
import { useState, useEffect } from 'react';
import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';
import { MONTH_SHORT, MONTH_FULL, CAT_COLORS, CAT_LABEL } from '../constants';
import type { Period, MonthRow, StatItem, CatBreakdownItem, HWDataItem, ChartBar } from '../types';
import {
  getLaporanSummary,
  getMonthlyComparison,
  type ReportSummaryResponse,
  type MonthComparisonRow,
  type ReportPeriod,
} from '../services/laporanService';

const PERIOD_MAP: Record<Period, ReportPeriod> = {
  0: 'WEEKLY',
  1: 'MONTHLY',
  2: 'YEARLY',
};

const CHART_TITLES: Record<Period, string> = {
  0: 'Pengeluaran 7 Hari Terakhir',
  1: 'Pengeluaran Harian',
  2: 'Pengeluaran per Bulan',
};

function buildPeriodLabels(
  period: Period,
  viewMonth: number,
  viewYear: number,
): { periodLabel: string; btnLabel: string } {
  const now = new Date();

  if (period === 0) {
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    const monthName = MONTH_SHORT[now.getMonth()];
    return {
      periodLabel: `${start.getDate()}–${now.getDate()} ${monthName} ${now.getFullYear()}`,
      btnLabel: `${start.getDate()}–${now.getDate()} ${monthName}`,
    };
  }

  if (period === 1) {
    const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const lastDay = isCurrentMonth ? now.getDate() : daysInMonth;
    return {
      periodLabel: `1–${lastDay} ${MONTH_FULL[viewMonth]} ${viewYear}`,
      btnLabel: `${MONTH_SHORT[viewMonth]} ${viewYear}`,
    };
  }

  return {
    periodLabel: `Januari – Desember ${viewYear}`,
    btnLabel: `Tahun ${viewYear}`,
  };
}

function buildTopStats(summary: ReportSummaryResponse): StatItem[] {
  const topCategory = summary.top_category
    ? {
        name: CAT_LABEL[summary.top_category.category] ?? summary.top_category.category,
        total: parseFloat(summary.top_category.total),
      }
    : null;

  const biggest = summary.biggest_transaction;
  const biggestDate = biggest ? new Date(biggest.date) : null;

  return [
    {
      label: 'KATEGORI TERATAS',
      value: topCategory?.name ?? '—',
      sub: topCategory ? formatRp(topCategory.total) : '—',
      tone: T.text,
    },
    {
      label: 'PENGELUARAN TERBESAR',
      value: biggest ? formatRp(parseFloat(biggest.amount)) : '—',
      sub:
        biggest && biggestDate
          ? `${biggest.merchant} · ${biggestDate.getDate()} ${MONTH_SHORT[biggestDate.getMonth()]}`
          : '—',
      tone: T.danger,
    },
    {
      label: 'RATA-RATA HARIAN',
      value: formatRp(Math.round(parseFloat(summary.avg_daily_expense))),
      sub: 'per hari',
      tone: T.text,
    },
    {
      label: 'HARI TANPA SPENDING',
      value: `${summary.days_without_spending} hari`,
      sub: `dari ${summary.total_days} hari`,
      tone: T.primaryDark,
    },
  ];
}

function mapCatBreakdown(summary: ReportSummaryResponse): CatBreakdownItem[] {
  return summary.categories.map((categoryStat) => ({
    name: CAT_LABEL[categoryStat.category] ?? categoryStat.category,
    value: parseFloat(categoryStat.total),
    cat: categoryStat.category,
    color: CAT_COLORS[categoryStat.category] ?? '#888',
  }));
}

function mapHwData(summary: ReportSummaryResponse): HWDataItem[] {
  return summary.categories.slice(0, 5).map((categoryStat) => ({
    cat: CAT_LABEL[categoryStat.category] ?? categoryStat.category,
    h: parseFloat(categoryStat.suami),
    w: parseFloat(categoryStat.istri),
  }));
}

function mapMonthRows(rows: MonthComparisonRow[]): MonthRow[] {
  return rows.map((row) => ({
    m: row.label,
    income: parseFloat(row.income),
    expense: parseFloat(row.expense),
    idx: row.month - 1,
  }));
}

export function useLaporan() {
  const now = new Date();
  const [period, setPeriod] = useState<Period>(1);
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [catBreakdown, setCatBreakdown] = useState<CatBreakdownItem[]>([]);
  const [hwData, setHwData] = useState<HWDataItem[]>([]);
  const [chartData, setChartData] = useState<ChartBar[]>([]);
  const [hTotal, setHTotal] = useState(0);
  const [wTotal, setWTotal] = useState(0);
  const [topStats, setTopStats] = useState<StatItem[]>([]);
  const [monthRows, setMonthRows] = useState<MonthRow[]>([]);

  const { periodLabel, btnLabel } = buildPeriodLabels(period, viewMonth, viewYear);
  const chartTitle = CHART_TITLES[period];
  const totalCat = catBreakdown.reduce((sum, categoryStat) => sum + categoryStat.value, 0);
  const maxChart = Math.max(...chartData.map((dataPoint) => dataPoint.suami + dataPoint.istri), 1);
  const avgAmount = Math.round(
    chartData.reduce((sum, dataPoint) => sum + dataPoint.suami + dataPoint.istri, 0) /
      Math.max(chartData.filter((dataPoint) => dataPoint.suami + dataPoint.istri > 0).length, 1),
  );

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const summaryParams = {
      period: PERIOD_MAP[period],
      ...(period === 1 ? { year: viewYear, month: viewMonth + 1 } : {}),
      ...(period === 2 ? { year: viewYear } : {}),
    };

    getLaporanSummary(summaryParams)
      .then((summary) => {
        if (cancelled) return;

        setCatBreakdown(mapCatBreakdown(summary));
        setHwData(mapHwData(summary));
        setChartData(
          summary.chart_data.map((dataPoint) => ({
            key: dataPoint.key,
            suami: dataPoint.suami,
            istri: dataPoint.istri,
          })),
        );
        setHTotal(parseFloat(summary.by_recorder.SUAMI));
        setWTotal(parseFloat(summary.by_recorder.ISTRI));
        setTopStats(buildTopStats(summary));
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [period, viewMonth, viewYear]);

  useEffect(() => {
    if (period !== 1) return;

    let cancelled = false;

    getMonthlyComparison({ months: 3, year: viewYear, month: viewMonth + 1 })
      .then((result) => {
        if (!cancelled) setMonthRows(mapMonthRows(result.months));
      })
      .catch(() => {
        if (!cancelled) setMonthRows([]);
      });

    return () => {
      cancelled = true;
    };
  }, [period, viewMonth, viewYear]);

  function gotoMonth(monthRow: MonthRow) {
    setViewMonth(monthRow.idx);
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
    isLoading,
    error,
  };
}
