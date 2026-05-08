import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedUsers() {
  const hashedPassword = await bcrypt.hash('superadmin123', 10);

  const superadmin = await prisma.user.upsert({
    where: { username: 'superadmin' },
    update: {},
    create: {
      full_name: 'Super Admin',
      username: 'superadmin',
      email: 'superadmin@mylife.com',
      password: hashedPassword,
      access_level: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log(`✔ User seeded: ${superadmin.username} (${superadmin.access_level})`);
}

async function main() {
  console.log('Starting seed...');
  await seedUsers();
  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
