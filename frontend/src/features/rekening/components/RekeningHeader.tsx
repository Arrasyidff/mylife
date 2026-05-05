import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';

interface RekeningHeaderProps {
  accountCount: number;
  hiddenCount: number;
  onTransfer: () => void;
  onAddAccount: () => void;
}

export function RekeningHeader({ accountCount, hiddenCount, onTransfer, onAddAccount }: RekeningHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-5 xl:mb-6">
      <div className="min-w-0">
        <h1 className="m-0 text-xl xl:text-2xl font-bold text-app-text tracking-tight leading-snug">
          Rekening
        </h1>
        <div className="flex flex-wrap items-center gap-x-1 mt-1 text-xs sm:text-[0.78125rem] text-app-text-subtle leading-normal">
          <span className="shrink-0">{accountCount} rekening aktif · April 2026</span>
          {hiddenCount > 0 && (
            <span className="text-[#7D9590] shrink-0">· {hiddenCount} tidak dihitung</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
        <Btn
          className="flex-1 sm:flex-none justify-center"
          kind="ghost"
          size="sm"
          icon={Icon.arrowLR(14)}
          onClick={onTransfer}
        >
          Transfer
        </Btn>
        <Btn
          className="flex-1 sm:flex-none justify-center"
          kind="primary"
          size="sm"
          icon={Icon.plus(14)}
          onClick={onAddAccount}
        >
          Tambah Rekening
        </Btn>
      </div>
    </div>
  );
}
