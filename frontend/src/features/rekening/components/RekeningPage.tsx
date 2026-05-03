"use client";
import { CheckCircle, XCircle } from 'lucide-react';
import { T } from '@/lib/tokens';
import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';
import { formatRp } from '@/lib/format';
import { AddTransactionModal } from '@/components/dashboard/add-transaction-modal';
import { GROUP_CONFIG } from '../constants';
import { useRekening } from '../hooks/useRekening';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { AccountDetailCard } from './AccountDetailCard';
import { AddAccountCard } from './AddAccountCard';
import { AddAccountModal } from './AddAccountModal';
import { EditAccountModal } from './EditAccountModal';

export function RekeningPage() {
  const {
    accounts,
    visibleAccounts,
    totalBalance,
    hiddenCount,
    monthlyNet,
    showAddModal,
    showTransferModal,
    editingAccount,
    toast,
    setShowAddModal,
    setShowTransferModal,
    setEditingAccount,
    handleAdd,
    handleSave,
    handleTransfer,
    handleDelete,
    handleToggleHide,
  } = useRekening();

  const isMobile = useIsMobile();

  const visibleGroupsWithBalance = GROUP_CONFIG.filter(g =>
    visibleAccounts.some(a => (g.types as readonly string[]).includes(a.type))
  );

  const summaryGridCols = isMobile
    ? '1fr'
    : `1.6fr ${visibleGroupsWithBalance.map(() => '1fr').join(' ')}`;

  return (
    <div className="font-sans">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-5 right-6 bg-white rounded-[10px] py-3 px-4 shadow-[0_4px_20px_rgba(20,30,25,0.12)] flex items-center gap-2.5 z-[100] max-w-[340px]"
          style={{
            border: `1px solid ${toast.ok ? T.primary : T.danger}44`,
            borderLeft: `4px solid ${toast.ok ? T.primary : T.danger}`,
            animation: 'slideIn 0.2s ease',
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
          <h1 className="m-0 text-xl font-bold text-[#1A2420] tracking-[-0.3px]">
            Rekening
          </h1>
          <div className="text-[12.5px] text-[#A4B8B2] mt-[3px]">
            {accounts.length} rekening aktif · April 2026
            {hiddenCount > 0 && (
              <span className="text-[#7D9590] ml-1.5">
                · {hiddenCount} tidak dihitung
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2 shrink-0 w-full sm:w-auto">
          <Btn kind="ghost" size="sm" icon={Icon.arrowLR(14)} onClick={() => setShowTransferModal(true)}>Transfer</Btn>
          <Btn kind="primary" size="sm" icon={Icon.plus(14)} onClick={() => setShowAddModal(true)}>
            Tambah Rekening
          </Btn>
        </div>
      </div>

      {/* Summary banner */}
      <div
        className="bg-white border border-[#E0EAE6] rounded-[12px] mb-[22px] grid py-[18px] px-4 gap-3 sm:py-[22px] sm:px-7 sm:gap-7"
        style={{ gridTemplateColumns: summaryGridCols }}
      >
        {/* Total */}
        <div>
          <div className="text-[11.5px] font-semibold text-[#7D9590] tracking-[0.3px] mb-2 flex items-center gap-1.5">
            TOTAL ASET
            {hiddenCount > 0 && (
              <span className="text-[10px] font-semibold text-[#7D9590] bg-[#F6F9F7] border border-[#E0EAE6] rounded-[4px] py-[1px] px-[5px]">
                {hiddenCount} DISEMBUNYIKAN
              </span>
            )}
          </div>
          <div className="text-[32px] font-bold text-[#1A2420] tracking-[-1px] tabular-nums">
            {formatRp(totalBalance)}
          </div>
          <div className={`text-xs font-semibold mt-1.5 flex items-center gap-1 ${monthlyNet >= 0 ? 'text-[#15735A]' : 'text-[#C0392B]'}`}>
            {monthlyNet >= 0 ? Icon.arrowUp(12) : Icon.arrowDown(12)}
            {monthlyNet >= 0 ? '+' : ''}{formatRp(monthlyNet)} bulan ini
          </div>
        </div>

        {/* Per-group breakdown */}
        {visibleGroupsWithBalance.map((g, i) => {
          const bal = visibleAccounts
            .filter(a => (g.types as readonly string[]).includes(a.type))
            .reduce((s, a) => s + a.balance, 0);
          const count = visibleAccounts.filter(a => (g.types as readonly string[]).includes(a.type)).length;
          return (
            <div
              key={i}
              className="rounded-[12px] py-4 px-[18px]"
              style={{ background: g.tint, border: `1px solid ${g.color}30` }}
            >
              <div className="text-[11px] font-semibold text-[#7D9590] tracking-[0.3px] mb-1">
                {g.label}
              </div>
              <div className="text-[19px] font-bold tracking-[-0.4px] tabular-nums" style={{ color: g.color }}>
                {formatRp(bal)}
              </div>
              <div className="text-[11.5px] text-[#7D9590] mt-[3px]">
                {count} rekening
              </div>
            </div>
          );
        })}
      </div>

      {/* Account grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {accounts.map(a => (
          <AccountDetailCard
            key={a.id}
            acct={a}
            isHidden={!!a.hidden}
            onEdit={() => setEditingAccount(a)}
            onToggleHide={() => handleToggleHide(a.id)}
          />
        ))}
        <AddAccountCard onClick={() => setShowAddModal(true)} />
      </div>

      {showAddModal && (
        <AddAccountModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAdd}
        />
      )}

      {editingAccount && (
        <EditAccountModal
          account={editingAccount}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setEditingAccount(null)}
        />
      )}

      {showTransferModal && (
        <AddTransactionModal
          initialType="transfer"
          onClose={() => setShowTransferModal(false)}
          onSave={handleTransfer}
        />
      )}
    </div>
  );
}
