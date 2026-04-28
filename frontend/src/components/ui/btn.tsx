import type { ReactNode, CSSProperties, ButtonHTMLAttributes } from 'react';
import { T } from '@/lib/tokens';

type Kind = 'primary' | 'ghost' | 'soft' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  kind?: Kind;
  size?: Size;
  icon?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
}

const kindStyles: Record<Kind, { bg: string; fg: string; bd: string }> = {
  primary: { bg: T.primary,      fg: 'white',         bd: T.primary      },
  ghost:   { bg: T.surface,      fg: T.text,           bd: T.borderStrong },
  soft:    { bg: T.primaryLight, fg: T.primaryDark,    bd: 'transparent'  },
  danger:  { bg: T.danger,       fg: 'white',          bd: T.danger       },
};

const sizeStyles: Record<Size, { p: string; f: number }> = {
  sm: { p: '6px 11px',  f: 12.5 },
  md: { p: '8px 14px',  f: 13   },
  lg: { p: '12px 18px', f: 14   },
};

export function Btn({ children, kind = 'ghost', size = 'md', icon, style, ...rest }: BtnProps) {
  const k = kindStyles[kind];
  const s = sizeStyles[size];
  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: s.p,
        fontSize: s.f,
        fontWeight: 600,
        background: k.bg,
        color: k.fg,
        border: `1px solid ${k.bd}`,
        borderRadius: 8,
        cursor: 'pointer',
        fontFamily: T.fontSans,
        lineHeight: 1.2,
        ...style,
      }}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
