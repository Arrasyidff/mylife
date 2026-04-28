import { api } from '../api';

export type BudgetPeriod = 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface BudgetResponse {
  id: string;
  user_id: string;
  name: string;
  category: string;
  total: string;
  period: BudgetPeriod;
  carry_over: boolean;
  start_date: string;
  spent: string;
  remaining: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBudgetRequest {
  name: string;
  category: string;
  total: number;
  period?: BudgetPeriod;
  carry_over?: boolean;
  start_date: string;
}

export interface UpdateBudgetRequest {
  name?: string;
  category?: string;
  total?: number;
  period?: BudgetPeriod;
  carry_over?: boolean;
  start_date?: string;
}

export const budgetService = {
  list: () => api.get<BudgetResponse[]>('/api/budgets'),
  create: (data: CreateBudgetRequest) => api.post<BudgetResponse>('/api/budgets', data),
  update: (id: string, data: UpdateBudgetRequest) =>
    api.patch<BudgetResponse>(`/api/budgets/${id}`, data),
  remove: (id: string) => api.delete<string>(`/api/budgets/${id}`),
};
