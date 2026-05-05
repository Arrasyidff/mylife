import { api } from '@/lib/api';

export type ReportPeriod = 'WEEKLY' | 'MONTHLY' | 'YEARLY';

interface BackendCategoryStat {
  category: string;
  total: string;
  suami: string;
  istri: string;
}

interface BackendChartDataPoint {
  key: string;
  suami: number;
  istri: number;
}

interface BackendBiggestTransaction {
  id: number;
  merchant: string;
  amount: string;
  date: string;
  category: string;
}

interface BackendTopCategory {
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
  top_category: BackendTopCategory | null;
  biggest_transaction: BackendBiggestTransaction | null;
  categories: BackendCategoryStat[];
  chart_data: BackendChartDataPoint[];
}

export interface MonthComparisonRow {
  year: number;
  month: number;
  label: string;
  income: string;
  expense: string;
  net: string;
  savings_rate: number;
}

export interface MonthlyComparisonResponse {
  months: MonthComparisonRow[];
}

export interface ReportSummaryParams {
  period: ReportPeriod;
  year?: number;
  month?: number;
}

export interface MonthlyComparisonParams {
  months?: number;
  year?: number;
  month?: number;
}

export async function getLaporanSummary(params: ReportSummaryParams): Promise<ReportSummaryResponse> {
  return api.get<ReportSummaryResponse>('/reports/summary', {
    params: params as unknown as Record<string, string | number | boolean | undefined>,
  });
}

export async function getMonthlyComparison(params: MonthlyComparisonParams): Promise<MonthlyComparisonResponse> {
  return api.get<MonthlyComparisonResponse>('/reports/monthly-comparison', {
    params: params as unknown as Record<string, string | number | boolean | undefined>,
  });
}
