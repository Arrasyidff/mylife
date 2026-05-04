import { T } from '@/lib/tokens';

interface FilterChipProps {
  children: React.ReactNode;
  active?: boolean;
  count?: number | string;
  onClick?: () => void;
}

export function FilterChip({ children, active, count, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '7px 12px',
        background: active ? T.text : T.surface,
        color: active ? '#fff' : T.text,
        border: `1px solid ${active ? T.text : T.border}`,
        borderRadius: 999, cursor: 'pointer',
        fontSize: 12.5, fontWeight: 600,
        fontFamily: T.fontSans,
        transition: 'all 0.12s',
      }}
    >
      {children}
      {count != null && (
        <span style={{
          padding: '1px 6px', borderRadius: 999,
          background: active ? 'rgba(255,255,255,0.2)' : T.surfaceAlt,
          fontSize: 11, fontWeight: 700,
        }}>
          {count}
        </span>
      )}
    </button>
  );
}
