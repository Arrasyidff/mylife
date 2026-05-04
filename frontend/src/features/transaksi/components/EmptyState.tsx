import { T } from '@/lib/tokens';
import { Icon } from '@/components/ui/icon';

interface EmptyStateProps {
  hasFilters: boolean;
  onReset: () => void;
}

export function EmptyState({ hasFilters, onReset }: EmptyStateProps) {
  return (
    <div style={{
      textAlign: 'center', padding: '60px 24px',
      background: T.surface, borderRadius: T.radius.lg,
      border: `1px solid ${T.border}`,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: T.surfaceAlt, border: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 14px', color: T.textSubtle,
      }}>
        {Icon.list(22)}
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 6 }}>
        {hasFilters ? 'Tidak ada hasil' : 'Belum ada transaksi'}
      </div>
      <div style={{ fontSize: 13, color: T.textSubtle, marginBottom: hasFilters ? 20 : 0 }}>
        {hasFilters
          ? 'Coba ubah filter atau kata kunci pencarian.'
          : 'Tambahkan transaksi pertamamu.'}
      </div>
      {hasFilters && (
        <button
          onClick={onReset}
          style={{
            padding: '8px 18px', borderRadius: 999,
            border: `1px solid ${T.border}`, background: T.surface,
            cursor: 'pointer', fontSize: 13, fontWeight: 600, color: T.text,
            fontFamily: T.fontSans,
          }}
        >
          Reset filter
        </button>
      )}
    </div>
  );
}
