import { z } from 'zod';

export const AuthValidation = {
  LOGIN: z.object({
    username: z.string().min(1, 'Username wajib diisi'),
    password: z.string().min(1, 'Password wajib diisi'),
  }),

  CHANGE_PASSWORD: z.object({
    old_password: z.string().min(6, 'Password lama minimal 6 karakter'),
    new_password: z.string().min(6, 'Password baru minimal 6 karakter'),
  }),
};
