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
    isLoading,
    error,
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

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <div style={{ opacity: isLoading ? 0.5 : 1, transition: 'opacity 0.15s' }}>
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
    </div>
  );
}
