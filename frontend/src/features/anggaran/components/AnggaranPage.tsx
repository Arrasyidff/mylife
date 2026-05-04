"use client";
import { CheckCircle, XCircle } from 'lucide-react';
import { T } from '@/lib/tokens';
import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';
import { ProgressBar } from '@/components/ui/progress-bar';
import { formatRp } from '@/lib/format';
import { MONTH_NAMES } from '../constants';
import { useAnggaran } from '../hooks/useAnggaran';
import { BudgetCard } from './BudgetCard';
import { AddBudgetCard } from './AddBudgetCard';
import { AddBudgetModal } from './AddBudgetModal';
import { EditBudgetModal } from './EditBudgetModal';
import type { StatusFilter } from '../types';

export function AnggaranPage() {
  const {
    visibleBudgets,
    totalBudget,
    totalUsed,
    overallPct,
    daysLeft,
    safeCount,
    warnCount,
    overCount,
    showModal,
    editingBudget,
    toast,
    statusFilter,
    currentDate,
    currentLabel,
    prevLabel,
    nextLabel,
    setShowModal,
    setEditingBudget,
    setStatusFilter,
    handleAdd,
    handleSave,
    handleDelete,
    handleMonthPrev,
    handleMonthNext,
  } = useAnggaran();

  const statusCards: { key: StatusFilter; label: string; count: number; tone: string; tint: string }[] = [
    { key: 'safe', label: 'Aman',         count: safeCount, tone: T.primary, tint: T.primaryLight },
    { key: 'warn', label: 'Hampir Habis', count: warnCount, tone: T.warning, tint: T.warningLight  },
    { key: 'over', label: 'Lewat Batas',  count: overCount, tone: T.danger,  tint: T.dangerLight   },
  ];

  return (
    <div className="font-sans">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-5 right-6 bg-white rounded-[10px] py-3 px-4 shadow-[0_4px_20px_rgba(20,30,25,0.12)] flex items-center gap-2.5 z-[100] max-w-[340px]"
          style={{
            border:     `1px solid ${toast.ok ? T.primary : T.danger}44`,
            borderLeft: `4px solid ${toast.ok ? T.primary : T.danger}`,
          }}
        >
          {toast.ok
            ? <CheckCircle size={16} color={T.primary} />
            : <XCircle size={16} color={T.danger} />
          }
          <span className="text-[13px] font-semibold text-[#1A2420]">{toast.msg}</span>
        </div>
      )}

      {/* Page header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-0 mb-5">
        <div>
          <h1 className="m-0 text-xl font-bold text-[#1A2420] tracking-[-0.01875rem]">Anggaran</h1>
          <div className="text-[12.5px] text-[#A4B8B2] mt-0.75">
            Atur batas pengeluaran per kategori
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Btn kind="ghost" size="sm" icon={Icon.chev(14, 'left')} onClick={handleMonthPrev}>
            {prevLabel}
          </Btn>
          <Btn
            kind="ghost"
            size="sm"
            style={{ background: T.primaryLight, color: T.primaryDark, borderColor: '#C7E6D8' }}
          >
            {currentLabel}
          </Btn>
          <Btn kind="ghost" size="sm" onClick={handleMonthNext}>
            {nextLabel} {Icon.chev(14, 'right')}
          </Btn>
          <span className="w-px bg-[#E0EAE6] h-6 mx-1" />
          <Btn kind="primary" size="sm" icon={Icon.plus(14)} onClick={() => setShowModal(true)}>
            Anggaran Baru
          </Btn>
        </div>
      </div>

      {/* Summary banner */}
      <div className="bg-white border border-[#E0EAE6] rounded-[0.75rem] p-[22px] mb-[22px] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr] gap-7">
        <div className="sm:col-span-2 xl:col-span-1">
          <div className="text-[11.5px] font-semibold text-[#7D9590] tracking-[0.3px] mb-1.5">
            RINGKASAN {MONTH_NAMES[currentDate.getMonth()].toUpperCase()}
          </div>
          <div className="text-[26px] font-bold tracking-[-0.03125rem] tabular-nums text-[#1A2420]">
            {formatRp(totalUsed)}{' '}
            <span className="text-base text-[#A4B8B2] font-medium">/ {formatRp(totalBudget)}</span>
          </div>
          <div className="mt-2.5">
            <ProgressBar pct={overallPct} height={8} />
          </div>
          <div className="text-xs text-[#7D9590] mt-1.5">
            {overallPct}% terpakai · {daysLeft} hari tersisa di bulan ini
          </div>
        </div>

        {statusCards.map(s => {
          const active = statusFilter === s.key;
          return (
            <button
              key={s.key}
              onClick={() => setStatusFilter(active ? 'all' : s.key)}
              className="py-4 px-4 rounded-[12px] text-left cursor-pointer font-sans transition-[box-shadow,border-color] duration-150"
              style={{
                background:  s.tint,
                border:      `1px solid ${active ? s.tone : s.tone + '30'}`,
                boxShadow:   active ? `0 0 0 3px ${s.tone}22` : 'none',
              }}
            >
              <div className="text-[11.5px] font-semibold text-[#7D9590] tracking-[0.3px]">
                {s.label.toUpperCase()}
              </div>
              <div className="text-[28px] font-bold tracking-[-0.03125rem] mt-1" style={{ color: s.tone }}>
                {s.count}
              </div>
              <div className="text-[11.5px] font-normal" style={{ color: active ? s.tone : T.textMuted, fontWeight: active ? 600 : 400 }}>
                {active ? 'klik untuk reset' : 'kategori'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Budget grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {visibleBudgets.map(b => (
          <BudgetCard key={b.id} b={b} onEdit={() => setEditingBudget(b)} />
        ))}
        {statusFilter === 'all' && <AddBudgetCard onClick={() => setShowModal(true)} />}
        {statusFilter !== 'all' && visibleBudgets.length === 0 && (
          <div className="col-span-full py-10 text-center text-[#7D9590] text-[13.5px]">
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
