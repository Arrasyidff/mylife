import path from 'node:path';
import { defineConfig } from 'prisma/config';
import { config } from 'dotenv';

config();

export default defineConfig({
  schema: path.join(process.cwd(), 'prisma'),
  migrate: {
    async adapter() {
      const { PrismaPg } = await import('@prisma/adapter-pg');
      return new PrismaPg({ connectionString: process.env.DATABASE_URL });
    },
  },
});
