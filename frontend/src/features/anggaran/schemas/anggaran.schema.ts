import { z } from 'zod';

const budgetPeriodValues = ['WEEKLY', 'MONTHLY', 'YEARLY'] as const;

export const createAnggaranSchema = z.object({
  name: z.string().min(1, 'Nama anggaran wajib diisi').max(100),
  category: z.string().min(1, 'Kategori wajib diisi'),
  total: z.number().positive('Total anggaran harus lebih dari 0'),
  period: z.enum(budgetPeriodValues).default('MONTHLY'),
  carry_over: z.boolean().default(false),
  start_date: z.string().datetime({ message: 'Format tanggal tidak valid' }),
});

export const updateAnggaranSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  category: z.string().min(1).optional(),
  total: z.number().positive().optional(),
  period: z.enum(budgetPeriodValues).optional(),
  carry_over: z.boolean().optional(),
  start_date: z.string().datetime({ message: 'Format tanggal tidak valid' }).optional(),
});

export type CreateAnggaranFormInput = z.infer<typeof createAnggaranSchema>;
export type UpdateAnggaranFormInput = z.infer<typeof updateAnggaranSchema>;
