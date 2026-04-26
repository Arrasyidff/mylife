import type { ReactNode } from 'react';

type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const toneStyles: Record<Tone, { bg: string; color: string; border: string }> = {
  success: { bg: '#E8F5E9', color: '#2E7D32', border: '#C8E6C9' },
  warning: { bg: '#FFF8E1', color: '#8C5A0E', border: '#FFECB3' },
  danger:  { bg: '#FFEBEE', color: '#C0392B', border: '#FFCDD2' },
  info:    { bg: '#E3F2FD', color: '#1565C0', border: '#BBDEFB' },
  neutral: { bg: '#F5F5F5', color: '#616161', border: '#E0E0E0' },
};

interface PillProps {
  children: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
}

export function Pill({ children, tone = 'neutral', icon }: PillProps) {
  const s = toneStyles[tone];
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '3px 9px',
      borderRadius: 20,
      fontSize: 11.5,
      fontWeight: 600,
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
      whiteSpace: 'nowrap',
    }}>
      {icon}
      {children}
    </span>
  );
}
