import type { Account } from '../types';
import { AccountDetailCard } from './AccountDetailCard';
import { AddAccountCard } from './AddAccountCard';

interface RekeningAccountGridProps {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onToggleHide: (accountId: string) => void;
  onAddAccount: () => void;
}

export function RekeningAccountGrid({ accounts, onEdit, onToggleHide, onAddAccount }: RekeningAccountGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {accounts.map(account => (
        <AccountDetailCard
          key={account.id}
          acct={account}
          isHidden={!!account.hidden}
          onEdit={() => onEdit(account)}
          onToggleHide={() => onToggleHide(account.id)}
        />
      ))}
      <AddAccountCard onClick={onAddAccount} />
    </div>
  );
}
