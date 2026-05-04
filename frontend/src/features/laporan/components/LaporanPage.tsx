"use client";
import { T } from '@/lib/tokens';
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
    <div style={{ fontFamily: T.fontSans }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, marginBottom: 22 }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 18, marginBottom: 18 }}>
        <CategoryDonut breakdown={catBreakdown} totalCat={totalCat} />
        <SpenderChart data={hwData} hTotal={hTotal} wTotal={wTotal} />
      </div>

      {period === 1 && (
        <MonthComparisonTable rows={monthRows} viewMonth={viewMonth} gotoMonth={gotoMonth} />
      )}
    </div>
  );
}
