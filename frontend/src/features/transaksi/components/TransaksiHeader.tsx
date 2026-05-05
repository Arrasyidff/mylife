import { T } from '@/lib/tokens';
import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';

interface TransaksiHeaderProps {
  filteredCount: number;
  totalCount: number;
  monthLabel: string;
  onExport: () => void;
  exportDisabled: boolean;
  onAdd: () => void;
}

export function TransaksiHeader({ filteredCount, totalCount, monthLabel, onExport, exportDisabled, onAdd }: TransaksiHeaderProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      marginBottom: 20,
    }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: T.text, letterSpacing: -0.3 }}>
          Transaksi
        </h1>
        <div style={{ fontSize: 12.5, color: T.textSubtle, marginTop: 3 }}>
          {filteredCount} dari {totalCount} transaksi · {monthLabel}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <Btn kind="ghost" size="sm" icon={Icon.download(14)} onClick={onExport} disabled={exportDisabled}>Ekspor</Btn>
        <Btn kind="primary" size="sm" icon={Icon.plus(14)} onClick={onAdd}>
          Tambah
        </Btn>
      </div>
    </div>
  );
}
