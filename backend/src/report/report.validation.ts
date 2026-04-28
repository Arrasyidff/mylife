import { z } from 'zod';

export const ReportValidation = {
  SUMMARY: z.object({
    period: z.enum(['WEEKLY', 'MONTHLY', 'YEARLY']),
    year: z.coerce.number().int().min(2000).max(2100).optional(),
    month: z.coerce.number().int().min(1).max(12).optional(),
  }).refine(
    (d) => d.period !== 'MONTHLY' || (d.year !== undefined && d.month !== undefined),
    { message: 'year dan month wajib diisi untuk periode MONTHLY', path: ['month'] },
  ).refine(
    (d) => d.period !== 'YEARLY' || d.year !== undefined,
    { message: 'year wajib diisi untuk periode YEARLY', path: ['year'] },
  ),

  MONTHLY_COMPARISON: z.object({
    months: z.coerce.number().int().min(1).max(24).optional().default(3),
    year: z.coerce.number().int().min(2000).max(2100).optional(),
    month: z.coerce.number().int().min(1).max(12).optional(),
  }),
};
