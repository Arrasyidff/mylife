# CLAUDE.md — Project Rules & Context

> Baca file ini setiap awal sesi. Ikuti semua aturan di bawah secara konsisten.

---

## 📁 Struktur Folder

```
src/
│
├── app/                          # Next.js App Router (UI & routing)
│   ├── layout.tsx
│   ├── page.tsx
│   │
│   ├── (auth)/                   # Route grouping
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   │
│   └── (protected)/              # Protected routes
│       ├── dashboard/
│       │   └── page.tsx
│       └── layout.tsx            # layout with auth guard
│
├── features/                     # Feature-based modules
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   │
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   │
│   │   ├── services/
│   │   │   └── authService.ts
│   │   │
│   │   ├── store/                # optional global state
│   │   │   └── authStore.ts
│   │   │
│   │   ├── schemas/              # validation (zod)
│   │   │   └── auth.schema.ts
│   │   │
│   │   └── types.ts
│   │
│   └── todo/
│       ├── components/
│       │   ├── TodoForm.tsx
│       │   ├── TodoList.tsx
│       │   ├── TodoItem.tsx
│       │   ├── TodoFilter.tsx
│       │   ├── TodoSearch.tsx
│       │   └── TodoEmpty.tsx
│       │
│       ├── hooks/
│       │   └── useTodo.ts
│       │
│       ├── services/
│       │   └── todoService.ts
│       │
│       ├── store/
│       │   └── todoStore.ts
│       │
│       ├── schemas/
│       │   └── todo.schema.ts
│       │
│       └── types.ts
│
├── components/                   # Global reusable UI
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Checkbox.tsx
│   │   └── Spinner.tsx
│   │
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Container.tsx
│   │
│   └── shared/
│       ├── EmptyState.tsx
│       └── ErrorMessage.tsx
│
├── lib/                          # Utilities & core helpers
│   ├── api/
│   │   ├── client.ts             # fetch wrapper
│   │   └── handler.ts            # API response helper
│   │
│   ├── db/
│   │   └── prisma.ts             # prisma client
│   │
│   ├── auth/
│   │   └── session.ts            # session / token helper
│   │
│   ├── hooks/
│   │   └── useDebounce.ts
│   │
│   ├── utils.ts
│   └── constants.ts
│
├── styles/
│   └── globals.css
│
└── config/
    ├── env.ts
    └── app.ts
```

---

## 🏗️ Aturan Arsitektur

### Penempatan File — Wajib Diikuti

| Jenis file | Lokasi yang benar |
|---|---|
| Halaman / route UI | `app/` |
| Komponen spesifik fitur | `features/<nama-fitur>/components/` |
| Hook spesifik fitur | `features/<nama-fitur>/hooks/` |
| Service / API call fitur | `features/<nama-fitur>/services/` |
| State management fitur | `features/<nama-fitur>/store/` |
| Validasi schema (Zod) | `features/<nama-fitur>/schemas/` |
| Types fitur | `features/<nama-fitur>/types.ts` |
| Komponen UI reusable global | `components/ui/` |
| Komponen layout global | `components/layout/` |
| Komponen shared global | `components/shared/` |
| Fetch wrapper / API helper | `lib/api/` |
| Prisma client | `lib/db/prisma.ts` |
| Session / token helper | `lib/auth/session.ts` |
| Hook utility (debounce, dll) | `lib/hooks/` |
| Utility functions | `lib/utils.ts` |
| Konstanta global | `lib/constants.ts` |
| Konfigurasi env & app | `config/` |

### Aturan Tambahan

- **JANGAN** taruh komponen fitur di `components/` — gunakan `features/<fitur>/components/`
- **JANGAN** taruh logic bisnis langsung di halaman (`app/`) — delegasikan ke `features/`
- **JANGAN** import antar fitur secara langsung — gunakan `lib/` atau `components/` sebagai shared layer
- **SELALU** buat `types.ts` per fitur untuk mendefinisikan semua interface & type fitur tersebut
- **SELALU** buat `schemas/` per fitur untuk validasi Zod, jangan validasi inline di komponen

