export type { Transaction } from '@/lib/dashboard-data';

export type TxTypeId = 'expense' | 'income' | 'transfer';
export type TypeFilter = 'all' | TxTypeId;
export type UserFilter = 'all' | 'H' | 'W';
export type MonthFilter = { year: number; month: number } | null;
export type Toast = { msg: string; ok: boolean };
