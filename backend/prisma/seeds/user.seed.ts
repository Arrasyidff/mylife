import { PrismaClient, AksesLevel, Status } from '../../generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import * as bcrypt from 'bcrypt'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter })

const users = [
  {
    full_name: 'Super Admin',
    username: 'superadmin',
    email: 'superadmin@bumdes-tugumas.com',
    password: 'superadmin123',
    access_level: AksesLevel.SUPER_ADMIN,
    position: 'Ketua',
    phone_number: '081234567890',
    address: 'Desa Tugu Mas, Kec. Cempaka Putih, Jakarta Pusat',
    status: Status.ACTIVE,
  },
  {
    full_name: 'Admin BUMDes',
    username: 'admin',
    email: 'admin@bumdes-tugumas.com',
    password: 'admin123',
    access_level: AksesLevel.ADMIN,
    position: 'Bendahara',
    phone_number: '082345678901',
    address: 'Desa Tugu Mas, Kec. Cempaka Putih, Jakarta Pusat',
    status: Status.ACTIVE,
  },
  {
    full_name: 'Viewer BUMDes',
    username: 'viewer',
    email: 'viewer@bumdes-tugumas.com',
    password: 'viewer123',
    access_level: AksesLevel.VIEWER,
    position: 'Anggota',
    phone_number: '083456789012',
    address: 'Desa Tugu Mas, Kec. Cempaka Putih, Jakarta Pusat',
    status: Status.ACTIVE,
  },
]

async function seedUsers() {
  console.log('Seeding users...')

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10)

    await prisma.user.upsert({
      where: { username: user.username },
      update: {},
      create: {
        ...user,
        password: hashedPassword,
      },
    })

    console.log(`✓ User "${user.username}" (${user.access_level}) seeded`)
  }

  console.log('Users seeding completed.')
}

seedUsers()
  .catch((e) => {
    console.error('Error seeding users:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
