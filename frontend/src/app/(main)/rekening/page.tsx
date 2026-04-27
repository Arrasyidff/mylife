"use client";
import { useState, useEffect } from 'react';
import { T } from '@/lib/tokens';
import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';
import { accounts as INITIAL_ACCOUNTS, transactions, type Account, type Transaction } from '@/lib/dashboard-data';
import { formatRp, formatTxDate } from '@/lib/format';
import { AddAccountModal } from '@/components/dashboard/add-account-modal';
import { EditAccountModal } from '@/components/dashboard/edit-account-modal';
import { CheckCircle, XCircle } from 'lucide-react';

const GROUP_CONFIG = [
  { label: 'TABUNGAN',     types: ['tabungan']    as const, color: T.info,    tint: T.infoLight    },
  { label: 'E-WALLET',     types: ['ewallet']     as const, color: T.primary, tint: T.primaryLight },
  { label: 'TUNAI',        types: ['tunai']        as const, color: T.warning, tint: T.warningLight },
  { label: 'INVESTASI',    types: ['investasi']   as const, color: '#5C815B', tint: '#EDF4EC'      },
  { label: 'KARTU KREDIT', types: ['kartukredit'] as const, color: T.danger,  tint: T.dangerLight  },
];

function getAccountTxs(acctId: string): Transaction[] {
  return transactions.filter(t => t.acct === acctId);
}

function getAccountStats(acctId: string) {
  const txs = getAccountTxs(acctId);
  const income  = txs.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expense = txs.filter(t => t.amount < 0 && t.type !== 'transfer').reduce((s, t) => s + Math.abs(t.amount), 0);
  return { income, expense, net: income - expense, count: txs.length };
}

