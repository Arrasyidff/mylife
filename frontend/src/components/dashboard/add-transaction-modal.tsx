"use client";
import { useState } from 'react';
import { T } from '@/lib/tokens';
import { Icon } from '@/components/ui/icon';
import { CatBubble } from '@/components/dashboard/cat-bubble';
import { UserBadge } from '@/components/dashboard/user-badge';
import { Btn } from '@/components/ui/btn';
import { accounts, budgets, type Transaction } from '@/lib/dashboard-data';
import { formatRp, nowDatetimeLocal, fromDatetimeLocal } from '@/lib/format';

const TX_TYPES = [
  { id: 'expense',  label: 'Pengeluaran', color: T.danger,  },
  { id: 'income',   label: 'Pemasukan',   color: T.primary, },
  { id: 'transfer', label: 'Transfer',    color: '#1846A8', },
] as const;

type TxTypeId = typeof TX_TYPES[number]['id'];

const EXPENSE_CATS = [
  { id: 'food',      name: 'Makanan'    },
  { id: 'transport', name: 'Transport'  },
  { id: 'shopping',  name: 'Belanja'    },
  { id: 'bills',     name: 'Tagihan'    },
  { id: 'health',    name: 'Kesehatan'  },
  { id: 'home',      name: 'Rumah'      },
  { id: 'fun',       name: 'Hiburan'    },
  { id: 'edu',       name: 'Pendidikan' },
];

const INCOME_CATS = [
  { id: 'salary',   name: 'Gaji'      },
  { id: 'fun',      name: 'Bonus'     },
  { id: 'home',     name: 'Sewa'      },
  { id: 'edu',      name: 'Lainnya'   },
];

interface AddTransactionModalProps {
  onClose: () => void;
  onSave: (tx: Omit<Transaction, 'id'>) => void;
  initialType?: TxTypeId;
}

function Field({ label, children, hint }: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, marginBottom: 7, letterSpacing: 0.5 }}>
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