---

## ⚙️ Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript — strict mode, tidak ada `any`
- **Styling**: Tailwind CSS
- **State Management**: Zustand (di `store/` per fitur)
- **Validasi**: Zod (di `schemas/` per fitur)
- **ORM**: Prisma (`lib/db/prisma.ts`)
- **Auth**: Custom session (`lib/auth/session.ts`)
- **Fetch**: Custom wrapper (`lib/api/client.ts`)

---

## 📐 Konvensi Kode

### Penamaan

- **File komponen**: PascalCase → `TodoItem.tsx`, `LoginForm.tsx`
- **File non-komponen**: camelCase → `authService.ts`, `useAuth.ts`
- **Komponen React**: PascalCase → `export default function TodoItem()`
- **Hook**: prefix `use` → `useTodo`, `useAuth`, `useDebounce`
- **Service function**: camelCase → `createTodo()`, `loginUser()`
- **Type/Interface**: PascalCase → `Todo`, `AuthUser`, `CreateTodoInput`
- **Konstanta**: UPPER_SNAKE_CASE → `API_BASE_URL`, `MAX_TODO_LIMIT`
- **Zod schema**: suffix `Schema` → `loginSchema`, `createTodoSchema`

### TypeScript

- Gunakan `interface` untuk object shapes, `type` untuk union/alias
- **JANGAN** gunakan `any` — gunakan `unknown` jika tipe tidak pasti
- Semua props komponen harus punya tipe eksplisit
- Gunakan `export type` untuk re-export tipe saja

### Komponen React

- Gunakan **function component** — bukan class component
- Satu file = satu komponen utama (boleh ada sub-komponen kecil di file yang sama)
- Props destructuring langsung di parameter fungsi
- Gunakan `"use client"` hanya jika benar-benar butuh interaktivitas client-side

### 🧩 Aturan Pembuatan Halaman Baru

**Setiap halaman WAJIB dipecah menjadi komponen per section — jangan tulis semua JSX langsung di file `page.tsx`.**

Struktur yang benar:
```
features/
└── <nama-fitur>/
    └── components/
        ├── <NamaHalaman>Hero.tsx       # section hero / header halaman
        ├── <NamaHalaman>Form.tsx       # section form
        ├── <NamaHalaman>List.tsx       # section list / tabel
        ├── <NamaHalaman>Filter.tsx     # section filter / search
        └── <NamaHalaman>Summary.tsx    # section ringkasan / statistik
```

File `page.tsx` hanya boleh berisi **pemanggilan komponen**, bukan JSX detail:

```tsx
// ✅ Benar — page.tsx hanya merakit komponen
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader"
import { DashboardStats } from "@/features/dashboard/components/DashboardStats"
import { DashboardRecentList } from "@/features/dashboard/components/DashboardRecentList"

export default function DashboardPage() {
  return (
    <main>
      <DashboardHeader />
      <DashboardStats />
      <DashboardRecentList />
    </main>
  )
}

// ❌ Salah — jangan tulis semua JSX langsung di page.tsx
export default function DashboardPage() {
  return (
    <main>
      <div className="flex items-center justify-between">
        <h1>Dashboard</h1>
        <button>...</button>
      </div>
      <div className="grid grid-cols-4">
        <div>Total Users...</div>
        {/* puluhan baris JSX lainnya */}
      </div>
    </main>
  )
}
```

> **Aturan praktis**: Jika satu section punya lebih dari ~15 baris JSX, ia wajib jadi komponen terpisah.

### ⚓ Hooks yang Diizinkan

Hanya gunakan hooks berikut. **Hooks di luar daftar ini DILARANG dipakai tanpa konfirmasi terlebih dahulu.**

| Hook | Kegunaan |
|---|---|
| `useState` | Menyimpan data/state lokal komponen |
| `useEffect` | Side effect: fetch data, subscribe, timer |
| `useRef` | Akses DOM langsung atau simpan nilai tanpa re-render |
| `useContext` | Baca data dari React Context |

