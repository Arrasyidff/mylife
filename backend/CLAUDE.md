# Backend — CLAUDE.md

## Stack

- **Framework**: NestJS 11 + TypeScript
- **Database**: PostgreSQL via Prisma ORM v6
- **Auth**: JWT (`@nestjs/jwt`) + bcrypt untuk hash password
- **Validation**: Zod — selalu gunakan `ValidationService.validate()`, bukan class-validator
- **Logger**: Winston via `nest-winston` — inject `WINSTON_MODULE_NEST_PROVIDER`
- **Port default**: 8000

## Perintah Utama

```bash
# Development (hot-reload)
npm run start:dev

# Build produksi
npm run build && npm run start:prod

# Unit test
npm run test

# E2E test
npm run test:e2e

# Lint + format
npm run lint
npm run format

# Generate Prisma client setelah ubah schema
npx prisma generate

# Migrate database
npx prisma migrate dev --name <nama_migrasi>
```

## Struktur Direktori

```
src/
├── app.module.ts          # Root module, konfigurasi AuthMiddleware global
├── main.ts                # Bootstrap — CORS ke FRONTEND_URL, port dari PORT env
├── auth/                  # Module autentikasi (login, me, change-password)
├── common/
│   ├── common.module.ts   # Global module: ConfigModule, WinstonModule
│   ├── prisma.service.ts  # Singleton Prisma client
│   ├── validation.service.ts  # Wrapper Zod validate()
│   ├── decorators/current-user.decorator.ts
│   └── filters/http-exception.filter.ts
├── generated/prisma/      # AUTO-GENERATED — jangan edit manual
├── health/                # GET /api/health — tidak butuh auth
├── middleware/
│   └── auth.middleware.ts # Verifikasi JWT, inject req.user
└── model/
    ├── auth.model.ts      # Request/Response types untuk auth
    └── web.model.ts       # WebResponse<T> wrapper
```

## Environment Variables

Salin `.env.example` ke `.env`:

| Variable       | Contoh                                              | Keterangan                     |
|----------------|-----------------------------------------------------|--------------------------------|
| `DATABASE_URL` | `postgresql://user:pass@localhost:5432/mylife`      | Koneksi PostgreSQL             |
| `JWT_SECRET`   | `your-secret-key`                                   | Secret untuk sign/verify JWT   |
| `PORT`         | `8000`                                              | Port server                    |
| `FRONTEND_URL` | `http://localhost:3000`                             | Allowed CORS origin            |

## Prisma

- Schema ada di `prisma/schema.prisma` (root backend) — output ke `src/generated/prisma`
- Model: `User`, `ActivityLog`
- Enum: `AksesLevel` (SUPER_ADMIN, ADMIN, VIEWER), `Status` (ACTIVE, INACTIVE)
- Setiap aksi user yang signifikan **wajib** membuat record `ActivityLog`

## Pola Arsitektur

- **Endpoint** butuh auth otomatis via `AuthMiddleware` — kecuali yang di-exclude (`/api/auth/login`, `/api/health`)
- Tambahkan route baru sebagai module NestJS terpisah (`nest generate module nama`)
- Request body divalidasi dengan schema Zod di file `*.validation.ts` masing-masing module
- Respons API selalu dibungkus `WebResponse<T>` → `{ data: T }` atau `{ errors: string }`
- Gunakan Prisma transaction (`$transaction`) jika ada lebih dari satu operasi tulis bersamaan
