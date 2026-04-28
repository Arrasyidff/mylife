export class ReportSummaryRequest {
  period: 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  year?: number;
  month?: number; // 1–12
}

export class MonthlyComparisonRequest {
  months?: number; // default 3
  year?: number;
  month?: number; // 1–12
}

export class CategoryStat {
  category: string;
  total: string;
  suami: string;
  istri: string;
}

export class ChartDataPoint {
  key: string;
  suami: number;
  istri: number;
}

export class BiggestTransaction {
  id: number;
  merchant: string;
  amount: string;
  date: Date;
  category: string;
}

export class TopCategory {
  category: string;
  total: string;
}

export class ReportSummaryResponse {
  date_from: Date;
  date_to: Date;
  total_income: string;
  total_expense: string;
  net: string;
  avg_daily_expense: string;
  total_days: number;
  days_without_spending: number;
  by_recorder: { SUAMI: string; ISTRI: string };
  top_category: TopCategory | null;
  biggest_transaction: BiggestTransaction | null;
  categories: CategoryStat[];
  chart_data: ChartDataPoint[];
}

export class MonthRow {
  year: number;
  month: number; // 1–12
  label: string; // "Apr 2026"
  income: string;
  expense: string;
  net: string;
  savings_rate: number;
}

export class MonthlyComparisonResponse {
  months: MonthRow[];
}
