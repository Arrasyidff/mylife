export type AccountType = 'tabungan' | 'ewallet' | 'tunai' | 'investasi' | 'kartukredit';

export interface Account {
  id: string;
  name: string;
  subtitle: string | null;
  balance: number;
  color: string;
  glyph: string;
  type: AccountType;
  account_number?: string | null;
  hidden?: boolean;
}

export interface CreateAccountInput {
  name: string;
  type: AccountType;
  color: string;
  balance: number;
  account_number?: string;
  subtitle: string;
  glyph: string;
}

export interface UpdateAccountInput {
  name?: string;
  type?: AccountType;
  color?: string;
  balance?: number;
  account_number?: string | null;
  subtitle?: string;
  glyph?: string;
  hidden?: boolean;
}

export type { Transaction } from '@/lib/dashboard-data';
