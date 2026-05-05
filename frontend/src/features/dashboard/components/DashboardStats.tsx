import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { SummaryStat } from './SummaryStat';

interface DashboardStatsProps {
  totalAssets: number;
  totalAccounts: number;
  monthIncome: number;
  monthExpense: number;
  net: number;
  savingsRate: number;
  currentMonth: string;
}

export function DashboardStats({
  totalAssets, totalAccounts, monthIncome, monthExpense, net, savingsRate, currentMonth,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-3.5 mb-6">
      <SummaryStat
        large
        className="col-span-2 md:col-span-3"
        label="TOTAL ASET"
        value={formatRp(totalAssets)}
        delta={`${totalAccounts} rekening aktif`}
      />
      <SummaryStat
        label={`Pemasukan ${currentMonth}`}
        value={formatRp(monthIncome)}
        delta={savingsRate > 0 ? `Saving rate ${savingsRate}%` : 'bulan ini'}
        deltaTone="up"
        icon={<ArrowUp size={13} color={T.primary} />}
      />
      <SummaryStat
        label={`Pengeluaran ${currentMonth}`}
        value={formatRp(monthExpense)}
        delta="bulan ini"
        deltaTone="down"
        icon={<ArrowDown size={13} color={T.danger} />}
      />
      <SummaryStat
        className="col-span-2 md:col-span-1"
        label={`Net ${currentMonth}`}
        value={formatRp(net)}
        delta={net >= 0 ? `Surplus ${currentMonth}` : `Defisit ${currentMonth}`}
        deltaTone={net >= 0 ? 'up' : 'down'}
      />
    </div>
  );
}
