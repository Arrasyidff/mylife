import { CategoryDonut } from './CategoryDonut';
import { SpenderChart } from './SpenderChart';
import type { CatBreakdownItem, HWDataItem } from '../types';

type Props = {
  catBreakdown: CatBreakdownItem[];
  totalCat: number;
  hwData: HWDataItem[];
  hTotal: number;
  wTotal: number;
};

export function LaporanChartsSection({ catBreakdown, totalCat, hwData, hTotal, wTotal }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-4 md:gap-4.5 mb-4.5">
      <CategoryDonut breakdown={catBreakdown} totalCat={totalCat} />
      <SpenderChart data={hwData} hTotal={hTotal} wTotal={wTotal} />
    </div>
  );
}