**Next.js hooks yang diizinkan:**

| Hook | Kegunaan |
|---|---|
| `useRouter` | Navigasi programatik |
| `usePathname` | Baca URL path aktif |
| `useSearchParams` | Baca query string dari URL |
| `useParams` | Baca dynamic segment dari URL |

> ⚠️ **Hooks seperti `useMemo`, `useCallback`, `useReducer`, `useTransition`, `useDeferredValue`, dan lainnya — TANYA DULU sebelum dipakai.** Jelaskan mengapa hooks tersebut diperlukan dan tunggu konfirmasi dari user.

```tsx
// ✅ Boleh langsung dipakai
const [count, setCount] = useState(0)
useEffect(() => { fetchData() }, [])
const inputRef = useRef<HTMLInputElement>(null)
const user = useContext(AuthContext)

// ❌ DILARANG tanpa konfirmasi dulu
const memoValue = useMemo(() => heavyCalc(), [dep])
const stableCallback = useCallback(() => doSomething(), [])
const [state, dispatch] = useReducer(reducer, initialState)
```

```tsx
// ✅ Benar
interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onDelete }: TodoItemProps) {
  return (...)
}

// ❌ Salah
export default function TodoItem(props: any) { ... }
```

### React Hooks — Hooks yang Diizinkan

**Hanya gunakan 4 hooks berikut. Jangan gunakan hooks lain tanpa izin eksplisit.**

| Hook | Kegunaan |
|---|---|
| `useState` | Menyimpan data/state lokal yang bisa berubah di komponen |
| `useEffect` | Menjalankan efek samping (fetch data, subscribe, dll) |
| `useRef` | Akses elemen DOM langsung, atau simpan nilai tanpa trigger re-render |
| `useContext` | Membaca data dari React Context tanpa prop drilling |

```tsx
// ✅ Hooks yang boleh dipakai
const [todos, setTodos] = useState<Todo[]>([])

useEffect(() => {
  fetchTodos()
}, [])

const inputRef = useRef<HTMLInputElement>(null)

const user = useContext(AuthContext)
```

```tsx
// ❌ JANGAN gunakan hooks ini tanpa izin eksplisit
useMemo(...)
useCallback(...)
useReducer(...)
useLayoutEffect(...)
useImperativeHandle(...)
useId(...)
useDeferredValue(...)
useTransition(...)
```

> Jika ada kasus yang benar-benar membutuhkan hooks di luar daftar ini, **tanyakan dulu ke user sebelum menggunakannya**.

### Service & API Call

- Semua fetch ke API eksternal/internal lewat `lib/api/client.ts`
- Semua API call per fitur dikelompokkan di `features/<fitur>/services/`
- Gunakan `lib/api/handler.ts` untuk format response di API routes

```ts
// ✅ Benar — features/todo/services/todoService.ts
import { apiClient } from "@/lib/api/client";

export async function getTodos(): Promise<Todo[]> {
  return apiClient.get("/api/todo");
}
```

### Validasi dengan Zod

- Schema didefinisikan di `features/<fitur>/schemas/<fitur>.schema.ts`
- Infer TypeScript type dari schema Zod, bukan tulis manual

```ts
// ✅ Benar — features/todo/schemas/todo.schema.ts
import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(1, "Title wajib diisi"),
  completed: z.boolean().default(false),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
```

### State Management (Zustand)

- Satu store per fitur di `features/<fitur>/store/<fitur>Store.ts`
- Pisahkan state dan action dengan jelas

```ts
// ✅ Benar — features/todo/store/todoStore.ts
interface TodoStore {
  todos: Todo[];
  isLoading: boolean;
  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
}
```

---

## 📱 Aturan Responsive Design

Desain harus berfungsi dengan baik di semua breakpoint berikut. Gunakan pendekatan **mobile-first** dengan Tailwind CSS.

