import { api } from '@/lib/api';
import type { Transaction } from '@/lib/dashboard-data';

export type FamilyMember = 'SUAMI' | 'ISTRI';
export type TransactionType = 'EXPENSE' | 'INCOME' | 'TRANSFER';

const TYPE_TO_BACKEND: Record<Transaction['type'], TransactionType> = {
  expense: 'EXPENSE',
  income: 'INCOME',
  transfer: 'TRANSFER',
};

const TYPE_TO_FRONTEND: Record<TransactionType, Transaction['type']> = {
  EXPENSE: 'expense',
  INCOME: 'income',
  TRANSFER: 'transfer',
};

const RECORDER_TO_BACKEND: Record<Transaction['user'], FamilyMember> = {
  H: 'SUAMI',
  W: 'ISTRI',
};

const RECORDER_TO_FRONTEND: Record<FamilyMember, Transaction['user']> = {
  SUAMI: 'H',
  ISTRI: 'W',
};

export interface TransactionAccountInfo {
  name: string;
  color: string;
  glyph: string;
}

export interface TransactionApiResponse {
  id: number;
  recorder: FamilyMember;
  category: string;
  merchant: string;
  account_id: string;
  account: TransactionAccountInfo | null;
  to_account_id: string | null;
  to_account: TransactionAccountInfo | null;
  amount: string;
  date: string;
  type: TransactionType;
  note: string | null;
  transfer_group: string | null;
  created_at: string;
  updated_at: string;
}

export interface TransactionListApiResponse {
  transactions: TransactionApiResponse[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface TransactionListFilters {
  account_id?: string;
  type?: TransactionType;
  recorder?: FamilyMember;
  category?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}

export interface CreateTransactionPayload {
  recorder: FamilyMember;
  category: string;
  merchant: string;
  account_id: string;
  to_account_id?: string;
  amount: number;
  date: string;
  type: TransactionType;
  note?: string;
}

export interface UpdateTransactionPayload {
  recorder?: FamilyMember;
  category?: string;
  merchant?: string;
  account_id?: string;
  to_account_id?: string | null;
  amount?: number;
  date?: string;
  type?: TransactionType;
  note?: string | null;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** Convert API ISO date (UTC) → frontend local datetime string "2026-04-27T09:15:00" */
function toLocalIso(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/** Map backend transaction → frontend Transaction shape used across the UI. */
export function mapToTransaction(t: TransactionApiResponse): Transaction {
  const type = TYPE_TO_FRONTEND[t.type];
  const amount = parseFloat(t.amount);
  const sign = type === 'income' ? 1 : -1;
  return {
    id: t.id,
    user: RECORDER_TO_FRONTEND[t.recorder],
    cat: t.category,
    merch: t.merchant,
    acct: t.account_id,
    toAcct: t.to_account_id ?? undefined,
    amount: sign * amount,
    date: toLocalIso(t.date),
    type,
    note: t.note ?? undefined,
  };
}

/** Build a backend Create payload from a frontend (modal-produced) Transaction draft. */
export function toCreatePayload(tx: Omit<Transaction, 'id'>): CreateTransactionPayload {
  return {
    recorder: RECORDER_TO_BACKEND[tx.user],
    category: tx.cat,
    merchant: tx.merch,
    account_id: tx.acct,
    ...(tx.type === 'transfer' && tx.toAcct ? { to_account_id: tx.toAcct } : {}),
    amount: Math.abs(tx.amount),
    date: tx.date,
    type: TYPE_TO_BACKEND[tx.type],
    ...(tx.note ? { note: tx.note } : {}),
  };
}

/** Build a backend Update payload from a frontend (modal-produced) Transaction. */
export function toUpdatePayload(tx: Transaction): UpdateTransactionPayload {
  return {
    recorder: RECORDER_TO_BACKEND[tx.user],
    category: tx.cat,
    merchant: tx.merch,
    account_id: tx.acct,
    to_account_id: tx.type === 'transfer' ? (tx.toAcct ?? null) : null,
    amount: Math.abs(tx.amount),
    date: tx.date,
    type: TYPE_TO_BACKEND[tx.type],
    note: tx.note ?? null,
  };
}

function toQueryParams(filters?: TransactionListFilters): Record<string, string | number | boolean | undefined> | undefined {
  if (!filters) return undefined;
  return {
    account_id: filters.account_id,
    type: filters.type,
    recorder: filters.recorder,
    category: filters.category,
    date_from: filters.date_from,
    date_to: filters.date_to,
    page: filters.page,
    limit: filters.limit,
  };
}

export const transactionService = {
  list: (filters?: TransactionListFilters) =>
    api.get<TransactionListApiResponse>('/api/transactions', { params: toQueryParams(filters) }),

  /** Fetch all pages for a given filter set. Use sparingly for large datasets. */
  async listAll(
    filters?: Omit<TransactionListFilters, 'page' | 'limit'>,
  ): Promise<TransactionApiResponse[]> {
    const all: TransactionApiResponse[] = [];
    let page = 1;
    const limit = 100;
    // safety cap to prevent runaway loops
    for (let i = 0; i < 50; i++) {
      const result = await api.get<TransactionListApiResponse>('/api/transactions', {
        params: toQueryParams({ ...filters, page, limit }),
      });
      all.push(...result.transactions);
      if (page >= result.total_pages || result.transactions.length === 0) break;
      page++;
    }
    return all;
  },

  get: (id: number) => api.get<TransactionApiResponse>(`/api/transactions/${id}`),

  create: (data: CreateTransactionPayload) =>
    api.post<TransactionApiResponse>('/api/transactions', data),

  update: (id: number, data: UpdateTransactionPayload) =>
    api.patch<TransactionApiResponse>(`/api/transactions/${id}`, data),

  remove: (id: number) => api.delete<string>(`/api/transactions/${id}`),
};
