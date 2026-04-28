import { api } from '../api';

export type CreateTransactionPayload = {
  recorder: 'SUAMI' | 'ISTRI';
  category: string;
  merchant: string;
  account_id: string;
  to_account_id?: string;
  amount: number;
  date: string;
  type: 'EXPENSE' | 'INCOME' | 'TRANSFER';
  note?: string;
};

export const transactionService = {
  create: (data: CreateTransactionPayload) =>
    api.post('/api/transactions', data),
};
