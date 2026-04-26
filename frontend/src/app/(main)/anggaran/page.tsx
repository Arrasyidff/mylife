"use client";
import { useState } from 'react';
import { T } from '@/lib/tokens';
import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';
import { ProgressBar } from '@/components/ui/progress-bar';
import { CatBubble } from '@/components/dashboard/cat-bubble';
import { AddBudgetModal } from '@/components/dashboard/add-budget-modal';
import { budgets, type Budget } from '@/lib/dashboard-data';
import { formatRp } from '@/lib/format';

const totalBudget = budgets.reduce((s, b) => s + b.total, 0);
const totalUsed   = budgets.reduce((s, b) => s + b.used,  0);
const overallPct  = Math.round((totalUsed / totalBudget) * 100);
const safeCount   = budgets.filter(b => b.used / b.total < 0.75).length;
const warnCount   = budgets.filter(b => { const p = b.used / b.total; return p >= 0.75 && p < 1; }).length;
const overCount   = budgets.filter(b => b.used >= b.total).length;

function BudgetCard({ b }: { b: Budget }) {
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
      position: 'relative',
    }}>
      {over && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '3px 8px',
          background: T.danger, color: 'white',
          borderRadius: 999,
          fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3,
        }}>
          {Icon.warn(11)} OVER
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        <CatBubble cat={b.cat} size={38} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{b.name}</div>
          <div style={{ fontSize: 11.5, color: T.textSubtle }}>Bulanan</div>
        </div>
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
  const [showModal, setShowModal] = useState(false);

  return (
    <div style={{ fontFamily: T.fontSans }}>
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
          <Btn kind="ghost" size="sm" icon={Icon.chev(14, 'left')}>Maret</Btn>
          <Btn
            kind="ghost"
            size="sm"
            style={{ background: T.primaryLight, color: T.primaryDark, borderColor: '#C7E6D8' }}
          >
            April 2026
          </Btn>
          <Btn kind="ghost" size="sm">
            Mei {Icon.chev(14, 'right')}
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
            RINGKASAN APRIL
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
          { label: 'Aman',         count: safeCount, tone: T.primary, tint: T.primaryLight },
          { label: 'Hampir Habis', count: warnCount,  tone: T.warning, tint: T.warningLight },
          { label: 'Lewat Batas',  count: overCount,  tone: T.danger,  tint: T.dangerLight  },
        ] as const).map((s, i) => (
          <div key={i} style={{
            padding: 16, borderRadius: 12,
            background: s.tint, border: `1px solid ${s.tone}30`,
          }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: T.textMuted, letterSpacing: 0.3 }}>
              {s.label.toUpperCase()}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.tone, letterSpacing: -0.5, marginTop: 4 }}>
              {s.count}
            </div>
            <div style={{ fontSize: 11.5, color: T.textMuted }}>kategori</div>
          </div>
        ))}
      </div>

      {/* Budget grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {budgets.map(b => <BudgetCard key={b.id} b={b} />)}
        <AddBudgetCard onClick={() => setShowModal(true)} />
      </div>

      {showModal && <AddBudgetModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
