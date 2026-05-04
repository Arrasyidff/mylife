import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';
import { TxLine } from './TxLine';
import type { Transaction } from '../types';

interface TxGroupProps {
  label: string;
  txs: Transaction[];
  expandedId: number | null;
  onToggle: (id: number) => void;
  onEdit: (t: Transaction) => void;
}

export function TxGroup({ label, txs, expandedId, onToggle, onEdit }: TxGroupProps) {
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
          margin: 0, fontSize: 12, fontWeight: 700,
          color: T.textMuted, letterSpacing: 0.4, textTransform: 'uppercase',
        }}>
          {label}
        </h3>
        <span style={{ fontSize: 12, color: T.textMuted, fontVariantNumeric: 'tabular-nums' }}>
          <span style={{ color: netColor, fontWeight: 700 }}>
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
            onEdit={() => onEdit(t)}
          />
        ))}
      </div>
    </div>
  );
}
