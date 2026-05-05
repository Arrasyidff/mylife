import { api } from '@/lib/api';
import type { Budget, CreateAnggaranInput, UpdateAnggaranInput } from '../types';

interface BackendBudgetResponse {
  id: string;
  user_id: string;
  name: string;
  category: string;
  total: string;
  period: string;
  carry_over: boolean;
  start_date: string;
  spent: string;
  remaining: string;
  created_at: string;
  updated_at: string;
}

function toBudget(response: BackendBudgetResponse): Budget {
  return {
    id: response.id,
    user_id: response.user_id,
    name: response.name,
    category: response.category,
    total: parseFloat(response.total),
    period: response.period as Budget['period'],
    carry_over: response.carry_over,
    start_date: response.start_date,
    spent: parseFloat(response.spent),
    remaining: parseFloat(response.remaining),
    created_at: response.created_at,
    updated_at: response.updated_at,
  };
}

export async function listAnggaran(): Promise<Budget[]> {
  const result = await api.get<BackendBudgetResponse[]>('/budgets');
  return result.map(toBudget);
}

export async function createAnggaran(input: CreateAnggaranInput): Promise<Budget> {
  const response = await api.post<BackendBudgetResponse>('/budgets', {
    name: input.name,
    category: input.category,
    total: input.total,
    period: input.period,
    carry_over: input.carry_over,
    start_date: input.start_date,
  });
  return toBudget(response);
}

export async function updateAnggaran(budgetId: string, input: UpdateAnggaranInput): Promise<Budget> {
  const body: Record<string, unknown> = {};
  if (input.name !== undefined) body.name = input.name;
  if (input.category !== undefined) body.category = input.category;
  if (input.total !== undefined) body.total = input.total;
  if (input.period !== undefined) body.period = input.period;
  if (input.carry_over !== undefined) body.carry_over = input.carry_over;
  if (input.start_date !== undefined) body.start_date = input.start_date;

  const response = await api.patch<BackendBudgetResponse>(`/budgets/${budgetId}`, body);
  return toBudget(response);
}

export async function deleteAnggaran(budgetId: string): Promise<void> {
  await api.delete<string>(`/budgets/${budgetId}`);
}
