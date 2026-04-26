"use client";
import { useState } from 'react';
import { T } from '@/lib/tokens';
import { Icon } from '@/components/ui/icon';
import { CatBubble } from '@/components/dashboard/cat-bubble';
import { UserBadge } from '@/components/dashboard/user-badge';
import { Btn } from '@/components/ui/btn';
import { accounts, budgets } from '@/lib/dashboard-data';
import { formatRp } from '@/lib/format';

const TX_TYPES = [
  { id: 'expense',  label: 'Pengeluaran', color: T.danger,  bg: T.dangerLight  },
  { id: 'income',   label: 'Pemasukan',   color: T.primary, bg: T.primaryLight },
  { id: 'transfer', label: 'Transfer',    color: '#1846A8', bg: T.infoLight    },
] as const;

type TxTypeId = typeof TX_TYPES[number]['id'];

const CATS = [
  { id: 'food',      name: 'Makanan'    },
  { id: 'transport', name: 'Transport'  },
  { id: 'shopping',  name: 'Belanja'    },
  { id: 'bills',     name: 'Tagihan'    },
  { id: 'health',    name: 'Kesehatan'  },
  { id: 'home',      name: 'Rumah'      },
  { id: 'fun',       name: 'Hiburan'    },
  { id: 'edu',       name: 'Pendidikan' },
];

interface AddTransactionModalProps {
  onClose: () => void;
}

function Field({ label, children, hint }: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 7, letterSpacing: 0.2 }}>
        {label.toUpperCase()}
      </div>
      {children}
      {hint && <div style={{ fontSize: 11.5, color: T.textSubtle, marginTop: 5 }}>{hint}</div>}
    </div>
  );
}

function InputRow({ children, suffix, style }: {
  children: React.ReactNode;
  suffix?: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      background: T.surfaceAlt,
      border: `1px solid ${T.border}`,
      borderRadius: 9, padding: '10px 12px',
      fontSize: 13.5, color: T.text,
      ...style,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
      {suffix}
    </div>
  );
}

