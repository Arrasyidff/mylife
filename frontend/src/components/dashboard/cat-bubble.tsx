interface CatConfig {
  emoji: string;
  bg: string;
}

const catConfig: Record<string, CatConfig> = {
  food:      { emoji: '🍽️', bg: '#FFF3E0' },
  transport: { emoji: '🚗', bg: '#E3F2FD' },
  shopping:  { emoji: '🛍️', bg: '#F3E5F5' },
  bills:     { emoji: '💡', bg: '#FFFDE7' },
  health:    { emoji: '❤️', bg: '#FCE4EC' },
  fun:       { emoji: '🎮', bg: '#E8F5E9' },
  salary:    { emoji: '💰', bg: '#E8F5E9' },
  transfer:  { emoji: '🔄', bg: '#E3F2FD' },
  home:      { emoji: '🏠', bg: '#FFF8E1' },
};

const fallback: CatConfig = { emoji: '📌', bg: '#F5F5F5' };

interface CatBubbleProps {
  cat: string;
  size?: number;
}

export function CatBubble({ cat, size = 36 }: CatBubbleProps) {
  const cfg = catConfig[cat] ?? fallback;
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: size * 0.3,
      background: cfg.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.48,
      flexShrink: 0,
    }}>
      {cfg.emoji}
    </div>
  );
}
