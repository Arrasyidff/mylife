import { FamilyMember, TransactionType } from '../generated/prisma';

export class CreateTransactionRequest {
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

export class UpdateTransactionRequest {
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

export class TransactionAccountInfo {
  name: string;
  color: string;
  glyph: string;
}

export class TransactionResponse {
  id: number;
  recorder: FamilyMember;
  category: string;
  merchant: string;
  account_id: string;
  account: TransactionAccountInfo | null;
  to_account_id: string | null;
  to_account: TransactionAccountInfo | null;
  amount: string;
  date: Date;
  type: TransactionType;
  note: string | null;
  transfer_group: string | null;
  created_at: Date;
  updated_at: Date;
}

export class TransactionListRequest {
  account_id?: string;
  type?: TransactionType;
  recorder?: FamilyMember;
  category?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}

export class TransactionListResponse {
  transactions: TransactionResponse[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
