export type BudgetPeriod = 'WEEKLY' | 'MONTHLY' | 'YEARLY';
export type StatusFilter = 'all' | 'safe' | 'warn' | 'over';
export type Toast = { msg: string; ok: boolean };

export interface Budget {
  id: string;
  user_id: string;
  name: string;
  category: string;
  total: number;
  period: BudgetPeriod;
  carry_over: boolean;
  start_date: string;
  spent: number;
  remaining: number;
  created_at: string;
  updated_at: string;
}

export interface CreateAnggaranInput {
  name: string;
  category: string;
  total: number;
  period: BudgetPeriod;
  carry_over: boolean;
  start_date: string;
}

export interface UpdateAnggaranInput {
  name?: string;
  category?: string;
  total?: number;
  period?: BudgetPeriod;
  carry_over?: boolean;
  start_date?: string;
}
