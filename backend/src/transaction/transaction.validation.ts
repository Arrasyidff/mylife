import { z } from 'zod';
import { FamilyMember, TransactionType } from '../../generated/prisma';

const transactionTypeValues = Object.values(TransactionType) as [TransactionType, ...TransactionType[]];
const familyMemberValues = Object.values(FamilyMember) as [FamilyMember, ...FamilyMember[]];

export const TransactionValidation = {
  CREATE: z
    .object({
      recorder: z.enum(familyMemberValues, { message: 'Recorder tidak valid' }),
      category: z.string().min(1, 'Kategori wajib diisi').max(50),
      merchant: z.string().min(1, 'Merchant wajib diisi').max(200),
      account_id: z.string().uuid('ID rekening tidak valid'),
      to_account_id: z.string().uuid('ID rekening tujuan tidak valid').optional(),
      amount: z.number().positive('Jumlah harus lebih dari 0'),
      date: z.coerce.date({ message: 'Format tanggal tidak valid' }),
      type: z.enum(transactionTypeValues, { message: 'Tipe transaksi tidak valid' }),
      note: z.string().max(1000).optional(),
    })
    .refine((data) => data.type !== TransactionType.TRANSFER || !!data.to_account_id, {
      message: 'Rekening tujuan wajib diisi untuk transfer',
      path: ['to_account_id'],
    })
    .refine(
      (data) =>
        data.type !== TransactionType.TRANSFER ||
        data.account_id !== data.to_account_id,
      {
        message: 'Rekening tujuan tidak boleh sama dengan rekening sumber',
        path: ['to_account_id'],
      },
    ),

  UPDATE: z.object({
    recorder: z.enum(familyMemberValues).optional(),
    category: z.string().min(1).max(50).optional(),
    merchant: z.string().min(1).max(200).optional(),
    account_id: z.string().uuid().optional(),
    to_account_id: z.string().uuid().nullable().optional(),
    amount: z.number().positive().optional(),
    date: z.coerce.date().optional(),
    type: z.enum(transactionTypeValues).optional(),
    note: z.string().max(1000).nullable().optional(),
  }),

  LIST: z.object({
    account_id: z.string().uuid().optional(),
    type: z.enum(transactionTypeValues).optional(),
    recorder: z.enum(familyMemberValues).optional(),
    category: z.string().optional(),
    date_from: z.coerce.date().optional(),
    date_to: z.coerce.date().optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }),
};
