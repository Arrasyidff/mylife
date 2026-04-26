export const T = {
  // Brand
  primary:     '#1D9E75',
  primaryDark: '#15735A',
  primaryLight: '#E6F6F0',
  primarySoft:  '#F0FAF6',

  // Status
  warning:      '#D4860B',
  warningLight: '#FDF1DD',
  danger:       '#C0392B',
  dangerLight:  '#FDEEEE',
  info:         '#1846A8',
  infoLight:    '#EBF0FD',

  // Surfaces
  bg:         '#F4F7F5',
  surface:    '#FFFFFF',
  surfaceAlt: '#F6F9F7',

  // Borders
  border:       '#E0EAE6',
  borderStrong: '#CEDAD4',
  divider:      '#EEF2F0',

  // Text
  text:       '#1A2420',
  textMuted:  '#7D9590',
  textSubtle: '#A4B8B2',

  // Radius
  radius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
  },

  fontSans: 'var(--font-poppins), system-ui, sans-serif',

  // Per-category palette { bg, fg }
  cat: {
    food:      { bg: '#FFF3E0', fg: '#E65100' },
    transport: { bg: '#E3F2FD', fg: '#1565C0' },
    shopping:  { bg: '#F3E5F5', fg: '#7B1FA2' },
    bills:     { bg: '#FFFDE7', fg: '#F57F17' },
    health:    { bg: '#FCE4EC', fg: '#C62828' },
    home:      { bg: '#FFF8E1', fg: '#C67300' },
    salary:    { bg: '#E8F5E9', fg: '#1B5E20' },
    transfer:  { bg: '#E3F2FD', fg: '#1565C0' },
    fun:       { bg: '#E8F5E9', fg: '#2E7D32' },
    edu:       { bg: '#EDE7F6', fg: '#4527A0' },
    // fallback
    default:   { bg: '#F1F2EE', fg: '#5A6360' },
  },
} as const;
