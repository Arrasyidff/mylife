"use client";
import { useLaporan } from '../hooks/useLaporan';
import { PeriodToggle } from './PeriodToggle';
import { DatePicker } from './DatePicker';
import { TopStatsGrid } from './TopStatsGrid';
import { SpendingBarChart } from './SpendingBarChart';
import { CategoryDonut } from './CategoryDonut';
import { SpenderChart } from './SpenderChart';
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
      <div className="flex items-center justify-end gap-2.5 mb-5.5">
        <PeriodToggle period={period} setPeriod={setPeriod} />
        <DatePicker
          period={period}
          viewMonth={viewMonth}
          viewYear={viewYear}
          btnLabel={btnLabel}
          setViewMonth={setViewMonth}
          setViewYear={setViewYear}
        />
      </div>

      <TopStatsGrid stats={topStats} />

      <SpendingBarChart
        data={chartData}
        title={chartTitle}
        periodLabel={periodLabel}
        avgAmount={avgAmount}
        maxValue={maxChart}
        period={period}
      />

      <div className="grid grid-cols-[1fr_1.3fr] gap-4.5 mb-4.5">
        <CategoryDonut breakdown={catBreakdown} totalCat={totalCat} />
        <SpenderChart data={hwData} hTotal={hTotal} wTotal={wTotal} />
      </div>

      {period === 1 && (
        <MonthComparisonTable rows={monthRows} viewMonth={viewMonth} gotoMonth={gotoMonth} />
      )}
    </div>
  );
}
