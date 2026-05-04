---
name: Frontend Current State & Refactoring Gap
description: Current structure of frontend/src as of 2026-05-04 and what needs to move
type: project
originSessionId: ed8cdc8a-ba0f-4838-81f4-67874346b426
---
**Current state (as of 2026-05-04):**

Pages under `app/`:
- `(auth)/login/` — login page
- `(main)/` — dashboard, rekening, transaksi, anggaran, laporan (all thin re-exports)
- `mobile/` — mobile page

What already matches target:
- `features/auth/` — partially done: components (LoginForm, LoginHeader), hooks (useLoginForm), schemas, types. Missing: services/, store/
- `components/layout/` — Navbar, Sidebar, LayoutShell, AuthGuard
- `components/ui/` — button, form-input, icon, pill, popover, progress-bar, surface, btn
- `components/shared/` — CatBubble, UserBadge (created this session)
- `lib/utils.ts` — exists

What's already been refactored:
- `features/rekening/` — DONE: types.ts, constants.ts, hooks/useRekening.ts, components/AccountCard, AccountDetailCard, AddAccountCard, AddAccountModal, EditAccountModal, RekeningPage. app/(main)/rekening/page.tsx is thin re-export.
- `features/transaksi/` — DONE: types.ts, constants.ts, hooks/useTransaksi.ts, components/FilterChip, TxLine, TxGroup, EmptyState, TxRow, AddTransactionModal, EditTransactionModal, TransaksiPage. app/(main)/transaksi/page.tsx is thin re-export.
- `features/dashboard/` — DONE: hooks/useDashboard.ts, components/DashboardPage, SummaryStat, BudgetRow. app/(main)/page.tsx is thin re-export. Old components/dashboard/ folder deleted.
- `features/anggaran/` — DONE: types.ts, constants.ts, hooks/useAnggaran.ts, components/AnggaranPage, BudgetCard, AddBudgetCard, AddBudgetModal, EditBudgetModal. app/(main)/anggaran/page.tsx is thin re-export.
- `features/laporan/` — DONE: types.ts, constants.ts, hooks/useLaporan.ts, components/LaporanPage, CategoryDonut, DatePicker, MonthComparisonTable, PeriodToggle, SpenderChart, SpendingBarChart, TopStatsGrid.

What still needs to be created/moved:
- `features/auth/store/` — auth context lives at `contexts/auth-context.tsx`, needs to move here
- `features/auth/services/` — auth service at `lib/services/auth.ts`, move to feature
- `lib/api/` — `lib/api.ts` should become `lib/api/client.ts`
- `lib/auth/` — `lib/tokens.ts` should move here
- `lib/hooks/` — no hooks in lib yet (lib/hooks/useScrollLock.ts already exists though)
- `config/` — env and app config don't exist yet
- `components/shared/` — EmptyState, ErrorMessage still missing

**Why:** Tracking the gap so each refactoring session can pick up from the right point.
**How to apply:** When user asks to refactor a feature, check this list to know what files need to move and where they currently live.
