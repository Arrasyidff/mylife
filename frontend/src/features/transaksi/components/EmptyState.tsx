import { Icon } from '@/components/ui/icon';

interface EmptyStateProps {
  hasFilters: boolean;
  onReset: () => void;
}

export function EmptyState({ hasFilters, onReset }: EmptyStateProps) {
  return (
    <div className="text-center py-14 md:py-16 px-6 bg-surface rounded-xl border border-app-border">
      <div className="w-12 h-12 rounded-[14px] bg-surface-alt border border-app-border flex items-center justify-center mx-auto mb-3.5 text-app-text-subtle">
        {Icon.list(22)}
      </div>
      <p className="text-[15px] font-bold text-app-text mb-1.5">
        {hasFilters ? 'Tidak ada hasil' : 'Belum ada transaksi'}
      </p>
      <p className={`text-[13px] text-app-text-subtle ${hasFilters ? 'mb-5' : 'mb-0'}`}>
        {hasFilters
          ? 'Coba ubah filter atau kata kunci pencarian.'
          : 'Tambahkan transaksi pertamamu.'}
      </p>
      {hasFilters && (
        <button
          onClick={onReset}
          className="px-4.5 py-2 rounded-full border border-app-border bg-surface cursor-pointer text-[13px] font-semibold text-app-text hover:bg-surface-alt transition-colors"
        >
          Reset filter
        </button>
      )}
    </div>
  );
}
