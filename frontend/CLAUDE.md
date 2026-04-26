@AGENTS.md

# Frontend — CLAUDE.md

## Stack

- **Framework**: Next.js 16 + TypeScript + React 19
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (konfigurasi di `components.json`)
- **Icons**: lucide-react + @deemlol/next-icons
- **Charts**: recharts
- **Port default**: 3000

## Perintah Utama

```bash
# Development
npm run dev

# Build produksi
npm run build
npm run start

# Lint
npm run lint
```

## Struktur Direktori

```
src/
├── app/
│   ├── layout.tsx              # Root layout — ThemeProvider, AuthProvider
│   ├── globals.css
│   ├── login/page.tsx
│   └── (main)/                 # Route group untuk halaman yang butuh auth
│       ├── layout.tsx          # Dibungkus AuthGuard + LayoutShell
│       └── page.tsx            # Dashboard
├── components/
│   ├── layout/
│   │   ├── AuthGuard.tsx       # Redirect ke /login jika belum auth
│   │   ├── LayoutShell.tsx     # Shell dengan Sidebar + Navbar
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   ├── theme-provider.tsx
│   └── ui/                     # shadcn/ui components (jangan edit manual)
├── contexts/
│   └── auth-context.tsx        # AuthProvider, useAuth(), useRequiredAuth()
└── lib/
    ├── api.ts                  # HTTP client wrapper (fetch + auto Bearer token)
    ├── data.ts                 # Shared types: User, AksesLevel
    ├── permissions.ts          # RBAC: can(role, modul, aksi)
    ├── utils.ts
    ├── mock/
    │   └── auth.ts             # Mock data untuk dev tanpa backend
    └── services/
        └── auth.ts             # loginApi(), getMeApi() — otomatis pakai mock/real
```

## Environment Variables

Salin `.env.example` ke `.env.local`:

| Variable                  | Contoh                      | Keterangan                                    |
|---------------------------|-----------------------------|-----------------------------------------------|
| `NEXT_PUBLIC_API_URL`     | `http://localhost:8000`     | Base URL backend API                          |
| `NEXT_PUBLIC_USE_MOCK`    | `true`                      | `true` = pakai mock data, tanpa backend nyata |

## Autentikasi

- Token JWT disimpan di `sessionStorage` (bukan localStorage) — hilang saat tab ditutup
- `api.ts` otomatis menyisipkan `Authorization: Bearer <token>` di setiap request
- Jika response 401, token dihapus dan user di-redirect ke `/login`
- `AuthGuard` melindungi semua route di `(main)` group

## RBAC (Role-Based Access Control)

Gunakan `can(role, modul, aksi)` dari `lib/permissions.ts`:

```tsx
import { can } from "@/lib/permissions";
if (can(user.aksesLevel, "transaksi", "hapus")) { ... }
```

| Role        | Kemampuan                                                          |
|-------------|--------------------------------------------------------------------|
| Super Admin | Akses penuh semua modul                                            |
| Admin       | Seperti Super Admin tapi tidak bisa kelola pengguna                |
| Viewer      | Hanya lihat & export transaksi, lihat pelanggan                    |

## Pola Pengembangan

- Semua halaman yang butuh auth **harus** berada di dalam `(main)/` route group
- Tambah UI components shadcn dengan `npx shadcn add <component>`
- Mock mode (`NEXT_PUBLIC_USE_MOCK=true`) untuk development frontend tanpa backend aktif
- Gunakan `useAuth()` untuk akses user di client components
- Gunakan `useRequiredAuth()` di halaman yang dijamin sudah login (dalam AuthGuard)
