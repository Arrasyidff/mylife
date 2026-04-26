"use client";
import { useState } from 'react';
import { T } from '@/lib/tokens';
import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';
import { Pill } from '@/components/ui/pill';
import { CatBubble } from '@/components/dashboard/cat-bubble';
import { UserBadge } from '@/components/dashboard/user-badge';
import { AddTransactionModal } from '@/components/dashboard/add-transaction-modal';
import { accounts, transactions, type Transaction } from '@/lib/dashboard-data';
import { formatRp } from '@/lib/format';

function getDateKey(date: string): string {
  if (date.startsWith('Hari ini'))  return 'today';
  if (date.startsWith('Kemarin'))   return 'yesterday';
  return date.split(',')[0].trim();
}

const GROUP_LABELS: Record<string, string> = {
  today:     'Hari ini · Sabtu, 25 Apr',
  yesterday: 'Kemarin · Jumat, 24 Apr',
  '23 Apr':  'Rabu · 23 Apr',
  '22 Apr':  'Selasa · 22 Apr',
};

function TxLine({
  t,
  expanded,
  onToggle,
}: {
  t: Transaction;
  expanded: boolean;
  onToggle: () => void;
}) {
  const acct = accounts.find(a => a.id === t.acct)!;
  const isIncome = t.amount > 0;
  const borderColor =
    t.type === 'income'   ? T.primary   :
    t.type === 'transfer' ? '#3B82F6'   : T.danger;
  const amountColor =
    isIncome              ? T.primaryDark :
    t.type === 'transfer' ? '#1846A8'     : T.text;

  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 18px',
        borderLeft: `3px solid ${borderColor}`,
        background: T.surface,
        borderBottom: `1px solid ${T.divider}`,
      }}>
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
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: acct.color }} />
              {acct.name}
            </span>
            <span>·</span>
            <span>{t.date}</span>
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
            onClick={onToggle}
            style={{
              border: 'none', background: 'transparent',
              color: T.textSubtle, cursor: 'pointer', padding: 4,
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
          <div style={{
            fontSize: 11, fontWeight: 600, color: T.textMuted,
            letterSpacing: 0.3, marginBottom: 8,
          }}>
            3 ENTRI TERHUBUNG
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Debit dari Mandiri', amt: -500_000, color: T.danger   },
              { label: 'Kredit ke GoPay',    amt:  500_000, color: T.primary  },
              { label: 'Biaya Admin',        amt:   -2_500, color: T.warning  },
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

function FilterChip({ children, active, count }: {
  children: React.ReactNode;
  active?: boolean;
  count?: number | string;
}) {
  return (
    <button style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '7px 12px',
      background: active ? T.text : T.surface,
      color: active ? 'white' : T.text,
      border: `1px solid ${active ? T.text : T.border}`,
      borderRadius: 999, cursor: 'pointer',
      fontSize: 12.5, fontWeight: 600,
      fontFamily: T.fontSans,
    }}>
      {children}
      {count != null && (
        <span style={{
          padding: '1px 6px', borderRadius: 999,
          background: active ? 'rgba(255,255,255,0.2)' : T.surfaceAlt,
          fontSize: 11, fontWeight: 600,
        }}>
          {count}
        </span>
      )}
    </button>
  );
}

function TxGroup({
  label,
  txs,
  expandedId,
  onToggle,
}: {
  label: string;
  txs: Transaction[];
  expandedId: number | null;
  onToggle: (id: number) => void;
}) {
  const net = txs.reduce((s, t) => s + t.amount, 0);
  const netColor  = net >= 0 ? T.primaryDark : T.danger;
  const netPrefix = net >= 0 ? '+ ' : '− ';

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 4px 10px',
      }}>
        <h3 style={{
          margin: 0, fontSize: 12, fontWeight: 600,
          color: T.textMuted, letterSpacing: 0.4, textTransform: 'uppercase',
        }}>
          {label}
        </h3>
        <span style={{ fontSize: 12, color: T.textMuted, fontVariantNumeric: 'tabular-nums' }}>
          <span style={{ color: netColor, fontWeight: 600 }}>
            {netPrefix}{formatRp(Math.abs(net))}
          </span>
          <span style={{ margin: '0 6px' }}>·</span>
          {txs.length} transaksi
        </span>
      </div>
      <div style={{
        background: T.surface,
        borderRadius: T.radius.lg,
        border: `1px solid ${T.border}`,
        overflow: 'hidden',
      }}>
        {txs.map(t => (
          <TxLine
            key={t.id}
            t={t}
            expanded={expandedId === t.id}
            onToggle={() => onToggle(t.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default function TransactionsPage() {
  const [showModal,  setShowModal]  = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const groups = (() => {
    const map = new Map<string, Transaction[]>();
    for (const t of transactions) {
      const key = getDateKey(t.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    }
    return Array.from(map.entries()).map(([key, txs]) => ({
      key,
      label: GROUP_LABELS[key] ?? key,
      txs,
    }));
  })();

  function handleToggle(id: number) {
    setExpandedId(prev => (prev === id ? null : id));
  }

  return (
    <div style={{ fontFamily: T.fontSans }}>
      {/* Page header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: 20,
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: T.text, letterSpacing: -0.3 }}>
            Transaksi
          </h1>
          <div style={{ fontSize: 12.5, color: T.textSubtle, marginTop: 3 }}>
            {transactions.length} transaksi · April 2026
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <Btn kind="ghost" size="sm" icon={Icon.download(14)}>Ekspor</Btn>
          <Btn kind="primary" size="sm" icon={Icon.plus(14)} onClick={() => setShowModal(true)}>
            Tambah
          </Btn>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: T.radius.lg,
        padding: 16, marginBottom: 18,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 9,
            padding: '9px 12px',
            background: T.surfaceAlt, borderRadius: 9,
            border: `1px solid ${T.border}`,
          }}>
            <span style={{ color: T.textSubtle }}>{Icon.search(16)}</span>
            <span style={{ flex: 1, fontSize: 13, color: T.textSubtle }}>
              Cari merchant atau catatan…
            </span>
            <kbd style={{
              fontSize: 10, padding: '1px 5px', borderRadius: 4,
              background: T.surface, color: T.textSubtle,
              border: `1px solid ${T.border}`,
              fontFamily: 'ui-monospace, monospace',
            }}>
              ⌘K
            </kbd>
          </div>
          <Btn kind="ghost" size="sm" icon={Icon.calendar(14)}>1–25 April 2026</Btn>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <FilterChip active count={transactions.length}>Semua</FilterChip>
          <FilterChip>Pemasukan</FilterChip>
          <FilterChip>Pengeluaran</FilterChip>
          <FilterChip>Transfer</FilterChip>
          <span style={{ width: 1, background: T.border, margin: '0 4px' }} />
          <FilterChip>
            <span style={{ display: 'inline-flex' }}><UserBadge user="H" size={16} /></span>
            Suami
          </FilterChip>
          <FilterChip>
            <span style={{ display: 'inline-flex' }}><UserBadge user="W" size={16} /></span>
            Istri
          </FilterChip>
          <span style={{ width: 1, background: T.border, margin: '0 4px' }} />
          <FilterChip>4 Kategori ▾</FilterChip>
          <FilterChip>2 Rekening ▾</FilterChip>
        </div>
      </div>

      {/* Transaction groups */}
      {groups.map(g => (
        <TxGroup
          key={g.key}
          label={g.label}
          txs={g.txs}
          expandedId={expandedId}
          onToggle={handleToggle}
        />
      ))}

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
