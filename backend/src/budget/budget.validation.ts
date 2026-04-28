import { z } from 'zod';
import { BudgetPeriod } from '../generated/prisma';

const budgetPeriodValues = Object.values(BudgetPeriod) as [BudgetPeriod, ...BudgetPeriod[]];

export const BudgetValidation = {
  CREATE: z.object({
    name: z.string().min(1, 'Nama anggaran wajib diisi').max(100),
    category: z.string().min(1, 'Kategori wajib diisi').max(50),
    total: z.number().positive('Total anggaran harus lebih dari 0'),
    period: z.enum(budgetPeriodValues).optional().default(BudgetPeriod.MONTHLY),
    carry_over: z.boolean().optional().default(false),
    start_date: z.string().datetime({ message: 'Format tanggal tidak valid (ISO 8601)' }),
  }),

  UPDATE: z.object({
    name: z.string().min(1).max(100).optional(),
    category: z.string().min(1).max(50).optional(),
    total: z.number().positive().optional(),
    period: z.enum(budgetPeriodValues).optional(),
    carry_over: z.boolean().optional(),
    start_date: z.string().datetime({ message: 'Format tanggal tidak valid (ISO 8601)' }).optional(),
  }),
};
