---
name: Target Frontend Architecture
description: Desired feature-based folder structure for frontend/src refactoring
type: project
originSessionId: ed8cdc8a-ba0f-4838-81f4-67874346b426
---
Target structure for `frontend/src/`:

```
src/
├── app/                        # Next.js App Router — UI & routing only, no logic
│   ├── (auth)/login/page.tsx
│   ├── (main)/                 # protected routes (was "(main)")
│   │   ├── layout.tsx          # auth guard here
│   │   ├── page.tsx            # dashboard
│   │   ├── rekening/page.tsx
│   │   ├── transaksi/page.tsx
│   │   ├── anggaran/page.tsx
│   │   └── laporan/page.tsx
│   ├── api/                    # API routes
│   └── middleware.ts
│
├── features/                   # Feature modules — each domain is self-contained
│   ├── auth/
│   │   ├── components/         # LoginForm, LoginHeader, etc.
│   │   ├── hooks/              # useLoginForm, useAuth
│   │   ├── services/           # authService.ts (API calls)
│   │   ├── store/              # authStore (global state, e.g. zustand/context)
│   │   ├── schemas/            # zod schemas
│   │   └── types.ts
│   ├── rekening/               # (accounts)
│   ├── transaksi/              # (transactions)
│   ├── anggaran/               # (budget)
│   └── laporan/                # (reports)
│
├── components/                 # Global reusable UI only
│   ├── ui/                     # Button, Input, Modal, Pill, etc.
│   ├── layout/                 # Navbar, Sidebar, LayoutShell, AuthGuard
│   └── shared/                 # EmptyState, ErrorMessage
│
├── lib/                        # Utilities & core helpers
│   ├── api/                    # client.ts (fetch wrapper), handler.ts
│   ├── db/                     # prisma.ts
│   ├── auth/                   # session.ts, tokens.ts
│   ├── hooks/                  # useDebounce, etc.
│   ├── utils.ts
│   └── constants.ts
│
├── styles/globals.css
└── config/
    ├── env.ts
    └── app.ts
```

**Key rules:**
- `app/` pages are thin — import from `features/` or `components/`, no business logic inline
- Each `features/<domain>/` is self-contained: components, hooks, services, store, schemas, types
- `components/` is for truly shared/global UI only (no domain logic)
- `lib/` is for utilities with no domain awareness
- `contexts/` folder should be eliminated — move auth context to `features/auth/store/`

**Why:** User wants clean separation of concerns, easy to find/add domain logic, scalable as features grow.
**How to apply:** When refactoring any page or feature, follow this structure. When user says "refactor rekening page", create `features/rekening/` with the appropriate subfolders and move logic out of `app/` and `components/dashboard/`.
