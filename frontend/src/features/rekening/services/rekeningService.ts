import { api } from '@/lib/api';
import type { Account, AccountType, CreateAccountInput, UpdateAccountInput } from '../types';

type BackendAccountType = 'TABUNGAN' | 'EWALLET' | 'TUNAI' | 'INVESTASI' | 'KARTU_KREDIT';

interface BackendAccountResponse {
  id: string;
  user_id: string;
  name: string;
  subtitle: string | null;
  balance: string;
  color: string;
  glyph: string;
  type: BackendAccountType;
  account_number: string | null;
  hidden: boolean;
  created_at: string;
  updated_at: string;
}

interface BackendAccountListResponse {
  accounts: BackendAccountResponse[];
  total_balance: string;
}

const FRONTEND_TO_BACKEND_TYPE: Record<AccountType, BackendAccountType> = {
  tabungan: 'TABUNGAN',
  ewallet: 'EWALLET',
  tunai: 'TUNAI',
  investasi: 'INVESTASI',
  kartukredit: 'KARTU_KREDIT',
};

const BACKEND_TO_FRONTEND_TYPE: Record<BackendAccountType, AccountType> = {
  TABUNGAN: 'tabungan',
  EWALLET: 'ewallet',
  TUNAI: 'tunai',
  INVESTASI: 'investasi',
  KARTU_KREDIT: 'kartukredit',
};

function toAccount(response: BackendAccountResponse): Account {
  return {
    id: response.id,
    name: response.name,
    subtitle: response.subtitle,
    balance: parseFloat(response.balance),
    color: response.color,
    glyph: response.glyph,
    type: BACKEND_TO_FRONTEND_TYPE[response.type],
    account_number: response.account_number,
    hidden: response.hidden,
  };
}

export interface AccountListResult {
  accounts: Account[];
  totalBalance: number;
}

export async function listAccounts(includeHidden = false): Promise<AccountListResult> {
  const result = await api.get<BackendAccountListResponse>('/accounts', {
    params: { include_hidden: includeHidden },
  });
  return {
    accounts: result.accounts.map(toAccount),
    totalBalance: parseFloat(result.total_balance),
  };
}

export async function createAccount(input: CreateAccountInput): Promise<Account> {
  const response = await api.post<BackendAccountResponse>('/accounts', {
    name: input.name,
    subtitle: input.subtitle,
    balance: input.balance,
    color: input.color,
    glyph: input.glyph,
    type: FRONTEND_TO_BACKEND_TYPE[input.type],
    account_number: input.account_number,
    hidden: false,
  });
  return toAccount(response);
}

export async function updateAccount(accountId: string, input: UpdateAccountInput): Promise<Account> {
  const body: Record<string, unknown> = {};
  if (input.name !== undefined) body.name = input.name;
  if (input.subtitle !== undefined) body.subtitle = input.subtitle;
  if (input.balance !== undefined) body.balance = input.balance;
  if (input.color !== undefined) body.color = input.color;
  if (input.glyph !== undefined) body.glyph = input.glyph;
  if (input.type !== undefined) body.type = FRONTEND_TO_BACKEND_TYPE[input.type];
  if (input.account_number !== undefined) body.account_number = input.account_number;
  if (input.hidden !== undefined) body.hidden = input.hidden;

  const response = await api.patch<BackendAccountResponse>(`/accounts/${accountId}`, body);
  return toAccount(response);
}

export async function deleteAccount(accountId: string): Promise<void> {
  await api.delete<string>(`/accounts/${accountId}`);
}
