"use client";
import { CheckCircle, XCircle } from 'lucide-react';
import { T } from '@/lib/tokens';
import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';
import { formatRp } from '@/lib/format';
import { AddTransactionModal } from '@/components/dashboard/add-transaction-modal';
import { GROUP_CONFIG } from '../constants';
import { useRekening } from '../hooks/useRekening';
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

  const visibleGroupsWithBalance = GROUP_CONFIG.filter(g =>
    visibleAccounts.some(a => (g.types as readonly string[]).includes(a.type))
  );

  const summaryGridCols = `1.6fr ${visibleGroupsWithBalance.map(() => '1fr').join(' ')}`;

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
          animation: 'slideIn 0.2s ease',
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
            Rekening
          </h1>
          <div style={{ fontSize: 12.5, color: T.textSubtle, marginTop: 3 }}>
            {accounts.length} rekening aktif · April 2026
            {hiddenCount > 0 && (
              <span style={{ color: T.textMuted, marginLeft: 6 }}>
                · {hiddenCount} tidak dihitung
              </span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <Btn kind="ghost" size="sm" icon={Icon.arrowLR(14)} onClick={() => setShowTransferModal(true)}>Transfer</Btn>
          <Btn kind="primary" size="sm" icon={Icon.plus(14)} onClick={() => setShowAddModal(true)}>
            Tambah Rekening
          </Btn>
        </div>
      </div>

      {/* Summary banner */}
      <div style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: T.radius.lg,
        padding: '22px 28px',
        marginBottom: 22,
        display: 'grid',
        gridTemplateColumns: summaryGridCols,
        gap: 28,
      }}>
        {/* Total */}
        <div>
          <div style={{
            fontSize: 11.5, fontWeight: 600, color: T.textMuted,
            letterSpacing: 0.3, marginBottom: 8,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            TOTAL ASET
            {hiddenCount > 0 && (
              <span style={{
                fontSize: 10, fontWeight: 600, color: T.textMuted,
                background: T.surfaceAlt, border: `1px solid ${T.border}`,
                borderRadius: 4, padding: '1px 5px',
              }}>
                {hiddenCount} DISEMBUNYIKAN
              </span>
            )}
          </div>
          <div style={{
            fontSize: 32, fontWeight: 700, color: T.text,
            letterSpacing: -1, fontVariantNumeric: 'tabular-nums',
          }}>
            {formatRp(totalBalance)}
          </div>
          <div style={{
            fontSize: 12, color: monthlyNet >= 0 ? T.primaryDark : T.danger, fontWeight: 600,
            marginTop: 6, display: 'flex', alignItems: 'center', gap: 4,
          }}>
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
            <div key={i} style={{
              background: g.tint,
              borderRadius: 12, padding: '16px 18px',
              border: `1px solid ${g.color}30`,
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: 0.3, marginBottom: 4 }}>
                {g.label}
              </div>
              <div style={{
                fontSize: 19, fontWeight: 700, color: g.color,
                letterSpacing: -0.4, fontVariantNumeric: 'tabular-nums',
              }}>
                {formatRp(bal)}
              </div>
              <div style={{ fontSize: 11.5, color: T.textMuted, marginTop: 3 }}>
                {count} rekening
              </div>
            </div>
          );
        })}
      </div>

      {/* Account grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
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