### Target Perangkat & Ukuran Viewport

| Kategori | Perangkat | Lebar x Tinggi |
|---|---|---|
| **Mobile Portrait Mini** | Galaxy Z Fold 5 | 344 x 882 |
| **Mobile Portrait** | Samsung Galaxy S8+ | 360 x 740 |
| | iPhone SE | 375 x 667 |
| | iPhone 12 Pro | 390 x 884 |
| | Samsung Galaxy A51/71 | 412 x 915 |
| | Pixel 7 | 412 x 915 |
| | Samsung Galaxy S20 Ultra | 412 x 915 |
| | iPhone XR | 414 x 896 |
| | iPhone 14 Pro Max | 430 x 932 |
| **Mobile Semi iPad** | Surface Duo | 540 x 720 |
| **iPad Portrait** | iPad Mini | 768 x 1024 |
| | iPad Air | 820 x 1180 |
| | Asus Zenbook Fold | 853 x 1280 |
| | Surface Pro 7 | 912 x 1366 |
| | iPad Pro | 1024 x 1366 |
| **iPad Landscape** | Nest Hub | 1024 x 600 |
| | Nest Hub Max | 1280 x 800 |

### Breakpoint Mapping (Tailwind)

```
Default (mobile-first) → < 360px   → Galaxy Z Fold 5 (344px)
sm  → 360px+  → Samsung Galaxy S8+, iPhone SE
md  → 390px+  → iPhone 12 Pro ke atas
lg  → 540px+  → Surface Duo (semi tablet)
xl  → 768px+  → iPad Mini ke atas (tablet portrait)
2xl → 1024px+ → iPad Pro, Nest Hub (tablet landscape / desktop)
```

### Aturan Responsive — Wajib Diikuti

- **SELALU** gunakan mobile-first: mulai dari ukuran terkecil (344px), baru tambah breakpoint ke atas
- **JANGAN** hardcode ukuran pixel seperti `w-[375px]` — gunakan unit relatif atau kelas Tailwind
- **SELALU** test layout di lebar minimum **344px** (Galaxy Z Fold 5)
- Gunakan `min-w-0` atau `overflow-hidden` pada flex/grid child agar tidak meluap di layar sempit
- Gunakan `max-w-screen-xl mx-auto` untuk membatasi lebar konten di layar besar

### Pola Umum per Breakpoint

```tsx
// ✅ Grid responsive
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

// ✅ Padding responsif
<div className="px-4 sm:px-6 xl:px-8">

// ✅ Typography responsif
<h1 className="text-xl sm:text-2xl xl:text-3xl font-bold">

// ✅ Sidebar tampil hanya di tablet ke atas
<aside className="hidden xl:block w-64">

// ✅ Tombol full-width di mobile, auto di tablet
<button className="w-full xl:w-auto px-6 py-2">
```

### Checklist Responsive Saat Membuat Komponen

- [ ] Tampil dengan benar di lebar **344px** (minimum)
- [ ] Tidak ada horizontal scroll yang tidak disengaja
- [ ] Touch target minimal **44x44px** untuk elemen interaktif
- [ ] Font tidak terlalu kecil di mobile (minimal `text-sm` / 14px)
- [ ] Gambar/media menggunakan `max-w-full` atau `object-cover`
- [ ] Navbar/menu memiliki versi mobile (hamburger atau bottom nav)

---

## 🛡️ Auth & Route Protection

- Route yang butuh auth diletakkan di `app/(protected)/`
- Layout `app/(protected)/layout.tsx` bertugas sebagai auth guard
- Session helper ada di `lib/auth/session.ts` — gunakan ini, jangan buat ulang

---

## 📱 Aturan Responsive Design

### Prinsip Utama

- **JANGAN buat responsive jika tidak diminta** — default semua layout adalah desktop-first, non-responsive
- Hanya tambahkan breakpoint & responsive class jika user secara eksplisit meminta "buat responsive" atau menyebut perangkat tertentu
- Jika diminta responsive, gunakan referensi breakpoint di bawah ini sebagai acuan

