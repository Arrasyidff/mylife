import type { ReactNode } from 'react';
import { T } from '@/lib/tokens';
import { CatIcon } from '@/components/ui/icon';

type CatKey = keyof typeof T.cat;

interface CatBubbleProps {
  cat: string;
  size?: number;
  glyph?: ReactNode;
}

export function CatBubble({ cat, size = 36, glyph }: CatBubbleProps) {
  const palette = T.cat[cat as CatKey] ?? T.cat.default;
  const IconFn  = CatIcon[cat as keyof typeof CatIcon] ?? CatIcon.shopping;
  const iconSize = Math.round(size * 0.55);

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: Math.round(size * 0.32),
      background: palette.bg,
      color: palette.fg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      {glyph ?? IconFn(iconSize)}
    </div>
  );
}
