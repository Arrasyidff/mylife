export type BackendAccountType = 'TABUNGAN' | 'EWALLET' | 'TUNAI' | 'INVESTASI' | 'KARTU_KREDIT';
export type BackendTxType = 'EXPENSE' | 'INCOME' | 'TRANSFER';
export type BackendRecorder = 'SUAMI' | 'ISTRI';

export interface DashboardApiAccount {
  id: string;
  name: string;
  subtitle: string | null;
  balance: string;
  color: string;
  glyph: string;
  type: BackendAccountType;
}

export interface DashboardApiMonthlySummary {
  year: number;
  month: number;
  total_income: string;
  total_expense: string;
  net: string;
  savings_rate: number;
}

export interface DashboardApiBudgetItem {
  id: string;
  name: string;
  category: string;
  total: string;
  spent: string;
  remaining: string;
  percentage_used: number;
  period: string;
}

export interface DashboardApiTransaction {
  id: number;
  recorder: BackendRecorder;
  category: string;
  merchant: string;
  account_id: string;
  amount: string;
  date: string;
  type: BackendTxType;
  note: string | null;
  account_name: string;
}

export interface DashboardApiTopCategory {
  category: string;
  total: string;
  percentage: number;
}

export interface DashboardApiResponse {
  total_balance: string;
  total_accounts: number;
  monthly_summary: DashboardApiMonthlySummary;
  accounts: DashboardApiAccount[];
  recent_transactions: DashboardApiTransaction[];
  budget_overview: DashboardApiBudgetItem[];
  top_categories: DashboardApiTopCategory[];
}

export interface DashboardBudget {
  id: string;
  name: string;
  used: number;
  total: number;
  cat: string;
  period: string;
}

export type Toast = { msg: string; ok: boolean };
export type MonthOption = { value: string; label: string };
