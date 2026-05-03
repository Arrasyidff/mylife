import { BudgetPeriod } from '../../generated/prisma';

export class CreateBudgetRequest {
  name: string;
  category: string;
  total: number;
  period?: BudgetPeriod;
  carry_over?: boolean;
  start_date: string;
}

export class UpdateBudgetRequest {
  name?: string;
  category?: string;
  total?: number;
  period?: BudgetPeriod;
  carry_over?: boolean;
  start_date?: string;
}

export class BudgetResponse {
  id: string;
  user_id: string;
  name: string;
  category: string;
  total: string;
  period: BudgetPeriod;
  carry_over: boolean;
  start_date: Date;
  spent: string;
  remaining: string;
  created_at: Date;
  updated_at: Date;
}
