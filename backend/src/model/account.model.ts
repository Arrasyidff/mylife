import { AccountType } from '../generated/prisma';

export class CreateAccountRequest {
  name: string;
  subtitle?: string;
  balance?: number;
  color: string;
  glyph: string;
  type: AccountType;
  account_number?: string;
  hidden?: boolean;
}

export class UpdateAccountRequest {
  name?: string;
  subtitle?: string;
  balance?: number;
  color?: string;
  glyph?: string;
  type?: AccountType;
  account_number?: string;
  hidden?: boolean;
}

export class AccountResponse {
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
  created_at: Date;
  updated_at: Date;
}

export class AccountListResponse {
  accounts: AccountResponse[];
  total_balance: string;
}
