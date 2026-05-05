import { api } from '@/lib/api';
import type { Transaction, TxTypeId } from '../types';

type BackendRecorder = 'SUAMI' | 'ISTRI';
type BackendTxType = 'EXPENSE' | 'INCOME' | 'TRANSFER';

interface BackendAccountInfo {
  name: string;
  color: string;
  glyph: string;
}

interface BackendTransactionResponse {
  id: number;
  recorder: BackendRecorder;
  category: string;
  merchant: string;
  account_id: string;
  account: BackendAccountInfo | null;
  to_account_id: string | null;
  to_account: BackendAccountInfo | null;
  amount: string;
  date: string;
  type: BackendTxType;
  note: string | null;
  transfer_group: string | null;
  created_at: string;
  updated_at: string;
}

interface BackendTransactionListResponse {
  transactions: BackendTransactionResponse[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

const RECORDER_TO_USER: Record<BackendRecorder, 'H' | 'W'> = {
  SUAMI: 'H',
  ISTRI: 'W',
};

const USER_TO_RECORDER: Record<'H' | 'W', BackendRecorder> = {
  H: 'SUAMI',
  W: 'ISTRI',
};

const TYPE_TO_BACKEND: Record<TxTypeId, BackendTxType> = {
  expense:  'EXPENSE',
  income:   'INCOME',
  transfer: 'TRANSFER',
};

const TYPE_TO_FRONTEND: Record<BackendTxType, TxTypeId> = {
  EXPENSE:  'expense',
  INCOME:   'income',
  TRANSFER: 'transfer',
};

function toTransaction(response: BackendTransactionResponse): Transaction {
  const type = TYPE_TO_FRONTEND[response.type];
  const absoluteAmount = parseFloat(response.amount);
  const signedAmount = type === 'income' ? absoluteAmount : -absoluteAmount;

  return {
    id:           response.id,
    user:         RECORDER_TO_USER[response.recorder],
    cat:          response.category,
    merch:        response.merchant,
    acct:         response.account_id,
    acct_info:    response.account,
    to_account_id: response.to_account_id,
    to_acct_info: response.to_account,
    amount:       signedAmount,
    date:         response.date.substring(0, 19).replace('Z', ''),
    type,
    note:         response.note,
  };
}

export interface ListTransaksiParams {
  date_from?: string;
  date_to?: string;
  limit?: number;
}

export interface TransaksiListResult {
  transactions: Transaction[];
  total: number;
}

export async function listTransaksi(params?: ListTransaksiParams): Promise<TransaksiListResult> {
  const queryParams: Record<string, string | number | boolean | undefined> = {
    limit: params?.limit ?? 500,
  };

  if (params?.date_from) queryParams.date_from = params.date_from;
  if (params?.date_to)   queryParams.date_to   = params.date_to;

  const result = await api.get<BackendTransactionListResponse>('/transactions', {
    params: queryParams,
  });

  return {
    transactions: result.transactions.map(toTransaction),
    total:        result.total,
  };
}

export interface CreateTransaksiInput {
  user:           'H' | 'W';
  cat:            string;
  merch:          string;
  acct:           string;
  to_account_id?: string;
  amount:         number;   // absolute (positive)
  date:           string;
  type:           TxTypeId;
  note?:          string;
}

export async function createTransaksi(input: CreateTransaksiInput): Promise<Transaction> {
  const response = await api.post<BackendTransactionResponse>('/transactions', {
    recorder:      USER_TO_RECORDER[input.user],
    category:      input.cat,
    merchant:      input.merch,
    account_id:    input.acct,
    to_account_id: input.to_account_id ?? undefined,
    amount:        input.amount,
    date:          input.date,
    type:          TYPE_TO_BACKEND[input.type],
    note:          input.note ?? undefined,
  });

  return toTransaction(response);
}

export interface UpdateTransaksiInput {
  user?:           'H' | 'W';
  cat?:            string;
  merch?:          string;
  acct?:           string;
  to_account_id?:  string | null;
  amount?:         number;   // absolute (positive)
  date?:           string;
  type?:           TxTypeId;
  note?:           string | null;
}

export async function updateTransaksi(transactionId: number, input: UpdateTransaksiInput): Promise<Transaction> {
  const body: Record<string, unknown> = {};

  if (input.user           !== undefined) body.recorder      = USER_TO_RECORDER[input.user];
  if (input.cat            !== undefined) body.category       = input.cat;
  if (input.merch          !== undefined) body.merchant       = input.merch;
  if (input.acct           !== undefined) body.account_id     = input.acct;
  if (input.to_account_id  !== undefined) body.to_account_id  = input.to_account_id;
  if (input.amount         !== undefined) body.amount         = input.amount;
  if (input.date           !== undefined) body.date           = input.date;
  if (input.type           !== undefined) body.type           = TYPE_TO_BACKEND[input.type];
  if (input.note           !== undefined) body.note           = input.note;

  const response = await api.patch<BackendTransactionResponse>(`/transactions/${transactionId}`, body);
  return toTransaction(response);
}

export async function deleteTransaksi(transactionId: number): Promise<void> {
  await api.delete<string>(`/transactions/${transactionId}`);
}
