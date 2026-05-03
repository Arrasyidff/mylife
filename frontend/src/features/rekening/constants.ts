import { T } from '@/lib/tokens';
import type { AccountType } from './types';

export const GROUP_CONFIG = [
  { label: 'TABUNGAN',     types: ['tabungan']    as const, color: T.info,    tint: T.infoLight    },
  { label: 'E-WALLET',     types: ['ewallet']     as const, color: T.primary, tint: T.primaryLight },
  { label: 'TUNAI',        types: ['tunai']        as const, color: T.warning, tint: T.warningLight },
  { label: 'INVESTASI',    types: ['investasi']   as const, color: '#5C815B', tint: '#EDF4EC'      },
  { label: 'KARTU KREDIT', types: ['kartukredit'] as const, color: T.danger,  tint: T.dangerLight  },
];

export const ACCOUNT_TYPES: { id: AccountType; label: string; hint: string }[] = [
  { id: 'tabungan',    label: 'Tabungan',     hint: 'Rekening bank biasa'     },
  { id: 'ewallet',     label: 'E-Wallet',     hint: 'Gopay, OVO, Dana, dll.'  },
  { id: 'tunai',       label: 'Tunai',        hint: 'Uang fisik / dompet'     },
  { id: 'investasi',   label: 'Investasi',    hint: 'Saham, reksa dana, dll.' },
  { id: 'kartukredit', label: 'Kartu Kredit', hint: 'Saldo = utang'           },
];

export const COLORS = [
  '#1565C0', '#003D79', '#00A6E2', '#5C815B',
  '#1D9E75', '#D4860B', '#C0392B', '#7B1FA2',
  '#1846A8', '#E65100', '#2E7D32', '#4527A0',
];

export const BALANCE_PRESETS = [0, 500_000, 1_000_000, 5_000_000, 10_000_000, 20_000_000];