export function AddTransactionModal({ onClose, onSave, initialType }: AddTransactionModalProps) {
  const [txType,       setTxType]       = useState<TxTypeId>(initialType ?? 'expense');
  const [amountRaw,    setAmountRaw]    = useState('');
  const [merch,        setMerch]        = useState('');
  const [expenseCat,   setExpenseCat]   = useState('food');
  const [incomeCat,    setIncomeCat]    = useState('salary');
  const [selectedAcct, setSelectedAcct] = useState(accounts[0].id);
  const [toAcctId,     setToAcctId]     = useState(accounts[1]?.id ?? accounts[0].id);
  const [dateVal,      setDateVal]      = useState(nowDatetimeLocal);
  const [selectedUser, setSelectedUser] = useState<'H' | 'W'>('W');
  const [note,         setNote]         = useState('');
  const [errors,       setErrors]       = useState<{ amount?: string; merch?: string; toAcct?: string }>({});

  const amountNum = Number(amountRaw.replace(/\./g, '') || '0');
  const amountDisplay = amountNum > 0 ? amountNum.toLocaleString('id-ID') : '';

  const selectedCat = txType === 'transfer' ? 'transfer'
    : txType === 'income' ? incomeCat
    : expenseCat;

  const cats = txType === 'income' ? INCOME_CATS : EXPENSE_CATS;

  const budget = budgets.find(b => b.cat === selectedCat);
  const budgetPct = budget ? Math.round((budget.used / budget.total) * 100) : 0;
  const showBudgetWarning = txType === 'expense' && !!budget && budgetPct >= 75;

  const acct = accounts.find(a => a.id === selectedAcct) ?? accounts[0];

  const amountColor =
    txType === 'income'   ? T.primaryDark :
    txType === 'transfer' ? '#1846A8'     : T.danger;

  function handleAmountKey(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '');
    setAmountRaw(digits);
    if (errors.amount) setErrors(p => ({ ...p, amount: undefined }));
  }

  function handleSave() {
    const errs: typeof errors = {};
    if (!amountNum) errs.amount = 'Masukkan jumlah transaksi';
    if (txType !== 'transfer' && !merch.trim()) errs.merch = 'Masukkan nama merchant';
    if (txType === 'transfer' && selectedAcct === toAcctId) errs.toAcct = 'Rekening tujuan harus berbeda';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const autoMerch = txType === 'transfer' && !merch.trim()
      ? `Transfer ke ${accounts.find(a => a.id === toAcctId)?.name ?? 'Rekening'}`
      : merch.trim();

    const sign = txType === 'income' ? 1 : -1;
    onSave({
      user:  selectedUser,
      cat:   selectedCat,
      merch: autoMerch,
      acct:  selectedAcct,
      amount: sign * amountNum,
      date:  fromDatetimeLocal(dateVal),
      type:  txType,
      note:  note.trim() || undefined,
    });
  }

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
        top: 0, right: 0, bottom: 0,
        width: 480,
        background: T.surface,
        boxShadow: '-16px 0 40px rgba(20,30,25,0.18), -1px 0 0 rgba(20,30,25,0.06)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 50,
        fontFamily: T.fontSans,
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: `1px solid ${T.divider}`,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: 11, color: T.primary, fontWeight: 700, letterSpacing: 0.5, marginBottom: 3 }}>TRANSAKSI BARU</div>
            <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700, letterSpacing: -0.4, color: T.text }}>
              Tambah Transaksi
            </h2>
            <div style={{ fontSize: 12.5, color: T.textMuted, marginTop: 4 }}>
              Catat pengeluaran, pemasukan, atau transfer
            </div>
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

        <div style={{ padding: '22px 24px', overflowY: 'auto', flex: 1 }}>
          {/* Type toggle */}
          <div style={{
            display: 'flex', gap: 6, padding: 4,
            background: T.surfaceAlt, borderRadius: 11,
            border: `1px solid ${T.border}`, marginBottom: 20,
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
                    fontWeight: 700, fontSize: 13,
                    fontFamily: T.fontSans,
                    boxShadow: active ? '0 1px 4px rgba(20,30,25,0.08)' : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  {tt.label}
                </button>
              );
            })}
          </div>

          {/* Amount */}
          <div style={{ marginBottom: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, letterSpacing: 0.5, marginBottom: 8 }}>
              JUMLAH
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 18, color: T.textSubtle, fontWeight: 600 }}>Rp</span>
              <input
                autoFocus
                value={amountDisplay}
                onChange={handleAmountKey}
                placeholder="0"
                inputMode="numeric"
                style={{
                  fontSize: 40, fontWeight: 700, letterSpacing: -1,
                  color: amountColor,
                  fontVariantNumeric: 'tabular-nums',
                  background: 'transparent',
                  border: 'none', outline: 'none',
                  width: Math.max((amountDisplay.length || 1) * 24, 60) + 'px',
                  minWidth: 60, maxWidth: 240,
                  textAlign: 'right',
                  fontFamily: T.fontSans,
                }}
              />
            </div>
            {errors.amount && (
              <div style={{ fontSize: 11.5, color: T.danger, marginTop: 6 }}>{errors.amount}</div>
            )}
          </div>

          {/* Merchant */}
          <Field label="Merchant / Keterangan">
            <InputRow style={{ borderColor: errors.merch ? T.danger : T.border }}>
              <input
                value={merch}
                onChange={e => { setMerch(e.target.value); if (errors.merch) setErrors(p => ({ ...p, merch: undefined })); }}
                placeholder="Misal: Kopi Kenangan, Gaji Bulanan…"
                style={{
                  width: '100%', border: 'none', outline: 'none',
                  background: 'transparent', fontSize: 13.5, color: T.text,
                  fontFamily: T.fontSans,
                }}
              />
            </InputRow>
            {errors.merch && (
              <div style={{ fontSize: 11.5, color: T.danger, marginTop: 4 }}>{errors.merch}</div>
            )}
          </Field>

          {/* Category (not shown for transfer) */}
          {txType !== 'transfer' && (
            <Field label="Kategori">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {cats.map(c => {
                  const active = c.id === selectedCat;
                  return (
                    <button
                      key={c.id}
                      onClick={() => txType === 'income' ? setIncomeCat(c.id) : setExpenseCat(c.id)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        gap: 6, padding: '11px 4px',
                        background: active ? T.primaryLight : T.surfaceAlt,
                        border: `1px solid ${active ? T.primary : T.border}`,
                        borderRadius: 10, cursor: 'pointer',
                        fontFamily: T.fontSans, transition: 'all 0.12s',
                      }}
                    >
                      <CatBubble cat={c.id} size={32} />
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: active ? T.primaryDark : T.textMuted }}>
                        {c.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Field>
          )}

          {/* Budget warning */}
          {showBudgetWarning && budget && (
            <div style={{
              display: 'flex', gap: 11, padding: '12px 14px',
              background: T.warningLight, border: `1px solid #F4D7A0`,
              borderRadius: 10, marginBottom: 16,
            }}>
              <span style={{ color: T.warning, flexShrink: 0, marginTop: 1 }}>{Icon.warn(16)}</span>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#8C5A0E', marginBottom: 2 }}>
                  Anggaran {budget.name} sudah {budgetPct}% terpakai
                </div>
                <div style={{ fontSize: 11.5, color: '#8C5A0E', lineHeight: 1.4 }}>
                  {formatRp(budget.used)} dari {formatRp(budget.total)}.{' '}
                  {budgetPct >= 100 ? 'Transaksi ini akan menambah selisih.' : 'Mendekati batas anggaran.'}
                </div>
              </div>
            </div>
          )}

          {/* Account */}
          {txType === 'transfer' ? (
            <>
              <Field label="Rekening Asal">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {accounts.map(a => {
                    const active = a.id === selectedAcct;
                    return (
                      <button
                        key={a.id}
                        onClick={() => setSelectedAcct(a.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 12px',
                          background: active ? T.primaryLight : T.surfaceAlt,
                          border: `1px solid ${active ? T.primary : T.border}`,
                          borderRadius: 9, cursor: 'pointer',
                          fontFamily: T.fontSans, textAlign: 'left',
                        }}
                      >
                        <span style={{ width: 9, height: 9, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
                        <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: T.text }}>{a.name}</span>
                        <span style={{ fontSize: 11.5, color: T.textSubtle, fontVariantNumeric: 'tabular-nums' }}>
                          {formatRp(a.balance)}
                        </span>
                        {active && <span style={{ color: T.primary }}>{Icon.check(14)}</span>}
                      </button>
                    );
                  })}
                </div>
              </Field>
              <Field label="Rekening Tujuan">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {accounts.map(a => {
                    const active = a.id === toAcctId;
                    const isSame = a.id === selectedAcct;
                    return (
                      <button
                        key={a.id}
                        onClick={() => { setToAcctId(a.id); if (errors.toAcct) setErrors(p => ({ ...p, toAcct: undefined })); }}
                        disabled={isSame}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 12px',
                          background: active ? T.primaryLight : isSame ? T.surfaceAlt : T.surfaceAlt,
                          border: `1px solid ${active ? T.primary : T.border}`,
                          borderRadius: 9, cursor: isSame ? 'not-allowed' : 'pointer',
                          fontFamily: T.fontSans, textAlign: 'left',
                          opacity: isSame ? 0.4 : 1,
                        }}
                      >
                        <span style={{ width: 9, height: 9, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
                        <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: T.text }}>{a.name}</span>
                        <span style={{ fontSize: 11.5, color: T.textSubtle, fontVariantNumeric: 'tabular-nums' }}>
                          {formatRp(a.balance)}
                        </span>
                        {active && <span style={{ color: T.primary }}>{Icon.check(14)}</span>}
                      </button>
                    );
                  })}
                </div>
                {errors.toAcct && (
                  <div style={{ fontSize: 11.5, color: T.danger, marginTop: 4 }}>{errors.toAcct}</div>
                )}
              </Field>
            </>
          ) : (
            <Field label="Rekening">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {accounts.map(a => {
                  const active = a.id === selectedAcct;
                  return (
                    <button
                      key={a.id}
                      onClick={() => setSelectedAcct(a.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 12px',
                        background: active ? T.primaryLight : T.surfaceAlt,
                        border: `1px solid ${active ? T.primary : T.border}`,
                        borderRadius: 9, cursor: 'pointer',
                        fontFamily: T.fontSans, textAlign: 'left',
                      }}
                    >
                      <span style={{ width: 9, height: 9, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: T.text }}>{a.name}</span>
                      <span style={{ fontSize: 11.5, color: T.textSubtle, fontVariantNumeric: 'tabular-nums' }}>
                        {formatRp(a.balance)}
                      </span>
                      {active && <span style={{ color: T.primary }}>{Icon.check(14)}</span>}
                    </button>
                  );
                })}
              </div>
            </Field>
          )}

          {/* Date + User */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Tanggal & Waktu">
              <input
                type="datetime-local"
                value={dateVal}
                onChange={e => setDateVal(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px',
                  background: T.surfaceAlt,
                  border: `1px solid ${T.border}`,
                  borderRadius: 9, fontSize: 13, color: T.text,
                  fontFamily: T.fontSans, outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
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
                        flex: 1, padding: '10px 8px', borderRadius: 9,
                        background: active ? (u === 'H' ? T.primaryLight : '#FBE9F2') : T.surfaceAlt,
                        border: `1px solid ${active ? (u === 'H' ? T.primary : '#A82672') : T.border}`,
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                        fontFamily: T.fontSans,
                      }}
                    >
                      <UserBadge user={u} size={20} />
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: active ? T.text : T.textMuted }}>
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
              <input
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Misal: belanja mingguan, bonus Q1…"
                style={{
                  width: '100%', border: 'none', outline: 'none',
                  background: 'transparent', fontSize: 13.5, color: T.text,
                  fontFamily: T.fontSans,
                }}
              />
            </InputRow>
          </Field>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: `1px solid ${T.divider}`,
          display: 'flex', gap: 10,
          background: T.surfaceAlt,
          flexShrink: 0,
        }}>
          <Btn kind="ghost" onClick={onClose} style={{ flex: 1, justifyContent: 'center', padding: '10px' }}>
            Batal
          </Btn>
          <Btn
            kind="primary"
            icon={Icon.check(14)}
            onClick={handleSave}
            style={{ flex: 2, justifyContent: 'center', padding: '10px' }}
          >
            Simpan {txType === 'income' ? 'Pemasukan' : txType === 'transfer' ? 'Transfer' : 'Pengeluaran'}
          </Btn>
        </div>
      </div>
    </>
  );
}
