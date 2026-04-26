import { T } from '@/lib/tokens';

interface UserBadgeProps {
  user: 'W' | 'H';
  size?: number;
}

const userConfig = {
  H: { bg: T.primary,  ring: '#E8F5EF', title: 'Suami' },
  W: { bg: '#A82672',  ring: '#FBE9F2', title: 'Istri'  },
};

export function UserBadge({ user, size = 22 }: UserBadgeProps) {
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
        borderRadius: 999,
        background: cfg.bg,
        color: 'white',
        fontSize: size * 0.48,
        fontWeight: 600,
        letterSpacing: 0.2,
        boxShadow: `0 0 0 2px ${cfg.ring}`,
        fontFamily: T.fontSans,
        flexShrink: 0,
      }}
    >
      {user}
    </span>
  );
}
