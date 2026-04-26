interface UserBadgeProps {
  user: 'W' | 'H';
  size?: number;
}

const userConfig = {
  W: { label: 'W', bg: '#FCE4EC', color: '#C62828', title: 'Istri' },
  H: { label: 'H', bg: '#E3F2FD', color: '#1565C0', title: 'Suami' },
};

export function UserBadge({ user, size = 20 }: UserBadgeProps) {
  const cfg = userConfig[user];
  return (
    <span
      title={cfg.title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: size / 2,
        background: cfg.bg,
        color: cfg.color,
        fontSize: size * 0.55,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {cfg.label}
    </span>
  );
}