function AccountDetailCard({
  acct,
  onEdit,
}: {
  acct: Account;
  onEdit: () => void;
}) {
  const recentTxs = getAccountTxs(acct.id);
  const { income, expense, net } = getAccountStats(acct.id);
  const netColor = net >= 0 ? T.primaryDark : T.danger;

  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: T.radius.lg,
      overflow: 'hidden',
    }}>
      {/* Colored header */}
      <div style={{
        background: acct.color + '12',
        borderBottom: `1px solid ${acct.color}28`,
        padding: '18px 20px',
        display: 'flex', alignItems: 'flex-start', gap: 14,
      }}>
        <div style={{
          width: 46, height: 46, borderRadius: 13,
          background: acct.color, color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, letterSpacing: 0.4,
          flexShrink: 0,
        }}>
          {acct.glyph}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>{acct.name}</div>
          <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 2 }}>{acct.subtitle}</div>
        </div>
        <button
          onClick={onEdit}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '5px 10px', borderRadius: 7,
            border: `1px solid ${T.border}`,
            background: T.surface, color: T.textMuted,
            cursor: 'pointer', fontSize: 12, fontWeight: 600,
            fontFamily: T.fontSans,
          }}
        >
          {Icon.edit(13)} Edit
        </button>
      </div>

      {/* Balance + monthly stats */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, letterSpacing: 0.3, marginBottom: 4 }}>
          SALDO SAAT INI
        </div>
        <div style={{
          fontSize: 28, fontWeight: 700, color: T.text,
          letterSpacing: -0.8, fontVariantNumeric: 'tabular-nums',
        }}>
          {formatRp(acct.balance)}
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          gap: 10, marginTop: 16,
        }}>
          {([
            { label: 'MASUK',  val: income,  bg: T.primaryLight,  fg: T.primaryDark },
            { label: 'KELUAR', val: expense, bg: T.dangerLight,   fg: T.danger      },
            { label: 'NET',    val: net,     bg: net >= 0 ? T.primaryLight : T.dangerLight, fg: netColor },
          ] as const).map((s, i) => (
            <div key={i} style={{ background: s.bg, borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: s.fg, letterSpacing: 0.3, marginBottom: 3 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: s.fg, fontVariantNumeric: 'tabular-nums' }}>
                {i === 2 && net > 0 ? '+' : ''}{formatRp(s.val)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      {recentTxs.length > 0 && (
        <div style={{ padding: '16px 20px 0' }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: T.textMuted,
            letterSpacing: 0.3, marginBottom: 8,
          }}>
            TRANSAKSI TERBARU
          </div>
          <div style={{
            background: T.surfaceAlt,
            borderRadius: 8,
            border: `1px solid ${T.divider}`,
            overflow: 'hidden',
          }}>
            {recentTxs.slice(0, 3).map((t, i, arr) => (
              <div key={t.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px',
                borderBottom: i < arr.length - 1 ? `1px solid ${T.divider}` : 'none',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 12.5, fontWeight: 600, color: T.text,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {t.merch}
                  </div>
                  <div style={{ fontSize: 11, color: T.textSubtle, marginTop: 1 }}>{formatTxDate(t.date)}</div>
                </div>
                <div style={{
                  fontSize: 13, fontWeight: 700,
                  color: t.amount > 0 ? T.primaryDark : T.text,
                  fontVariantNumeric: 'tabular-nums', flexShrink: 0,
                }}>
                  {t.amount > 0 ? '+' : ''}{formatRp(t.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: '12px 20px 18px' }}>
        <button style={{
          width: '100%', padding: '9px',
          borderRadius: 8,
          border: `1px solid ${T.border}`,
          background: T.surfaceAlt,
          color: T.primaryDark,
          fontSize: 12.5, fontWeight: 600,
          cursor: 'pointer', fontFamily: T.fontSans,
        }}>
          Lihat semua transaksi →
        </button>
      </div>
    </div>
  );
}

function AddAccountCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'transparent',
        border: `1.5px dashed ${T.borderStrong}`,
        borderRadius: T.radius.lg,
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 10, minHeight: 240,
        color: T.textMuted, fontFamily: T.fontSans,
      }}
    >
      <div style={{
        width: 46, height: 46, borderRadius: 13,
        border: `1.5px dashed ${T.borderStrong}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {Icon.plus(20)}
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Tambah Rekening</div>
        <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 3 }}>
          Bank, e-wallet, atau tunai
        </div>
      </div>
    </button>
  );
}

type Toast = { msg: string; ok: boolean };

export default function RekeningPage() {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
  }

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  function handleAdd(account: Account) {
    setAccounts(prev => [...prev, account]);
    showToast(`Rekening "${account.name}" berhasil ditambahkan`);
  }

  function handleSave(updated: Account) {
    setAccounts(prev => prev.map(a => a.id === updated.id ? updated : a));
    showToast(`Rekening "${updated.name}" berhasil diperbarui`);
  }

  function handleDelete(id: string) {
    const name = accounts.find(a => a.id === id)?.name ?? '';
    setAccounts(prev => prev.filter(a => a.id !== id));
    showToast(`Rekening "${name}" telah dihapus`, false);
  }

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const monthlyNet = transactions.reduce((s, t) => t.type !== 'transfer' ? s + t.amount : s, 0);

  const visibleGroups = GROUP_CONFIG.filter(g =>
    accounts.some(a => (g.types as readonly string[]).includes(a.type))
  );

  const summaryGridCols = `1.6fr ${visibleGroups.map(() => '1fr').join(' ')}`;

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
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <Btn kind="ghost" size="sm" icon={Icon.arrowLR(14)}>Transfer</Btn>
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
          }}>
            TOTAL SALDO
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
        {visibleGroups.map((g, i) => {
          const bal = accounts
            .filter(a => (g.types as readonly string[]).includes(a.type))
            .reduce((s, a) => s + a.balance, 0);
          const count = accounts.filter(a => (g.types as readonly string[]).includes(a.type)).length;
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
            onEdit={() => setEditingAccount(a)}
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
    </div>
  );
}
