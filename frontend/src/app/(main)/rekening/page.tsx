"use client";
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { T } from '@/lib/tokens';
import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';
import { type Account } from '@/lib/dashboard-data';
import { formatRp, formatTxDate } from '@/lib/format';
import { AddAccountModal } from '@/components/dashboard/add-account-modal';
import { EditAccountModal } from '@/components/dashboard/edit-account-modal';
import { AddTransactionModal } from '@/components/dashboard/add-transaction-modal';
import { CheckCircle, XCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { accountService } from '@/lib/services/account';

const GROUP_CONFIG = [
  { label: 'TABUNGAN',     types: ['tabungan']    as const, color: T.info,    tint: T.infoLight    },
  { label: 'E-WALLET',     types: ['ewallet']     as const, color: T.primary, tint: T.primaryLight },
  { label: 'TUNAI',        types: ['tunai']        as const, color: T.warning, tint: T.warningLight },
  { label: 'INVESTASI',    types: ['investasi']   as const, color: '#5C815B', tint: '#EDF4EC'      },
  { label: 'KARTU KREDIT', types: ['kartukredit'] as const, color: T.danger,  tint: T.dangerLight  },
];

function AccountDetailCard({
  acct,
  isHidden,
  onEdit,
  onToggleHide,
}: {
  acct: Account;
  isHidden: boolean;
  onEdit: () => void;
  onToggleHide: () => void;
}) {
  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: T.radius.lg,
      overflow: 'hidden',
      opacity: isHidden ? 0.55 : 1,
      transition: 'opacity 0.2s',
    }}>
      {/* Colored header */}
      <div style={{
        background: isHidden ? T.surfaceAlt : acct.color + '12',
        borderBottom: `1px solid ${isHidden ? T.divider : acct.color + '28'}`,
        padding: '18px 20px',
        display: 'flex', alignItems: 'flex-start', gap: 14,
      }}>
        <div style={{
          width: 46, height: 46, borderRadius: 13,
          background: isHidden ? T.textMuted + '30' : acct.color, color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, letterSpacing: 0.4,
          flexShrink: 0,
        }}>
          {acct.glyph}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text, display: 'flex', alignItems: 'center', gap: 8 }}>
            {acct.name}
            {isHidden && (
              <span style={{
                fontSize: 10, fontWeight: 600, color: T.textMuted,
                background: T.surfaceAlt, border: `1px solid ${T.border}`,
                borderRadius: 4, padding: '1px 6px', letterSpacing: 0.3,
              }}>
                TIDAK DIHITUNG
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 2 }}>{acct.subtitle}</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={onToggleHide}
            title={isHidden ? 'Masukkan ke total aset' : 'Keluarkan dari total aset'}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 30, height: 30, borderRadius: 7,
              border: `1px solid ${isHidden ? T.borderStrong : T.border}`,
              background: isHidden ? T.surfaceAlt : T.surface,
              color: T.textMuted,
              cursor: 'pointer',
            }}
          >
            {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
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
      </div>

      {/* Balance */}
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
      </div>

      {/* Footer */}
      <div style={{ padding: '16px 20px 18px' }}>
        <Link href="/transaksi" style={{
          display: 'block', textAlign: 'center',
          width: '100%', padding: '9px',
          borderRadius: 8,
          border: `1px solid ${T.border}`,
          background: T.surfaceAlt,
          color: T.primaryDark,
          fontSize: 12.5, fontWeight: 600,
          textDecoration: 'none', fontFamily: T.fontSans,
          boxSizing: 'border-box',
        }}>
          Lihat semua transaksi →
        </Link>
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
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
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

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { accounts: data } = await accountService.list(true);
      setAccounts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat rekening');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

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

  async function handleToggleHide(id: string) {
    const acct = accounts.find(a => a.id === id);
    if (!acct) return;
    const newHidden = !acct.hidden;
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, hidden: newHidden } : a));
    try {
      await accountService.update(id, { hidden: newHidden });
    } catch {
      // revert on failure
      setAccounts(prev => prev.map(a => a.id === id ? { ...a, hidden: acct.hidden } : a));
      showToast('Gagal memperbarui visibilitas rekening', false);
    }
  }

  const visibleAccounts = accounts.filter(a => !a.hidden);
  const totalBalance = visibleAccounts.reduce((s, a) => s + a.balance, 0);
  const hiddenCount = accounts.length - visibleAccounts.length;

  const visibleGroupsWithBalance = GROUP_CONFIG.filter(g =>
    visibleAccounts.some(a => (g.types as readonly string[]).includes(a.type))
  );

  const summaryGridCols = `1.6fr ${visibleGroupsWithBalance.map(() => '1fr').join(' ')}`;

  const now = new Date();
  const monthLabel = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

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
            {loading ? 'Memuat…' : `${accounts.length} rekening aktif · ${monthLabel}`}
            {!loading && hiddenCount > 0 && (
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

      {/* Error state */}
      {error && (
        <div style={{
          background: T.dangerLight, border: `1px solid ${T.danger}33`,
          borderRadius: T.radius.lg, padding: '16px 20px',
          marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <XCircle size={18} color={T.danger} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: T.danger }}>{error}</div>
          </div>
          <button
            onClick={loadAccounts}
            style={{
              padding: '6px 14px', borderRadius: 7,
              border: `1px solid ${T.danger}44`,
              background: T.surface, color: T.danger,
              fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
              fontFamily: T.fontSans,
            }}
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '60px 0', color: T.textMuted, gap: 10,
        }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: 13.5, fontWeight: 500 }}>Memuat rekening…</span>
        </div>
      )}

      {!loading && !error && (
        <>
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
        </>
      )}

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
          onSave={() => {
            setShowTransferModal(false);
            showToast('Transfer berhasil dicatat');
          }}
        />
      )}
    </div>
  );
}
