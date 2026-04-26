import type { Transaction } from '@/lib/dashboard-data';
import { accounts } from '@/lib/dashboard-data';
import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';
import { CatBubble } from './cat-bubble';
import { UserBadge } from './user-badge';

interface TxRowProps {
  t: Transaction;
  showAcct?: boolean;
}

export function TxRow({ t, showAcct = true }: TxRowProps) {
  const isIncome = t.amount > 0;
  const isTransfer = t.type === 'transfer';
  const acct = accounts.find(a => a.id === t.acct);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '11px 0',
      borderBottom: `1px solid ${T.divider}`,
    }}>
      <CatBubble cat={t.cat} size={36} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: T.text }}>{t.merch}</span>
          <UserBadge user={t.user} size={18} />
        </div>
        <div style={{ fontSize: 11.5, color: T.textSubtle, marginTop: 2, display: 'flex', alignItems: 'center' }}>
          {showAcct && acct && (
            <>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: 3, background: acct.color, display: 'inline-block' }} />
                {acct.name}
              </span>
              <span style={{ margin: '0 6px' }}>·</span>
            </>
          )}
          {t.date}
        </div>
      </div>
      <div style={{
        fontSize: 14,
        fontWeight: 700,
        color: isIncome ? T.primaryDark : isTransfer ? '#1846A8' : T.text,
        fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap',
      }}>
        {isIncome ? '+' : ''}{formatRp(t.amount)}
      </div>
    </div>
  );
}
