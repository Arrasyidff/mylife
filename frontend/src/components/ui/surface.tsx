import type { ReactNode, CSSProperties } from 'react';
import { T } from '@/lib/tokens';

interface SurfaceProps {
  children: ReactNode;
  pad?: number;
  accent?: string;
  style?: CSSProperties;
}

export function Surface({ children, pad = 20, accent, style }: SurfaceProps) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-app-border)',
      borderRadius: T.radius.lg,
      padding: pad,
      borderLeft: accent ? `3px solid ${accent}` : undefined,
      paddingLeft: accent ? pad - 2 : pad,
      ...style,
    }}>
      {children}
    </div>
  );
}
