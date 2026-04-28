export class DashboardAccountItem {
  id: string;
  name: string;
  subtitle: string | null;
  balance: string;
  color: string;
  glyph: string;
  type: string;
}

export class DashboardMonthlySummary {
  year: number;
  month: number;
  total_income: string;
  total_expense: string;
  net: string;
  savings_rate: number;
}

export class DashboardBudgetItem {
  id: string;
  name: string;
  category: string;
  total: string;
  spent: string;
  remaining: string;
  percentage_used: number;
  period: string;
}

export class DashboardTransactionItem {
  id: number;
  recorder: string;
  category: string;
  merchant: string;
  amount: string;
  date: Date;
  type: string;
  note: string | null;
  account_name: string;
}

export class DashboardTopCategory {
  category: string;
  total: string;
  percentage: number;
}

export class DashboardResponse {
  total_balance: string;
  total_accounts: number;
  monthly_summary: DashboardMonthlySummary;
  accounts: DashboardAccountItem[];
  recent_transactions: DashboardTransactionItem[];
  budget_overview: DashboardBudgetItem[];
  top_categories: DashboardTopCategory[];
}
