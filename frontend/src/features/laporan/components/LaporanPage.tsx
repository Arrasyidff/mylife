"use client";
import { useLaporan } from '../hooks/useLaporan';
import { LaporanToolbar } from './LaporanToolbar';
import { TopStatsGrid } from './TopStatsGrid';
import { SpendingBarChart } from './SpendingBarChart';
import { LaporanChartsSection } from './LaporanChartsSection';
import { MonthComparisonTable } from './MonthComparisonTable';

export function LaporanPage() {
  const {
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
  } = useLaporan();

  return (
    <div className="font-sans">
      <LaporanToolbar
        period={period}
        setPeriod={setPeriod}
        viewMonth={viewMonth}
        viewYear={viewYear}
        btnLabel={btnLabel}
        setViewMonth={setViewMonth}
        setViewYear={setViewYear}
      />

      <TopStatsGrid stats={topStats} />

      <SpendingBarChart
        data={chartData}
        title={chartTitle}
        periodLabel={periodLabel}
        avgAmount={avgAmount}
        maxValue={maxChart}
        period={period}
      />

      <LaporanChartsSection
        catBreakdown={catBreakdown}
        totalCat={totalCat}
        hwData={hwData}
        hTotal={hTotal}
        wTotal={wTotal}
      />

      {period === 1 && (
        <MonthComparisonTable rows={monthRows} viewMonth={viewMonth} gotoMonth={gotoMonth} />
      )}
    </div>
  );
}
