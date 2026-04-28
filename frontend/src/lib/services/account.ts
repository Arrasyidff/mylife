import { api } from '@/lib/api';
import type { Account, AccountType } from '@/lib/dashboard-data';

type AccountApiResponse = {
  id: string;
  user_id: string;
  name: string;
  subtitle: string | null;
  balance: string;
  color: string;
  glyph: string;
  type: AccountType;
  account_number: string | null;
  hidden: boolean;
  created_at: string;
  updated_at: string;
};

type AccountListApiResponse = {
  accounts: AccountApiResponse[];
  total_balance: string;
};

function mapToAccount(a: AccountApiResponse): Account {
  return {
    id: a.id,
    name: a.name,
    subtitle: a.subtitle ?? '',
    balance: parseFloat(a.balance),
    color: a.color,
    glyph: a.glyph,
    type: a.type,
    hidden: a.hidden,
  };
}

export type CreateAccountPayload = {
  name: string;
  subtitle?: string;
  balance?: number;
  color: string;
  glyph: string;
  type: AccountType;
  account_number?: string;
};

export type UpdateAccountPayload = Partial<{
  name: string;
  subtitle: string;
  balance: number;
  color: string;
  glyph: string;
  type: AccountType;
  account_number: string;
  hidden: boolean;
}>;

export const accountService = {
  async list(includeHidden = true): Promise<{ accounts: Account[]; total_balance: number }> {
    const data = await api.get<AccountListApiResponse>('/api/accounts', {
      params: { include_hidden: includeHidden },
    });
    return {
      accounts: data.accounts.map(mapToAccount),
      total_balance: parseFloat(data.total_balance),
    };
  },

  async create(payload: CreateAccountPayload): Promise<Account> {
    const data = await api.post<AccountApiResponse>('/api/accounts', payload);
    return mapToAccount(data);
  },

  async update(id: string, payload: UpdateAccountPayload): Promise<Account> {
    const data = await api.patch<AccountApiResponse>(`/api/accounts/${id}`, payload);
    return mapToAccount(data);
  },

  async remove(id: string): Promise<void> {
    await api.delete<string>(`/api/accounts/${id}`);
  },
};
