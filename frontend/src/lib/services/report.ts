import { api } from '@/lib/api';

export type ReportPeriod = 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface ReportSummaryParams {
  period: ReportPeriod;
  year?: number;
  month?: number; // 1–12
}

export interface CategoryStat {
  category: string;
  total: string;
  suami: string;
  istri: string;
}

export interface ChartDataPoint {
  key: string;
  suami: number;
  istri: number;
}

export interface BiggestTransaction {
  id: number;
  merchant: string;
  amount: string;
  date: string;
  category: string;
}

export interface TopCategory {
  category: string;
  total: string;
}

export interface ReportSummaryResponse {
  date_from: string;
  date_to: string;
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

export interface MonthlyComparisonParams {
  months?: number; // default 3
  year?: number;
  month?: number; // 1–12
}

export interface MonthRow {
  year: number;
  month: number; // 1–12
  label: string;
  income: string;
  expense: string;
  net: string;
  savings_rate: number;
}

export interface MonthlyComparisonResponse {
  months: MonthRow[];
}

function toQueryParams(
  params: Record<string, string | number | undefined>,
): Record<string, string | number | boolean | undefined> {
  return params;
}

export const reportService = {
  summary: (params: ReportSummaryParams) =>
    api.get<ReportSummaryResponse>('/api/reports/summary', {
      params: toQueryParams({
        period: params.period,
        year: params.year,
        month: params.month,
      }),
    }),

  monthlyComparison: (params: MonthlyComparisonParams = {}) =>
    api.get<MonthlyComparisonResponse>('/api/reports/monthly-comparison', {
      params: toQueryParams({
        months: params.months,
        year: params.year,
        month: params.month,
      }),
    }),
};
