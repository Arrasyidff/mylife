---
name: Frontend Current State & Refactoring Gap
description: Current structure of frontend/src as of 2026-05-03 and what needs to move
type: project
originSessionId: ed8cdc8a-ba0f-4838-81f4-67874346b426
---
**Current state (as of 2026-05-03):**

Pages under `app/`:
- `(auth)/login/` — login page
- `(main)/` — dashboard, rekening, transaksi, anggaran, laporan
- `mobile/` — mobile page

What already matches target:
- `features/auth/` — partially done: components (LoginForm, LoginHeader), hooks (useLoginForm), schemas, types. Missing: services/, store/
- `components/layout/` — Navbar, Sidebar, LayoutShell, AuthGuard
- `components/ui/` — button, form-input, icon, pill, popover, progress-bar, surface, btn
- `lib/utils.ts` — exists

What needs to be created/moved:
- `features/rekening/` — currently in `components/dashboard/` (account-card, add-account-modal, edit-account-modal)
- `features/transaksi/` — currently in `components/dashboard/` (tx-row, add-transaction-modal, edit-transaction-modal)
- `features/anggaran/` — currently in `components/dashboard/` (budget-row, add-budget-modal, edit-budget-modal)
- `features/auth/store/` — auth context lives at `contexts/auth-context.tsx`, needs to move here
- `features/auth/services/` — auth service at `lib/services/auth.ts`, move to feature
- `lib/api/` — `lib/api.ts` should become `lib/api/client.ts`
- `lib/auth/` — `lib/tokens.ts` should move here
- `lib/hooks/` — no hooks in lib yet
- `config/` — env and app config don't exist yet
- `components/shared/` — EmptyState, ErrorMessage don't exist yet

`components/dashboard/` also has: summary-stat, cat-bubble, user-badge — need to determine which feature these belong to (likely dashboard/overview feature).

**Why:** Tracking the gap so each refactoring session can pick up from the right point.
**How to apply:** When user asks to refactor a feature, check this list to know what files need to move and where they currently live.
