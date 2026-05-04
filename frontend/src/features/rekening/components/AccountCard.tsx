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
      padding: '1rem 1.125rem',
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.625rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        <div style={{
          width: '1.875rem',
          height: '1.875rem',
          borderRadius: '0.5rem',
          background: acct.color + '18',
          color: acct.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.6875rem',
          fontWeight: 700,
          letterSpacing: '0.025rem',
          flexShrink: 0,
        }}>
          {acct.glyph}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: T.text }}>{acct.name}</div>
          <div style={{
            fontSize: '0.6875rem',
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
        <div style={{ fontSize: '0.6875rem', color: T.textSubtle, marginBottom: '0.125rem' }}>Saldo</div>
        <div style={{
          fontSize: '1.1875rem',
          fontWeight: 700,
          color: T.text,
          letterSpacing: '-0.025rem',
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
          paddingTop: '0.5rem',
          marginTop: '-0.125rem',
        }}>
          <span style={{ fontSize: '0.6875rem', color: T.textSubtle }}>
            {relativeTime(lastUpdated)}
          </span>
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: deltaColor, fontVariantNumeric: 'tabular-nums' }}>
            {deltaSign}{formatRp(lastTx.amount)}
          </span>
        </div>
      )}
    </div>
  );
}
