"use client";
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { T } from '@/lib/tokens';
import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';
import { ProgressBar } from '@/components/ui/progress-bar';
import { CatBubble } from '@/components/dashboard/cat-bubble';
import { AddBudgetModal } from '@/components/dashboard/add-budget-modal';
import { EditBudgetModal } from '@/components/dashboard/edit-budget-modal';
import { budgets as INITIAL_BUDGETS, type Budget } from '@/lib/dashboard-data';
import { formatRp } from '@/lib/format';

const PERIOD_LABEL: Record<string, string> = {
  weekly: 'Mingguan',
  monthly: 'Bulanan',
  yearly: 'Tahunan',
};

const MONTH_NAMES = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const BASE = new Date(2026, 3); // April 2026

type StatusFilter = 'all' | 'safe' | 'warn' | 'over';

type Toast = { msg: string; ok: boolean };

function BudgetCard({ b, onEdit }: { b: Budget; onEdit: () => void }) {
  const pct       = Math.round((b.used / b.total) * 100);
  const remaining = b.total - b.used;
  const over      = pct >= 100;
  const warn      = pct >= 75 && !over;

  const bg     = over ? T.dangerLight   : warn ? T.warningLight : T.surface;
  const bd     = over ? '#F0B7B5'       : warn ? '#F4D7A0'     : T.border;
  const accent = over ? T.danger        : warn ? T.warning      : T.primary;

  return (
    <div style={{
      background: bg,
      border: `1px solid ${bd}`,
      borderRadius: T.radius.lg,
      padding: 18,
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        <CatBubble cat={b.cat} size={38} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{b.name}</div>
            {over && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                padding: '2px 6px',
                background: T.danger, color: 'white',
                borderRadius: 999,
                fontSize: 10, fontWeight: 700, letterSpacing: 0.3,
              }}>
                {Icon.warn(10)} OVER
              </div>
            )}
          </div>
          <div style={{ fontSize: 11.5, color: T.textSubtle }}>
            {PERIOD_LABEL[b.period ?? 'monthly']}
          </div>
        </div>
        <button
          onClick={onEdit}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 8px', borderRadius: 6,
            border: `1px solid ${T.border}`,
            background: T.surface, color: T.textMuted,
            cursor: 'pointer', fontSize: 11.5, fontWeight: 600,
            fontFamily: T.fontSans, flexShrink: 0,
          }}
        >
          {Icon.edit(12)} Edit
        </button>
      </div>
      <div>
        <div style={{
          fontSize: 22, fontWeight: 700, color: T.text,
          letterSpacing: -0.4, fontVariantNumeric: 'tabular-nums',
        }}>
          {formatRp(b.used)}
        </div>
        <div style={{ fontSize: 11.5, color: T.textMuted, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
          dari {formatRp(b.total)}
        </div>
      </div>
      <ProgressBar pct={pct} height={8} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11.5, color: T.textMuted, fontVariantNumeric: 'tabular-nums' }}>
          {over
            ? <span style={{ color: T.danger, fontWeight: 600 }}>Lewat {formatRp(b.used - b.total)}</span>
            : `Sisa ${formatRp(remaining)}`}
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: accent, fontVariantNumeric: 'tabular-nums' }}>
          {pct}%
        </span>
      </div>
    </div>
  );
}

function AddBudgetCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'transparent',
        border: `1.5px dashed ${T.borderStrong}`,
        borderRadius: T.radius.lg,
        padding: 18, cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 8, minHeight: 184,
        color: T.textMuted, fontFamily: T.fontSans,
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 12,
        border: `1.5px dashed ${T.borderStrong}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {Icon.plus(18)}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600 }}>Tambah Anggaran</div>
      <div style={{ fontSize: 11.5, color: T.textSubtle }}>Buat anggaran kategori baru</div>
    </button>
  );
}

export default function AnggaranPage() {
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [monthOffset, setMonthOffset] = useState(0);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const currentDate = new Date(BASE.getFullYear(), BASE.getMonth() + monthOffset);
  const prevDate    = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
  const nextDate    = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
  const currentLabel = `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  const prevLabel    = MONTH_NAMES[prevDate.getMonth()];
  const nextLabel    = MONTH_NAMES[nextDate.getMonth()];

  // Bulan selain April 2026 tidak punya data transaksi, tampilkan used=0
  const displayBudgets = monthOffset === 0
    ? budgets
    : budgets.map(b => ({ ...b, used: 0 }));

  const totalBudget  = displayBudgets.reduce((s, b) => s + b.total, 0);
  const totalUsed    = displayBudgets.reduce((s, b) => s + b.used,  0);
  const overallPct   = totalBudget > 0 ? Math.round((totalUsed / totalBudget) * 100) : 0;
  const safeCount    = displayBudgets.filter(b => b.used / b.total < 0.75).length;
  const warnCount    = displayBudgets.filter(b => { const p = b.used / b.total; return p >= 0.75 && p < 1; }).length;
  const overCount    = displayBudgets.filter(b => b.used >= b.total).length;

  const visibleBudgets = displayBudgets.filter(b => {
    if (statusFilter === 'all') return true;
    const pct = b.used / b.total;
    if (statusFilter === 'safe') return pct < 0.75;
    if (statusFilter === 'warn') return pct >= 0.75 && pct < 1;
    if (statusFilter === 'over') return b.used >= b.total;
    return true;
  });

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
  }

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  function handleAdd(budget: Budget) {
    setBudgets(prev => [...prev, budget]);
    showToast(`Anggaran "${budget.name}" berhasil ditambahkan`);
  }

  function handleSave(updated: Budget) {
    setBudgets(prev => prev.map(b => b.id === updated.id ? updated : b));
    showToast(`Anggaran "${updated.name}" berhasil diperbarui`);
  }

  function handleDelete(id: string) {
    const name = budgets.find(b => b.id === id)?.name ?? '';
    setBudgets(prev => prev.filter(b => b.id !== id));
    showToast(`Anggaran "${name}" telah dihapus`, false);
  }

  return (
    <div style={{ fontFamily: T.fontSans }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 24,
          background: T.surface,
          border: `1px solid ${toast.ok ? T.primary : T.danger}44`,
          borderLeft: `4px solid ${toast.ok ? T.primary : T.danger}`,
          borderRadius: 10,
          padding: '12px 16px',
          boxShadow: '0 4px 20px rgba(20,30,25,0.12)',
          display: 'flex', alignItems: 'center', gap: 10,
          zIndex: 100, maxWidth: 340,
        }}>
          {toast.ok
            ? <CheckCircle size={16} color={T.primary} />
            : <XCircle size={16} color={T.danger} />
          }
          <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{toast.msg}</span>
        </div>
      )}

      {/* Page header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: 20,
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: T.text, letterSpacing: -0.3 }}>
            Anggaran
          </h1>
          <div style={{ fontSize: 12.5, color: T.textSubtle, marginTop: 3 }}>
            Atur batas pengeluaran per kategori
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <Btn kind="ghost" size="sm" icon={Icon.chev(14, 'left')} onClick={() => { setMonthOffset(o => o - 1); setStatusFilter('all'); }}>
            {prevLabel}
          </Btn>
          <Btn
            kind="ghost"
            size="sm"
            style={{ background: T.primaryLight, color: T.primaryDark, borderColor: '#C7E6D8' }}
          >
            {currentLabel}
          </Btn>
          <Btn kind="ghost" size="sm" onClick={() => { setMonthOffset(o => o + 1); setStatusFilter('all'); }}>
            {nextLabel} {Icon.chev(14, 'right')}
          </Btn>
          <span style={{ width: 1, background: T.border, height: 24, margin: '0 4px' }} />
          <Btn kind="primary" size="sm" icon={Icon.plus(14)} onClick={() => setShowModal(true)}>
            Anggaran Baru
          </Btn>
        </div>
      </div>

      {/* Summary banner */}
      <div style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: T.radius.lg,
        padding: 22, marginBottom: 22,
        display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 28,
      }}>
        <div>
          <div style={{
            fontSize: 11.5, fontWeight: 600, color: T.textMuted,
            letterSpacing: 0.3, marginBottom: 6,
          }}>
            RINGKASAN {MONTH_NAMES[currentDate.getMonth()].toUpperCase()}
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.5, fontVariantNumeric: 'tabular-nums', color: T.text }}>
            {formatRp(totalUsed)}{' '}
            <span style={{ fontSize: 16, color: T.textSubtle, fontWeight: 500 }}>/ {formatRp(totalBudget)}</span>
          </div>
          <div style={{ marginTop: 10 }}>
            <ProgressBar pct={overallPct} height={8} />
          </div>
          <div style={{ fontSize: 12, color: T.textMuted, marginTop: 6 }}>
            {overallPct}% terpakai · 5 hari tersisa di bulan ini
          </div>
        </div>

        {([
          { key: 'safe' as StatusFilter, label: 'Aman',         count: safeCount, tone: T.primary, tint: T.primaryLight },
          { key: 'warn' as StatusFilter, label: 'Hampir Habis', count: warnCount,  tone: T.warning, tint: T.warningLight },
          { key: 'over' as StatusFilter, label: 'Lewat Batas',  count: overCount,  tone: T.danger,  tint: T.dangerLight  },
        ]).map((s) => {
          const active = statusFilter === s.key;
          return (
            <button
              key={s.key}
              onClick={() => setStatusFilter(active ? 'all' : s.key)}
              style={{
                padding: 16, borderRadius: 12, textAlign: 'left',
                background: s.tint,
                border: `1px solid ${active ? s.tone : s.tone + '30'}`,
                boxShadow: active ? `0 0 0 3px ${s.tone}22` : 'none',
                cursor: 'pointer', fontFamily: T.fontSans,
                transition: 'box-shadow 0.15s, border-color 0.15s',
              }}
            >
              <div style={{ fontSize: 11.5, fontWeight: 600, color: T.textMuted, letterSpacing: 0.3 }}>
                {s.label.toUpperCase()}
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: s.tone, letterSpacing: -0.5, marginTop: 4 }}>
                {s.count}
              </div>
              <div style={{ fontSize: 11.5, color: active ? s.tone : T.textMuted, fontWeight: active ? 600 : 400 }}>
                {active ? 'klik untuk reset' : 'kategori'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Budget grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {visibleBudgets.map(b => (
          <BudgetCard key={b.id} b={b} onEdit={() => setEditingBudget(b)} />
        ))}
        {statusFilter === 'all' && <AddBudgetCard onClick={() => setShowModal(true)} />}
        {statusFilter !== 'all' && visibleBudgets.length === 0 && (
          <div style={{
            gridColumn: '1 / -1',
            padding: '40px 0', textAlign: 'center',
            color: T.textMuted, fontSize: 13.5,
          }}>
            Tidak ada anggaran dalam kategori ini.
          </div>
        )}
      </div>

      {showModal && (
        <AddBudgetModal
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
          totalExisting={totalBudget}
        />
      )}

      {editingBudget && (
        <EditBudgetModal
          budget={editingBudget}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setEditingBudget(null)}
        />
      )}
    </div>
  );
}