export function AddTransactionModal({ onClose }: AddTransactionModalProps) {
  const [txType, setTxType] = useState<TxTypeId>('expense');
  const [selectedCat, setSelectedCat] = useState('shopping');
  const [selectedUser, setSelectedUser] = useState<'H' | 'W'>('W');

  const budget = budgets.find(b => b.cat === selectedCat);
  const budgetPct = budget ? Math.round((budget.used / budget.total) * 100) : 0;
  const showBudgetWarning = !!budget && budgetPct >= 75;

  const acct = accounts[0];

  const amountColor =
    txType === 'income'   ? T.primaryDark :
    txType === 'transfer' ? '#1846A8'     : T.danger;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(20,30,25,0.4)',
          backdropFilter: 'blur(2px)',
          zIndex: 40,
        }}
      />
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 460, maxHeight: '92vh',
        background: T.surface,
        borderRadius: 18,
        boxShadow: '0 24px 64px rgba(20,30,25,0.25), 0 0 0 1px rgba(20,30,25,0.06)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 50,
        fontFamily: T.fontSans,
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 22px',
          borderBottom: `1px solid ${T.divider}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 11, color: T.textSubtle, fontWeight: 600, letterSpacing: 0.4 }}>BARU</div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: -0.3, color: T.text }}>
              Tambah Transaksi
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: 'none', background: T.surfaceAlt,
              cursor: 'pointer', color: T.textMuted,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {Icon.close(16)}
          </button>
        </div>

        <div style={{ padding: '20px 22px', overflow: 'auto' }}>
          {/* Type toggle */}
          <div style={{
            display: 'flex', gap: 6, padding: 4,
            background: T.surfaceAlt, borderRadius: 11,
            border: `1px solid ${T.border}`, marginBottom: 22,
          }}>
            {TX_TYPES.map(tt => {
              const active = tt.id === txType;
              return (
                <button
                  key={tt.id}
                  onClick={() => setTxType(tt.id)}
                  style={{
                    flex: 1, padding: '9px 10px', borderRadius: 8,
                    border: 'none', cursor: 'pointer',
                    background: active ? T.surface : 'transparent',
                    color: active ? tt.color : T.textMuted,
                    fontWeight: 600, fontSize: 13,
                    fontFamily: T.fontSans,
                    boxShadow: active
                      ? '0 1px 2px rgba(20,30,25,0.06), 0 0 0 1px rgba(20,30,25,0.04)'
                      : 'none',
                  }}
                >
                  {tt.label}
                </button>
              );
            })}
          </div>

          {/* Amount display */}
          <div style={{ marginBottom: 22, textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: 0.3, marginBottom: 8 }}>
              JUMLAH
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 18, color: T.textSubtle, fontWeight: 600 }}>Rp</span>
              <span style={{
                fontSize: 42, fontWeight: 700, letterSpacing: -1.2,
                color: amountColor,
                fontVariantNumeric: 'tabular-nums',
              }}>
                385.000
              </span>
            </div>
            <div style={{ fontSize: 11.5, color: T.textSubtle, marginTop: 6 }}>
              tiga ratus delapan puluh lima ribu rupiah
            </div>
          </div>

          {/* Category */}
          <Field label="Kategori">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {CATS.map(c => {
                const active = c.id === selectedCat;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCat(c.id)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      gap: 6, padding: '11px 4px',
                      background: active ? T.primaryLight : T.surfaceAlt,
                      border: `1px solid ${active ? T.primary : T.border}`,
                      borderRadius: 10, cursor: 'pointer',
                      fontFamily: T.fontSans,
                    }}
                  >
                    <CatBubble cat={c.id} size={32} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: active ? T.primaryDark : T.textMuted }}>
                      {c.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Budget warning */}
          {showBudgetWarning && budget && (
            <div style={{
              display: 'flex', gap: 11, padding: '12px 14px',
              background: T.warningLight,
              border: `1px solid #F4D7A0`,
              borderRadius: 10, marginBottom: 18,
            }}>
              <span style={{ color: T.warning, flexShrink: 0, marginTop: 1 }}>
                {Icon.warn(16)}
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#8C5A0E', marginBottom: 2 }}>
                  Anggaran {budget.name} sudah {budgetPct}% terpakai
                </div>
                <div style={{ fontSize: 11.5, color: '#8C5A0E', lineHeight: 1.4 }}>
                  {formatRp(budget.used)} dari {formatRp(budget.total)}.{' '}
                  {budgetPct >= 100
                    ? 'Transaksi ini akan menambah selisih.'
                    : 'Mendekati batas anggaran.'}
                </div>
              </div>
            </div>
          )}

          {/* Account */}
          <Field label="Rekening">
            <InputRow suffix={<span style={{ color: T.textSubtle }}>{Icon.chev()}</span>}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: 4, background: acct.color }} />
                <span style={{ flex: 1, fontWeight: 600, color: T.text }}>{acct.name}</span>
                <span style={{ fontSize: 12, color: T.textSubtle, fontVariantNumeric: 'tabular-nums' }}>
                  {formatRp(acct.balance)}
                </span>
              </div>
            </InputRow>
          </Field>

          {/* Date + User */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Tanggal">
              <InputRow suffix={<span style={{ color: T.textSubtle }}>{Icon.calendar()}</span>}>
                <span style={{ fontWeight: 500, color: T.text }}>25 Apr 2026</span>
              </InputRow>
            </Field>
            <Field label="Pencatat">
              <div style={{ display: 'flex', gap: 6 }}>
                {(['H', 'W'] as const).map(u => {
                  const active = u === selectedUser;
                  return (
                    <button
                      key={u}
                      onClick={() => setSelectedUser(u)}
                      style={{
                        flex: 1, padding: '9px 8px', borderRadius: 9,
                        background: active
                          ? (u === 'H' ? T.primaryLight : '#FBE9F2')
                          : T.surfaceAlt,
                        border: `1px solid ${active
                          ? (u === 'H' ? T.primary : '#A82672')
                          : T.border}`,
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                        fontFamily: T.fontSans,
                      }}
                    >
                      <UserBadge user={u} size={20} />
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: active ? T.text : T.textMuted }}>
                        {u === 'H' ? 'Suami' : 'Istri'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>

          {/* Notes */}
          <Field label="Catatan (opsional)">
            <InputRow>
              <span style={{ color: T.textSubtle, fontStyle: 'italic' }}>Misal: belanja mingguan</span>
            </InputRow>
          </Field>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 22px',
          borderTop: `1px solid ${T.divider}`,
          display: 'flex', gap: 10,
          background: T.surfaceAlt,
        }}>
          <Btn
            kind="ghost"
            onClick={onClose}
            style={{ flex: 1, justifyContent: 'center', padding: '10px' }}
          >
            Batal
          </Btn>
          <Btn
            kind="primary"
            icon={Icon.check(14)}
            style={{ flex: 2, justifyContent: 'center', padding: '10px' }}
          >
            Simpan {txType === 'income' ? 'Pemasukan' : txType === 'transfer' ? 'Transfer' : 'Pengeluaran'}
          </Btn>
        </div>
      </div>
    </>
  );
}
