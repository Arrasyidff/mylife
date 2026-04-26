# Dokumentasi Proyek — MyLife

## Gambaran Umum

**MyLife** adalah aplikasi manajemen internal berbasis web dengan arsitektur fullstack terpisah:

- **Backend**: REST API (NestJS) — berjalan di port `8000`
- **Frontend**: Web App (Next.js) — berjalan di port `3000`

---

## Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                      Browser                            │
│              Next.js Frontend (:3000)                   │
│                                                         │
│  AuthContext ─► api.ts (fetch + Bearer token)           │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP / REST
                        ▼
┌─────────────────────────────────────────────────────────┐
│              NestJS Backend (:8000)                     │
│                                                         │
│  AuthMiddleware ─► Controller ─► Service ─► Prisma      │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
               PostgreSQL Database
```

---

## Cara Menjalankan

### Prasyarat

- Node.js >= 20
- PostgreSQL (lokal atau Docker)

### 1. Setup Backend

```bash
cd backend
cp .env.example .env
# Edit .env — isi DATABASE_URL dan JWT_SECRET

npm install
npx prisma migrate dev
npm run start:dev
```

Backend berjalan di `http://localhost:8000`.

### 2. Setup Frontend

```bash
cd frontend
cp .env.example .env.local
# Edit .env.local — set NEXT_PUBLIC_USE_MOCK=false untuk koneksi ke backend nyata

npm install
npm run dev
```

Frontend berjalan di `http://localhost:3000`.

---

## API Endpoints

Base URL: `http://localhost:8000`

### Auth

| Method | Endpoint                | Auth | Deskripsi               |
|--------|-------------------------|------|-------------------------|
| POST   | `/api/auth/login`       | —    | Login, mendapat JWT     |
| GET    | `/api/auth/me`          | ✓    | Data user saat ini      |
| PATCH  | `/api/auth/change-password` | ✓ | Ubah password          |

### Utilitas

| Method | Endpoint       | Auth | Deskripsi         |
|--------|----------------|------|-------------------|
| GET    | `/api/health`  | —    | Health check      |

### Format Respons

Sukses:
```json
{ "data": { ... } }
```

Error:
```json
{ "errors": "Pesan error" }
```

---

## Database

### Model User

| Kolom          | Tipe         | Keterangan                        |
|----------------|--------------|-----------------------------------|
| `id`           | UUID         | Primary key                       |
| `full_name`    | String       | Nama lengkap                      |
| `username`     | String       | Unique, dipakai untuk login       |
| `email`        | String       | Unique                            |
| `password`     | String       | Bcrypt hash                       |
| `access_level` | AksesLevel   | SUPER_ADMIN / ADMIN / VIEWER      |
| `position`     | String?      | Jabatan (opsional)                |
| `phone_number` | String?      | Nomor HP (opsional)               |
| `address`      | Text?        | Alamat (opsional)                 |
| `status`       | Status       | ACTIVE / INACTIVE                 |

### Model ActivityLog

Setiap aksi penting (login, ubah password, dsb.) tercatat otomatis di tabel ini.

| Kolom         | Tipe    | Keterangan              |
|---------------|---------|-------------------------|
| `id`          | UUID    | Primary key             |
| `user_id`     | String  | FK ke User              |
| `user_name`   | String  | Nama user saat aksi     |
| `action`      | String  | Deskripsi singkat aksi  |
| `module`      | String  | Nama modul (Auth, dsb.) |
| `description` | Text?   | Detail tambahan         |

---

## Autentikasi & Otorisasi

### Alur Login

1. Frontend kirim `POST /api/auth/login` dengan `{ username, password }`
2. Backend verifikasi password (bcrypt), buat JWT, catat ActivityLog
3. Frontend simpan token di `sessionStorage`
4. Setiap request berikutnya menyertakan `Authorization: Bearer <token>`
5. `AuthMiddleware` backend verifikasi token dan inject `req.user`

### Level Akses (RBAC)

| Role        | transaksi             | pelanggan     | pengguna      | logAktivitas | pengaturan  |
|-------------|-----------------------|---------------|---------------|--------------|-------------|
| Super Admin | lihat tambah edit hapus export | lihat tambah edit hapus | lihat tambah edit hapus | lihat | lihat edit |
| Admin       | lihat tambah edit hapus export | lihat tambah edit hapus | —             | lihat        | lihat edit  |
| Viewer      | lihat export          | lihat         | —             | —            | lihat edit  |

---

## Konfigurasi

### Backend (`.env`)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mylife?schema=mylife"
JWT_SECRET="ganti-ini-di-produksi"
PORT=8000
FRONTEND_URL=http://localhost:3000
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_USE_MOCK=false
```

Set `NEXT_PUBLIC_USE_MOCK=true` untuk mode mock (frontend bisa jalan tanpa backend aktif).

---

## Struktur Proyek

```
mylife/
├── backend/               # NestJS API
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── auth/
│   │   ├── common/
│   │   ├── health/
│   │   ├── middleware/
│   │   ├── model/
│   │   └── generated/prisma/   # AUTO-GENERATED
│   └── CLAUDE.md
├── frontend/              # Next.js App
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── contexts/
│   │   └── lib/
│   └── CLAUDE.md
└── dokumentasi.md         # File ini
```

---

## Pengembangan

### Tambah Module Baru (Backend)

```bash
cd backend
nest generate module nama-module
nest generate controller nama-module
nest generate service nama-module
```

Tambahkan validasi Zod di `nama-module.validation.ts`.

### Tambah Halaman Baru (Frontend)

1. Buat file di `src/app/(main)/nama-halaman/page.tsx`
2. Halaman otomatis terlindungi oleh `AuthGuard`
3. Gunakan `useRequiredAuth()` untuk akses data user

### Tambah UI Component (shadcn)

```bash
cd frontend
npx shadcn add nama-component
```
