import { T } from '@/lib/tokens';
import { Icon } from '@/components/ui/icon';
import { Pill } from '@/components/ui/pill';
import { CatBubble } from '@/components/shared/CatBubble';
import { UserBadge } from '@/components/shared/UserBadge';
import { accounts } from '@/lib/dashboard-data';
import { formatRp, formatTxDate } from '@/lib/format';
import type { Transaction } from '../types';

interface TxLineProps {
  t: Transaction;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
}

export function TxLine({ t, expanded, onToggle, onEdit }: TxLineProps) {
  const acct = accounts.find(a => a.id === t.acct);
  const isIncome = t.type === 'income';
  const borderColor =
    t.type === 'income'   ? T.primary  :
    t.type === 'transfer' ? '#3B82F6'  : T.danger;
  const amountColor =
    isIncome              ? T.primaryDark :
    t.type === 'transfer' ? '#1846A8'     : T.text;

  return (
    <>
      <div
        onClick={onEdit}
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px 18px',
          borderLeft: `3px solid ${borderColor}`,
          background: T.surface,
          borderBottom: `1px solid ${T.divider}`,
          cursor: 'pointer',
          transition: 'background 0.1s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = T.surfaceAlt)}
        onMouseLeave={e => (e.currentTarget.style.background = T.surface)}
      >
        <CatBubble cat={t.cat} size={38} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{t.merch}</span>
            <Pill
              tone={t.type === 'income' ? 'success' : t.type === 'transfer' ? 'info' : 'danger'}
              size="sm"
            >
              {t.type === 'income' ? 'Pemasukan' : t.type === 'transfer' ? 'Transfer' : 'Pengeluaran'}
            </Pill>
          </div>
          <div style={{
            fontSize: 12, color: T.textSubtle, marginTop: 3,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {acct && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: 3, background: acct.color }} />
                {acct.name}
              </span>
            )}
            {acct && <span>·</span>}
            <span>{formatTxDate(t.date)}</span>
            {t.note && (
              <>
                <span>·</span>
                <span style={{ fontStyle: 'italic', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t.note}
                </span>
              </>
            )}
          </div>
        </div>

        <UserBadge user={t.user} size={22} />

        <div style={{
          fontSize: 15, fontWeight: 700,
          color: amountColor,
          fontVariantNumeric: 'tabular-nums',
          minWidth: 130, textAlign: 'right',
        }}>
          {isIncome ? '+' : ''}{formatRp(t.amount)}
        </div>

        {t.type === 'transfer' && (
          <button
            onClick={e => { e.stopPropagation(); onToggle(); }}
            style={{
              border: 'none', background: 'transparent',
              color: T.textSubtle, cursor: 'pointer', padding: 4, flexShrink: 0,
            }}
          >
            {Icon.chev(16, expanded ? 'up' : 'down')}
          </button>
        )}
      </div>

      {expanded && t.type === 'transfer' && (
        <div style={{
          background: T.surfaceAlt,
          borderLeft: '3px solid #3B82F6',
          borderBottom: `1px solid ${T.divider}`,
          padding: '12px 18px 14px 64px',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, letterSpacing: 0.3, marginBottom: 8 }}>
            3 ENTRI TERHUBUNG
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Debit dari Mandiri', amt: -500_000, color: T.danger  },
              { label: 'Kredit ke GoPay',    amt:  500_000, color: T.primary },
              { label: 'Biaya Admin',        amt:   -2_500, color: T.warning },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5 }}>
                <span style={{ width: 8, height: 8, borderRadius: 4, background: r.color, flexShrink: 0 }} />
                <span style={{ flex: 1, color: T.text }}>{r.label}</span>
                <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: r.color }}>
                  {r.amt > 0 ? '+' : ''}{formatRp(r.amt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
