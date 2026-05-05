import type { Dispatch, SetStateAction } from 'react';
import { TxGroup } from './TxGroup';
import { EmptyState } from './EmptyState';
import type { Transaction } from '../types';

interface TxGroupItem {
  key: string;
  label: string;
  txs: Transaction[];
}

interface TransaksiListProps {
  groups: TxGroupItem[];
  hasFilters: boolean;
  expandedId: number | null;
  setExpandedId: Dispatch<SetStateAction<number | null>>;
  onEdit: (t: Transaction) => void;
  resetFilters: () => void;
}

export function TransaksiList({ groups, hasFilters, expandedId, setExpandedId, onEdit, resetFilters }: TransaksiListProps) {
  if (groups.length === 0) {
    return <EmptyState hasFilters={hasFilters} onReset={resetFilters} />;
  }

  return (
    <>
      {groups.map(g => (
        <TxGroup
          key={g.key}
          label={g.label}
          txs={g.txs}
          expandedId={expandedId}
          onToggle={id => setExpandedId(prev => prev === id ? null : id)}
          onEdit={onEdit}
        />
      ))}
    </>
  );
}
