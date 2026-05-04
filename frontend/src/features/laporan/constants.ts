import type { MonthRow } from './types';

export const TODAY = new Date(2026, 3, 27);

export const PERIODS = ['Mingguan', 'Bulanan', 'Tahunan'] as const;

export const MONTH_SHORT = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
export const MONTH_FULL  = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
export const DAY_SHORT   = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];

export const CAT_COLORS: Record<string, string> = {
  food: '#C24A1B', transport: '#1E5BB8', shopping: '#7036A6',
  bills: '#A66A0E', health: '#C0392B', home: '#5C815B', fun: '#A82672', edu: '#2E7D32',
};

export const CAT_LABEL: Record<string, string> = {
  food: 'Makanan', transport: 'Transportasi', shopping: 'Belanja',
  bills: 'Tagihan', health: 'Kesehatan', home: 'Rumah', fun: 'Hiburan', edu: 'Pendidikan',
};

export const MONTH_HISTORY: MonthRow[] = [
  { m: 'Feb 2026', income: 14_200_000, expense: 8_950_000,  idx: 1 },
  { m: 'Mar 2026', income: 14_500_000, expense: 10_120_000, idx: 2 },
];
