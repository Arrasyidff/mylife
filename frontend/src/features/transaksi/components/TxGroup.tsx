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
  const isPositive = net >= 0;

  return (
    <div className="mb-7">
      <div className="flex items-center justify-between px-1 pb-2.5">
        <h3 className="m-0 text-[12px] font-bold text-app-text-muted tracking-[0.4px] uppercase">
          {label}
        </h3>
        <span className="text-[12px] text-app-text-muted tabular-nums">
          <span className={`font-bold ${isPositive ? 'text-brand-dark' : 'text-app-danger'}`}>
            {isPositive ? '+ ' : '− '}{formatRp(Math.abs(net))}
          </span>
          <span className="mx-1.5">·</span>
          {txs.length} transaksi
        </span>
      </div>
      <div className="bg-surface rounded-xl border border-app-border overflow-hidden">
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
