import { api } from '@/lib/api';
import type { Account, AccountType } from '@/lib/dashboard-data';

// Backend uses Prisma enum values (uppercase), frontend uses lowercase
const BACKEND_TO_FRONTEND_TYPE: Record<string, AccountType> = {
  TABUNGAN:    'tabungan',
  EWALLET:     'ewallet',
  TUNAI:       'tunai',
  INVESTASI:   'investasi',
  KARTU_KREDIT: 'kartukredit',
};

const FRONTEND_TO_BACKEND_TYPE: Record<AccountType, string> = {
  tabungan:    'TABUNGAN',
  ewallet:     'EWALLET',
  tunai:       'TUNAI',
  investasi:   'INVESTASI',
  kartukredit: 'KARTU_KREDIT',
};

type AccountApiResponse = {
  id: string;
  user_id: string;
  name: string;
  subtitle: string | null;
  balance: string;
  color: string;
  glyph: string;
  type: string;
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
    type: BACKEND_TO_FRONTEND_TYPE[a.type] ?? (a.type as AccountType),
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
    const data = await api.post<AccountApiResponse>('/api/accounts', {
      ...payload,
      type: FRONTEND_TO_BACKEND_TYPE[payload.type],
    });
    return mapToAccount(data);
  },

  async update(id: string, payload: UpdateAccountPayload): Promise<Account> {
    const body = {
      ...payload,
      ...(payload.type ? { type: FRONTEND_TO_BACKEND_TYPE[payload.type] } : {}),
    };
    const data = await api.patch<AccountApiResponse>(`/api/accounts/${id}`, body);
    return mapToAccount(data);
  },

  async remove(id: string): Promise<void> {
    await api.delete<string>(`/api/accounts/${id}`);
  },
};
