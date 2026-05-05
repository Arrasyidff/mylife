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
      className={[
        'inline-flex items-center gap-1.5 px-3 py-1.75',
        'rounded-full border cursor-pointer',
        'text-[12.5px] font-semibold transition-all duration-120',
        active
          ? 'bg-app-text text-white border-app-text'
          : 'bg-surface text-app-text border-app-border hover:border-app-border-strong',
      ].join(' ')}
    >
      {children}
      {count != null && (
        <span className={[
          'px-1.5 rounded-full text-[11px] font-bold leading-none py-0.5',
          active ? 'bg-white/20' : 'bg-surface-alt',
        ].join(' ')}>
          {count}
        </span>
      )}
    </button>
  );
}
