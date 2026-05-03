import type { Account, Transaction } from '../types';
import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';

interface AccountCardProps {
  acct: Account;
  lastTx?: Transaction;
  lastUpdated?: string;
}

function relativeTime(isoDate: string): string {
  const now = new Date(2026, 3, 27); // mock today
  const d = new Date(isoDate);
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} jam lalu`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return 'Kemarin';
  return `${diffD} hari lalu`;
}

export function AccountCard({ acct, lastTx, lastUpdated }: AccountCardProps) {
  const isPositive = lastTx && lastTx.amount > 0;
  const deltaColor = isPositive ? T.primary : T.danger;
  const deltaSign  = isPositive ? '+' : '';

  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderLeft: `3px solid ${acct.color}`,
      borderRadius: T.radius.lg,
      padding: '16px 18px',
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: acct.color + '18',
          color: acct.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.4,
          flexShrink: 0,
        }}>
          {acct.glyph}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{acct.name}</div>
          <div style={{
            fontSize: 11,
            color: T.textSubtle,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {acct.subtitle}
          </div>
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, color: T.textSubtle, marginBottom: 2 }}>Saldo</div>
        <div style={{
          fontSize: 19,
          fontWeight: 700,
          color: T.text,
          letterSpacing: -0.4,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {formatRp(acct.balance)}
        </div>
      </div>
      {lastTx && lastUpdated && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: `1px solid ${T.border}`,
          paddingTop: 8,
          marginTop: -2,
        }}>
          <span style={{ fontSize: 11, color: T.textSubtle }}>
            {relativeTime(lastUpdated)}
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, color: deltaColor, fontVariantNumeric: 'tabular-nums' }}>
            {deltaSign}{formatRp(lastTx.amount)}
          </span>
        </div>
      )}
    </div>
  );
}
