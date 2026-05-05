export type TxTypeId = 'expense' | 'income' | 'transfer';
export type TypeFilter = 'all' | TxTypeId;
export type UserFilter = 'all' | 'H' | 'W';
export type MonthFilter = { year: number; month: number } | null;
export type Toast = { msg: string; ok: boolean };

export type AccountInfo = {
  name: string;
  color: string;
  glyph: string;
};

export type Transaction = {
  id: number;
  user: 'H' | 'W';
  cat: string;
  merch: string;
  acct: string;
  acct_info?: AccountInfo | null;
  to_account_id?: string | null;
  to_acct_info?: AccountInfo | null;
  amount: number;        // signed: negative for expense/transfer
  date: string;          // ISO datetime: "2026-04-27T09:15:00"
  type: TxTypeId;
  note?: string | null;
};
