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
    <div className="flex items-start justify-between mb-5">
      <div>
        <h1 className="m-0 text-xl font-bold text-app-text tracking-[-0.3px]">
          Transaksi
        </h1>
        <p className="text-[12.5px] text-app-text-subtle mt-0.5 m-0">
          {filteredCount} dari {totalCount} transaksi · {monthLabel}
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <Btn kind="ghost" size="sm" icon={Icon.download(14)} onClick={onExport} disabled={exportDisabled}>
          Ekspor
        </Btn>
        <Btn kind="primary" size="sm" icon={Icon.plus(14)} onClick={onAdd}>
          Tambah
        </Btn>
      </div>
    </div>
  );
}
