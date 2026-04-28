import { api } from '../api';

export type DashboardAccountItem = {
  id: string;
  name: string;
  subtitle: string | null;
  balance: string;
  color: string;
  glyph: string;
  type: string;
};

export type DashboardTransactionItem = {
  id: number;
  recorder: string;
  category: string;
  merchant: string;
  amount: string;
  date: string;
  type: string;
  note: string | null;
  account_name: string;
};

export type DashboardBudgetItem = {
  id: string;
  name: string;
  category: string;
  total: string;
  spent: string;
  remaining: string;
  percentage_used: number;
  period: string;
};

export type DashboardTopCategory = {
  category: string;
  total: string;
  percentage: number;
};

export type DashboardMonthlySummary = {
  year: number;
  month: number;
  total_income: string;
  total_expense: string;
  net: string;
  savings_rate: number;
};

export type DashboardApiResponse = {
  total_balance: string;
  total_accounts: number;
  monthly_summary: DashboardMonthlySummary;
  accounts: DashboardAccountItem[];
  recent_transactions: DashboardTransactionItem[];
  budget_overview: DashboardBudgetItem[];
  top_categories: DashboardTopCategory[];
};

export const dashboardService = {
  get: () => api.get<DashboardApiResponse>('/api/dashboard'),
};
