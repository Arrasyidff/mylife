import Link from 'next/link';
import { AccountCard } from '@/features/rekening/components/AccountCard';
import type { Account, Transaction } from '@/lib/dashboard-data';

interface DashboardAccountsProps {
  displayedAccounts: Account[];
  lastTxByAcct: Record<string, string>;
  txList: Transaction[];
}

export function DashboardAccounts({ displayedAccounts, lastTxByAcct, txList }: DashboardAccountsProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h2 className="m-0 text-xs font-semibold text-[#7D9590] tracking-[0.5px] uppercase">
          Rekening
        </h2>
        <Link href="/rekening" className="text-[12.5px] text-[#15735A] font-semibold no-underline">
          Kelola →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-6">
        {displayedAccounts.map(a => {
          const lastDate = lastTxByAcct[a.id];
          const lastTx = lastDate ? txList.find(tx => tx.acct === a.id && tx.date === lastDate) : undefined;
          return (
            <AccountCard
              key={a.id}
              acct={a}
              lastTx={lastTx}
              lastUpdated={lastDate}
            />
          );
        })}
      </div>
    </>
  );
}
