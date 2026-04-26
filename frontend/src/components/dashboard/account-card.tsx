import type { Account } from '@/lib/dashboard-data';
import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';

interface AccountCardProps {
  acct: Account;
}

export function AccountCard({ acct }: AccountCardProps) {
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
    </div>
  );
}
