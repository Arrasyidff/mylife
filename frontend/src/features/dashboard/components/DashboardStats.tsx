import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { SummaryStat } from './SummaryStat';
import type { Transaction } from '@/lib/dashboard-data';

interface DashboardStatsProps {
  totalAssets: number;
  monthIncome: number;
  monthExpense: number;
  net: number;
  currentMonth: string;
  monthTxList: Transaction[];
}

export function DashboardStats({
  totalAssets, monthIncome, monthExpense, net, currentMonth, monthTxList,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-3.5 mb-6">
      <SummaryStat
        large
        className="col-span-2 md:col-span-3"
        label="TOTAL ASET"
        value={formatRp(totalAssets)}
        delta="+ Rp 1.420.000 dari bulan lalu"
      />
      <SummaryStat
        label={`Pemasukan ${currentMonth}`}
        value={formatRp(monthIncome)}
        delta={`${monthTxList.filter(tx => tx.type === 'income').length} transaksi masuk`}
        deltaTone="up"
        icon={<ArrowUp size={13} color={T.primary} />}
      />
      <SummaryStat
        label={`Pengeluaran ${currentMonth}`}
        value={formatRp(monthExpense)}
        delta={`${monthTxList.filter(tx => tx.type === 'expense').length} transaksi keluar`}
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