### Referensi Breakpoint per Kategori

| Kategori | Perangkat | Resolusi (px) |
|---|---|---|
| **Mobile Portrait Mini** | Galaxy Z Fold 5 | 344 × 882 |
| **Mobile Portrait** | Samsung Galaxy S8+ | 360 × 740 |
| | iPhone SE | 375 × 667 |
| | iPhone 12 Pro | 390 × 844 |
| | Samsung Galaxy A51/71 | 412 × 915 |
| | Pixel 7 | 412 × 915 |
| | Samsung Galaxy S20 Ultra | 412 × 915 |
| | iPhone XR | 414 × 896 |
| | iPhone 14 Pro Max | 430 × 932 |
| **Mobile Semi iPad** | Surface Duo | 540 × 720 |
| **iPad Portrait** | iPad Mini | 768 × 1024 |
| | iPad Air | 820 × 1180 |
| | Asus Zenbook Fold | 853 × 1280 |
| | Surface Pro 7 | 912 × 1366 |
| | iPad Pro | 1024 × 1366 |
| **iPad Landscape** | Nest Hub | 1024 × 600 |
| | Nest Hub Max | 1280 × 800 |

### Mapping ke Tailwind Breakpoints

Jika diminta responsive, gunakan breakpoint Tailwind berikut yang paling mendekati:

```
< 344px   → (tidak ada prefix) default
344px+    → tidak ada breakpoint khusus, gunakan default
360–375px → sm: (640px Tailwind — gunakan dengan catatan, ini lebih besar)
412–430px → target utama mobile → desain default tanpa prefix
540px     → (antara sm dan md) — pertimbangkan custom breakpoint jika kritis
768px     → md:
820–912px → md: hingga lg:
1024px    → lg:
1280px    → xl:
```

> **Catatan**: Tailwind default breakpoints (sm: 640, md: 768, lg: 1024, xl: 1280, 2xl: 1536). Untuk mobile 360–430px, desain **tanpa prefix** (mobile-first default) sudah mencakup rentang ini.

### Contoh Penggunaan

```tsx
// ✅ Diminta responsive → boleh pakai breakpoint
<div className="flex flex-col md:flex-row lg:grid lg:grid-cols-3">

// ✅ Tidak diminta responsive → desain desktop saja, tanpa breakpoint
<div className="grid grid-cols-3 gap-4">

// ❌ Salah — jangan tambahkan responsive class tanpa diminta
<div className="w-full sm:w-1/2 md:w-1/3">
```

---

## 🚫 Aturan yang TIDAK BOLEH Dilanggar

1. **JANGAN** buat layout responsive jika tidak diminta secara eksplisit
2. **JANGAN** buat logic bisnis langsung di file `app/` (page/layout)
3. **JANGAN** gunakan `var` — gunakan `const` atau `let`
4. **JANGAN** hardcode URL, secret, atau konfigurasi — gunakan `config/env.ts`
5. **JANGAN** import langsung dari `features/` ke `features/` lain — gunakan shared layer
6. **JANGAN** skip validasi Zod saat memproses input dari user
7. **JANGAN** buat file baru di luar struktur yang sudah ditentukan tanpa alasan kuat

---

## ✅ Checklist Saat Membuat Fitur Baru

- [ ] Buat folder `features/<nama-fitur>/` dengan subfolder: `components/`, `hooks/`, `services/`, `store/`, `schemas/`
- [ ] Definisikan semua types di `features/<nama-fitur>/types.ts`
- [ ] Buat schema Zod di `schemas/<nama-fitur>.schema.ts`
- [ ] Buat service untuk API call di `services/`
- [ ] Buat store Zustand di `store/` jika butuh state global
- [ ] Buat hook custom di `hooks/` untuk abstraksi logic
- [ ] Daftarkan route di `app/` (dan `(protected)/` jika butuh auth)