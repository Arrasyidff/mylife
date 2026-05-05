import type { Transaction } from '../types';
import { accounts } from '@/lib/dashboard-data';
import { T } from '@/lib/tokens';
import { formatRp, formatTxDate } from '@/lib/format';
import { CatBubble } from '@/components/shared/CatBubble';
import { UserBadge } from '@/components/shared/UserBadge';

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
          <span style={{
            fontSize: 13.5, fontWeight: 600, color: T.text,
            flex: 1, minWidth: 0,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{t.merch}</span>
          <span style={{ flexShrink: 0 }}>
            <UserBadge user={t.user} size={18} />
          </span>
        </div>
        <div style={{ fontSize: 11.5, color: T.textSubtle, marginTop: 2, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          {showAcct && acct && (
            <>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <span style={{ width: 6, height: 6, borderRadius: 3, background: acct.color, display: 'inline-block' }} />
                {acct.name}
              </span>
              <span style={{ margin: '0 6px', flexShrink: 0 }}>·</span>
            </>
          )}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {formatTxDate(t.date)}
          </span>
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
