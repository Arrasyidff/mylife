"use client";
import { useState } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { budgets } from '@/lib/dashboard-data';
import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';
import { Surface } from '@/components/ui/surface';
import { Pill } from '@/components/ui/pill';
import { ProgressBar } from '@/components/ui/progress-bar';
import { CatBubble } from '@/components/dashboard/cat-bubble';
import { AddBudgetModal } from '@/components/dashboard/add-budget-modal';

export default function AnggaranPage() {
  const [showModal, setShowModal] = useState(false);

  const totalUsed   = budgets.reduce((s, b) => s + b.used,  0);
  const totalBudget = budgets.reduce((s, b) => s + b.total, 0);
  const overCount   = budgets.filter(b => b.used >= b.total).length;
  const nearCount   = budgets.filter(b => b.used / b.total >= 0.75 && b.used < b.total).length;
  const totalPct    = Math.round((totalUsed / totalBudget) * 100);

  return (
    <div style={{ fontFamily: T.fontSans }}>
      {/* Summary header */}
      <Surface pad={22} style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.text }}>
              Ringkasan Anggaran April 2026
            </h2>
            <div style={{ fontSize: 12.5, color: T.textSubtle, marginTop: 3 }}>
              {formatRp(totalUsed)} dari {formatRp(totalBudget)} terpakai · {totalPct}%
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {overCount > 0 && (
              <Pill tone="danger" icon={<AlertTriangle size={11} />}>{overCount} lewat batas</Pill>
            )}
            {nearCount > 0 && (
              <Pill tone="warning" icon={<AlertTriangle size={11} />}>{nearCount} mendekati batas</Pill>
            )}
            <button
              onClick={() => setShowModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 8,
                border: 'none',
                background: T.primary,
                color: 'white',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: T.fontSans,
              }}
            >
              <Plus size={14} />
              Anggaran Baru
            </button>
          </div>
        </div>
        <ProgressBar pct={totalPct} height={8} />
      </Surface>

      {/* Budget cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {budgets.map(b => {
          const pct        = Math.round((b.used / b.total) * 100);
          const overBudget = pct >= 100;
          const nearBudget = pct >= 75 && !overBudget;

          return (
            <Surface key={b.id} pad={18}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                <CatBubble cat={b.cat} size={38} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{b.name}</div>
                  <div style={{ fontSize: 11.5, color: T.textSubtle, marginTop: 1 }}>
                    Sisa {formatRp(Math.max(0, b.total - b.used))}
                  </div>
                </div>
                {overBudget && <Pill tone="danger">Lewat</Pill>}
                {nearBudget && <Pill tone="warning">Hampir</Pill>}
              </div>

              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: T.textMuted }}>Terpakai</span>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    color: overBudget ? T.danger : T.text,
                  }}>
                    {pct}%
                  </span>
                </div>
                <ProgressBar pct={pct} height={7} />
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: 10,
                borderTop: `1px solid ${T.divider}`,
              }}>
                <span style={{ fontSize: 12, color: T.textSubtle }}>Dipakai</span>
                <span style={{ fontSize: 12.5, fontVariantNumeric: 'tabular-nums', color: T.textMuted }}>
                  <strong style={{ color: T.text }}>{formatRp(b.used)}</strong>
                  {' / '}{formatRp(b.total)}
                </span>
              </div>
            </Surface>
          );
        })}
      </div>

      {showModal && <AddBudgetModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
