import { z } from 'zod';

const accountTypeValues = ['tabungan', 'ewallet', 'tunai', 'investasi', 'kartukredit'] as const;

export const createAccountSchema = z.object({
  name: z.string().min(1, 'Nama rekening wajib diisi').max(100),
  type: z.enum(accountTypeValues, { message: 'Tipe rekening tidak valid' }),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Warna harus berformat HEX (#RRGGBB)'),
  balance: z.number().min(0, 'Saldo tidak boleh negatif'),
  account_number: z.string().max(50).optional(),
  subtitle: z.string().max(200),
  glyph: z.string().min(1).max(10),
});

export const updateAccountSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  type: z.enum(accountTypeValues).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  balance: z.number().min(0).optional(),
  account_number: z.string().max(50).nullable().optional(),
  subtitle: z.string().max(200).optional(),
  glyph: z.string().min(1).max(10).optional(),
  hidden: z.boolean().optional(),
});
