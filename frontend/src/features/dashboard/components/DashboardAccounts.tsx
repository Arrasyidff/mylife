import Link from 'next/link';
import { AccountCard } from '@/features/rekening/components/AccountCard';
import type { Account } from '@/features/rekening/types';

interface DashboardAccountsProps {
  displayedAccounts: Account[];
}

export function DashboardAccounts({ displayedAccounts }: DashboardAccountsProps) {
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
        {displayedAccounts.map(account => (
          <AccountCard key={account.id} acct={account} />
        ))}
      </div>
    </>
  );
}
