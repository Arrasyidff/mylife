import type { ReactNode, CSSProperties } from 'react';
import { T } from '@/lib/tokens';

interface SurfaceProps {
  children: ReactNode;
  pad?: number;
  style?: CSSProperties;
}

export function Surface({ children, pad = 16, style }: SurfaceProps) {
  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: T.radius.lg,
      padding: pad,
      ...style,
    }}>
      {children}
    </div>
  );
}
