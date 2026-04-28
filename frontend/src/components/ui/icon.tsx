import type { ReactNode, CSSProperties } from 'react';

type Opts = { sw?: number; style?: CSSProperties };

function ico(size: number, paths: ReactNode, opts: Opts = {}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={opts.sw ?? 1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={opts.style}
    >
      {paths}
    </svg>
  );
}

export const Icon = {
  // Nav
  home: (s = 20) => ico(s, <>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5 10.5V20h14v-9.5" />
    <path d="M10 20v-5h4v5" />
  </>),
  list: (s = 20) => ico(s, <>
    <path d="M8 6h12M8 12h12M8 18h12" />
    <circle cx="4" cy="6"  r="1" />
    <circle cx="4" cy="12" r="1" />
    <circle cx="4" cy="18" r="1" />
  </>),
  budget: (s = 20) => ico(s, <>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 4v8l5 3" />
  </>),
  reports: (s = 20) => ico(s, <>
    <path d="M4 20h16" />
    <rect x="6"  y="11" width="3" height="9" rx="1" />
    <rect x="11" y="6"  width="3" height="14" rx="1" />
    <rect x="16" y="14" width="3" height="6" rx="1" />
  </>),
  settings: (s = 20) => ico(s, <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
  </>),
  // Actions
  plus: (s = 20) => ico(s, <>
    <path d="M12 5v14M5 12h14" />
  </>),
  search: (s = 18) => ico(s, <>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </>),
  filter: (s = 18) => ico(s, <>
    <path d="M3 5h18M6 12h12M10 19h4" />
  </>),
  bell: (s = 18) => ico(s, <>
    <path d="M6 8a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </>),
  chev: (s = 16, dir: 'down' | 'up' | 'left' | 'right' = 'down') => {
    const r = { down: 0, up: 180, left: 90, right: -90 }[dir];
    return ico(s, <path d="M6 9l6 6 6-6" />, { style: { transform: `rotate(${r}deg)` } });
  },
  arrowDown: (s = 14) => ico(s, <>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </>),
  arrowUp: (s = 14) => ico(s, <>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </>),
  arrowLR: (s = 14) => ico(s, <>
    <path d="M3 8h18M17 4l4 4-4 4" />
    <path d="M21 16H3M7 12l-4 4 4 4" />
  </>),
  warn: (s = 16) => ico(s, <>
    <path d="M10.3 3.7 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v5" />
    <circle cx="12" cy="17.5" r=".8" fill="currentColor" />
  </>),
  check: (s = 14) => ico(s, <path d="m4 12 5 5L20 6" />),
  close: (s = 16) => ico(s, <path d="M6 6l12 12M6 18 18 6" />),
  more: (s = 18) => ico(s, <>
    <circle cx="5"  cy="12" r="1.2" fill="currentColor" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    <circle cx="19" cy="12" r="1.2" fill="currentColor" />
  </>),
  calendar: (s = 16) => ico(s, <>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </>),
  edit: (s = 16) => ico(s, <>
    <path d="M14 4l6 6-11 11H3v-6Z" />
    <path d="M13 5l6 6" />
  </>),
  download: (s = 16) => ico(s, <>
    <path d="M12 4v12M6 11l6 6 6-6" />
    <path d="M4 21h16" />
  </>),
  rekening: (s = 20) => ico(s, <>
    <rect x="2" y="6" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
    <path d="M6 14h.01M10 14h4" />
  </>),
};

export const CatIcon = {
  food: (s = 18) => ico(s, <>
    <path d="M4 4v8a4 4 0 0 0 8 0V4" />
    <path d="M8 4v6" />
    <path d="M16 4c0 4 4 4 4 8s-2 4-4 4" />
    <path d="M16 16v4" />
  </>),
  transport: (s = 18) => ico(s, <>
    <rect x="4" y="6" width="16" height="11" rx="2" />
    <circle cx="8"  cy="17.5" r="1.5" />
    <circle cx="16" cy="17.5" r="1.5" />
    <path d="M4 12h16" />
  </>),
  shopping: (s = 18) => ico(s, <>
    <path d="M5 7h14l-1.5 12a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7Z" />
    <path d="M9 7a3 3 0 0 1 6 0" />
  </>),
  bills: (s = 18) => ico(s, <>
    <path d="M5 3h11l3 3v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    <path d="M8 12h8M8 16h6M8 8h4" />
  </>),
  health: (s = 18) => ico(s, <>
    <path d="M12 21s-7-4.5-7-10a4.5 4.5 0 0 1 7-3.7A4.5 4.5 0 0 1 19 11c0 5.5-7 10-7 10Z" />
  </>),
  home: (s = 18) => ico(s, <>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5 10.5V20h14v-9.5" />
  </>),
  salary: (s = 18) => ico(s, <>
    <rect x="3" y="6" width="18" height="13" rx="2" />
    <circle cx="12" cy="12.5" r="3" />
    <path d="M7 9.5h.01M17 15.5h.01" />
  </>),
  transfer: (s = 18) => ico(s, <>
    <path d="M4 8h14l-3-3M20 16H6l3 3" />
  </>),
  fun: (s = 18) => ico(s, <>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 10v.01M15 10v.01" />
    <path d="M8.5 14.5c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8" />
  </>),
  edu: (s = 18) => ico(s, <>
    <path d="M2 8 12 4l10 4-10 4Z" />
    <path d="M6 10v6c0 1.5 3 3 6 3s6-1.5 6-3v-6" />
  </>),
};
