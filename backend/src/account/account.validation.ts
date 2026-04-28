import { z } from 'zod';
import { AccountType } from '../generated/prisma';

const accountTypeValues = Object.values(AccountType) as [AccountType, ...AccountType[]];

export const AccountValidation = {
  CREATE: z.object({
    name: z.string().min(1, 'Nama rekening wajib diisi').max(100),
    subtitle: z.string().max(200).optional(),
    balance: z.number().min(0, 'Saldo tidak boleh negatif').optional().default(0),
    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, 'Warna harus berformat HEX (#RRGGBB)'),
    glyph: z.string().min(1, 'Glyph wajib diisi').max(10),
    type: z.enum(accountTypeValues, { message: 'Tipe rekening tidak valid' }),
    account_number: z.string().max(50).optional(),
    hidden: z.boolean().optional().default(false),
  }),

  UPDATE: z.object({
    name: z.string().min(1).max(100).optional(),
    subtitle: z.string().max(200).nullable().optional(),
    balance: z.number().min(0).optional(),
    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, 'Warna harus berformat HEX (#RRGGBB)')
      .optional(),
    glyph: z.string().min(1).max(10).optional(),
    type: z.enum(accountTypeValues).optional(),
    account_number: z.string().max(50).nullable().optional(),
    hidden: z.boolean().optional(),
  }),
};
