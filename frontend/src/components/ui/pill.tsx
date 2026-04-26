import type { ReactNode } from 'react';
import { T } from '@/lib/tokens';

type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
type Size = 'sm' | 'lg';

const toneStyles: Record<Tone, { bg: string; fg: string; bd: string }> = {
  success: { bg: T.primaryLight,  fg: T.primaryDark, bd: '#C7E6D8' },
  warning: { bg: T.warningLight,  fg: '#8C5A0E',     bd: '#F4D7A0' },
  danger:  { bg: T.dangerLight,   fg: '#A52826',     bd: '#F0B7B5' },
  info:    { bg: T.infoLight,     fg: T.info,        bd: '#C9D9F8' },
  neutral: { bg: '#F1F2EE',       fg: T.textMuted,   bd: '#E0E2DC' },
};

interface PillProps {
  children: ReactNode;
  tone?: Tone;
  size?: Size;
  icon?: ReactNode;
}

export function Pill({ children, tone = 'neutral', size = 'sm', icon }: PillProps) {
  const s = toneStyles[tone];
  const pad = size === 'lg' ? '5px 11px' : '3px 9px';
  const fs  = size === 'lg' ? 13 : 11.5;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: pad,
      fontSize: fs,
      fontWeight: 600,
      background: s.bg,
      color: s.fg,
      border: `1px solid ${s.bd}`,
      borderRadius: 999,
      lineHeight: 1,
      whiteSpace: 'nowrap',
    }}>
      {icon}
      {children}
    </span>
  );
}
