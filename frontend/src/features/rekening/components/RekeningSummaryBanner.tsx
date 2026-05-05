import { Icon } from '@/components/ui/icon';
import { formatRp } from '@/lib/format';
import { GROUP_CONFIG } from '../constants';
import type { Account } from '../types';

type GroupConfig = typeof GROUP_CONFIG[number];

interface RekeningSummaryBannerProps {
  totalBalance: number;
  hiddenCount: number;
  monthlyNet: number;
  visibleAccounts: Account[];
  visibleGroupsWithBalance: GroupConfig[];
}

export function RekeningSummaryBanner({
  totalBalance,
  hiddenCount,
  monthlyNet,
  visibleAccounts,
  visibleGroupsWithBalance,
}: RekeningSummaryBannerProps) {
  const totalContent = (
    <>
      <div className="text-[0.71875rem] font-semibold text-[#7D9590] tracking-[0.01875rem] mb-2 flex items-center gap-1.5">
        TOTAL ASET
        {hiddenCount > 0 && (
          <span className="text-[0.625rem] font-semibold text-[#7D9590] bg-[#F6F9F7] border border-[#E0EAE6] rounded-lg py-px px-1.25">
            {hiddenCount} DISEMBUNYIKAN
          </span>
        )}
      </div>
      <div className="text-[2rem] font-bold text-[#1A2420] tracking-[-0.0625rem] tabular-nums">
        {formatRp(totalBalance)}
      </div>
      <div className={`text-xs font-semibold mt-1.5 flex items-center gap-1 ${monthlyNet >= 0 ? 'text-[#15735A]' : 'text-[#C0392B]'}`}>
        {monthlyNet >= 0 ? Icon.arrowUp(12) : Icon.arrowDown(12)}
        {monthlyNet >= 0 ? '+' : ''}{formatRp(monthlyNet)} bulan ini
      </div>
    </>
  );

  const groupCards = visibleGroupsWithBalance.map((group, index) => {
    const groupBalance = visibleAccounts
      .filter(account => (group.types as readonly string[]).includes(account.type))
      .reduce((sum, account) => sum + account.balance, 0);
    const groupCount = visibleAccounts.filter(account => (group.types as readonly string[]).includes(account.type)).length;
    return (
      <div
        key={index}
        className="rounded-[0.75rem] py-4 px-4.5"
        style={{ background: group.tint, border: `1px solid ${group.color}30` }}
      >
        <div className="text-[0.6875rem] font-semibold text-[#7D9590] tracking-[0.01875rem] mb-1">
          {group.label}
        </div>
        <div className="text-[1.1875rem] font-bold tracking-[-0.025rem] tabular-nums" style={{ color: group.color }}>
          {formatRp(groupBalance)}
        </div>
        <div className="text-[0.71875rem] text-[#7D9590] mt-0.75">
          {groupCount} rekening
        </div>
      </div>
    );
  });

  return (
    <>
      {/* Mobile & tablet (hidden on xl+) */}
      <div className="bg-white border border-[#E0EAE6] rounded-[0.75rem] mb-5.5 py-4.5 px-4 sm:py-5 sm:px-6 xl:hidden grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-3 pb-4 border-b border-app-border">
          {totalContent}
        </div>
        {groupCards}
      </div>

      {/* Desktop (hidden below xl) */}
      <div
        className="hidden xl:grid bg-white border border-[#E0EAE6] rounded-[0.75rem] mb-5.5 py-5.5 px-7 gap-7"
        style={{ gridTemplateColumns: `1.6fr ${visibleGroupsWithBalance.map(() => '1fr').join(' ')}` }}
      >
        <div>{totalContent}</div>
        {groupCards}
      </div>
    </>
  );
}
