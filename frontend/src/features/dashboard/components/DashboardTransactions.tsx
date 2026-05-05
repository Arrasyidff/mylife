import Link from 'next/link';
import { Surface } from '@/components/ui/surface';
import { TxRow } from '@/features/transaksi/components/TxRow';
import type { Transaction } from '@/lib/dashboard-data';

interface DashboardTransactionsProps {
  monthTxList: Transaction[];
  currentMonth: string;
  currentYear: number;
}

export function DashboardTransactions({ monthTxList, currentMonth, currentYear }: DashboardTransactionsProps) {
  return (
    <Surface pad={20}>
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="m-0 text-[15px] font-bold text-[#1A2420]">Transaksi Terkini</h3>
          <div className="text-xs text-[#A4B8B2] mt-0.75">
            {monthTxList.length} transaksi {currentMonth} {currentYear}
          </div>
        </div>
      </div>
      <div className="mt-2">
        {monthTxList.slice(0, 7).map(t => <TxRow key={t.id} t={t} />)}
      </div>
      <Link href="/transaksi" className="block text-center mt-3 text-[12.5px] text-[#15735A] font-semibold no-underline">
        Lihat semua transaksi →
      </Link>
    </Surface>
  );
}
