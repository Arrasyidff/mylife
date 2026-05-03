"use client";
import { useState } from 'react';
import { useScrollLock } from '@/lib/hooks/useScrollLock';
import { T } from '@/lib/tokens';
import { Icon } from '@/components/ui/icon';
import { CatBubble } from '@/components/dashboard/cat-bubble';
import { UserBadge } from '@/components/dashboard/user-badge';
import { Btn } from '@/components/ui/btn';
import { accounts, budgets, type Transaction } from '@/lib/dashboard-data';
import { formatRp, nowDatetimeLocal, fromDatetimeLocal } from '@/lib/format';

const TX_TYPES = [
  { id: 'expense',  label: 'Pengeluaran', color: T.danger  },
  { id: 'income',   label: 'Pemasukan',   color: T.primary },
  { id: 'transfer', label: 'Transfer',    color: '#1846A8' },
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
  { id: 'salary',   name: 'Gaji'    },
  { id: 'fun',      name: 'Bonus'   },
  { id: 'home',     name: 'Sewa'    },
  { id: 'edu',      name: 'Lainnya' },
];

const ADMIN_FEE_DEFAULT = 2_500;

interface AddTransactionModalProps {
  onClose: () => void;
  onSave: (txs: Omit<Transaction, 'id'>[]) => void;
  initialType?: TxTypeId;
}

function Field({ label, children, hint }: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-4">
      <div className="text-[11px] font-bold text-[#7D9590] mb-1.5 tracking-[0.5px]">
        {label.toUpperCase()}
      </div>
      {children}
      {hint && <div className="text-[11.5px] text-[#A4B8B2] mt-1.5">{hint}</div>}
    </div>
  );
}

function InputRow({ children, suffix, error }: {
  children: React.ReactNode;
  suffix?: React.ReactNode;
  error?: boolean;
}) {
  return (
    <div className={`flex items-center bg-[#F6F9F7] rounded-[9px] px-3 py-2.5 text-[13.5px] text-[#1A2420] border ${error ? 'border-[#C0392B]' : 'border-[#E0EAE6]'}`}>
      <div className="flex-1 min-w-0">{children}</div>
      {suffix}
    </div>
  );
}

export function AddTransactionModal({ onClose, onSave, initialType }: AddTransactionModalProps) {
  useScrollLock();
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
  const [adminFeeRaw,  setAdminFeeRaw]  = useState(String(ADMIN_FEE_DEFAULT));
  const [errors,       setErrors]       = useState<{ amount?: string; merch?: string; toAcct?: string }>({});

  const amountNum = Number(amountRaw.replace(/\./g, '') || '0');
  const amountDisplay = amountNum > 0 ? amountNum.toLocaleString('id-ID') : '';

  const fromAcct = accounts.find(a => a.id === selectedAcct);
  const toAcct   = accounts.find(a => a.id === toAcctId);
  const isInterBankTransfer =
    txType === 'transfer' &&
    fromAcct?.type === 'tabungan' &&
    toAcct?.type   === 'tabungan' &&
    selectedAcct !== toAcctId;

  const selectedCat = txType === 'transfer' ? 'transfer'
    : txType === 'income' ? incomeCat
    : expenseCat;

  const cats = txType === 'income' ? INCOME_CATS : EXPENSE_CATS;

  const budget = budgets.find(b => b.cat === selectedCat);
  const budgetPct = budget ? Math.round((budget.used / budget.total) * 100) : 0;
  const showBudgetWarning = txType === 'expense' && !!budget && budgetPct >= 75;

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

    const toName    = accounts.find(a => a.id === toAcctId)?.name ?? 'Rekening';
    const autoMerch = txType === 'transfer' && !merch.trim()
      ? `Transfer ke ${toName}`
      : merch.trim();

    const sign = txType === 'income' ? 1 : -1;
    const mainTx: Omit<Transaction, 'id'> = {
      user:   selectedUser,
      cat:    selectedCat,
      merch:  autoMerch,
      acct:   selectedAcct,
      amount: sign * amountNum,
      date:   fromDatetimeLocal(dateVal),
      type:   txType,
      note:   note.trim() || undefined,
    };

    if (isInterBankTransfer) {
      const adminFee = Number(adminFeeRaw) || 0;
      const feeTx: Omit<Transaction, 'id'> = {
        user:   selectedUser,
        cat:    'bills',
        merch:  `Biaya Admin Transfer ke ${toName}`,
        acct:   selectedAcct,
        amount: -adminFee,
        date:   fromDatetimeLocal(dateVal),
        type:   'expense',
      };
      onSave(adminFee > 0 ? [mainTx, feeTx] : [mainTx]);
    } else {
      onSave([mainTx]);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[rgba(20,30,25,0.4)] backdrop-blur-[2px] z-40"
      />

      {/* Panel — full-screen on mobile, right drawer on sm+ */}
      <div className="fixed inset-0 sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[480px] bg-white flex flex-col overflow-hidden z-50 shadow-[-16px_0_40px_rgba(20,30,25,0.18),-1px_0_0_rgba(20,30,25,0.06)]">

        {/* Header */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-[#EEF2F0] flex items-start justify-between shrink-0">
          <div>
            <div className="text-[11px] text-[#1D9E75] font-bold tracking-[0.5px] mb-0.5">
              TRANSAKSI BARU
            </div>
            <h2 className="m-0 text-lg sm:text-[19px] font-bold tracking-[-0.4px] text-[#1A2420]">
              Tambah Transaksi
            </h2>
            <div className="text-xs sm:text-[12.5px] text-[#7D9590] mt-1">
              Catat pengeluaran, pemasukan, atau transfer
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border-none bg-[#F6F9F7] cursor-pointer text-[#7D9590] flex items-center justify-center shrink-0 mt-0.5"
          >
            {Icon.close(16)}
          </button>
        </div>

        {/* Body */}
        <div className="px-5 sm:px-6 py-5 overflow-y-auto flex-1">

          {/* Type toggle */}
          <div className="flex gap-1.5 p-1 bg-[#F6F9F7] rounded-[11px] border border-[#E0EAE6] mb-5">
            {TX_TYPES.map(tt => {
              const active = tt.id === txType;
              return (
                <button
                  key={tt.id}
                  onClick={() => setTxType(tt.id)}
                  className="flex-1 py-2 sm:py-2.5 px-2 rounded-lg border-none cursor-pointer font-bold text-[13px] transition-all duration-150"
                  style={{
                    background: active ? '#FFFFFF' : 'transparent',
                    color: active ? tt.color : T.textMuted,
                    boxShadow: active ? '0 1px 4px rgba(20,30,25,0.08)' : 'none',
                  }}
                >
                  {tt.label}
                </button>
              );
            })}
          </div>

          {/* Amount */}
          <div className="mb-5 text-center">
            <div className="text-[11px] font-bold text-[#7D9590] tracking-[0.5px] mb-2">
              JUMLAH
            </div>
            <div className="inline-flex items-baseline gap-1.5">
              <span className="text-lg text-[#A4B8B2] font-semibold">Rp</span>
              <input
                autoFocus
                value={amountDisplay}
                onChange={handleAmountKey}
                placeholder="0"
                inputMode="numeric"
                className="text-4xl font-bold tracking-[-1px] bg-transparent border-none outline-none text-right tabular-nums min-w-[60px] max-w-[240px]"
                style={{
                  color: amountColor,
                  width: Math.max((amountDisplay.length || 1) * 24, 60) + 'px',
                }}
              />
            </div>
            {errors.amount && (
              <div className="text-[11.5px] text-[#C0392B] mt-1.5">{errors.amount}</div>
            )}
          </div>

          {/* Merchant */}
          <Field label="Merchant / Keterangan">
            <InputRow error={!!errors.merch}>
              <input
                value={merch}
                onChange={e => { setMerch(e.target.value); if (errors.merch) setErrors(p => ({ ...p, merch: undefined })); }}
                placeholder="Misal: Kopi Kenangan, Gaji Bulanan…"
                className="w-full border-none outline-none bg-transparent text-[13.5px] text-[#1A2420]"
              />
            </InputRow>
            {errors.merch && (
              <div className="text-[11.5px] text-[#C0392B] mt-1">{errors.merch}</div>
            )}
          </Field>

          {/* Category — hidden for transfer */}
          {txType !== 'transfer' && (
            <Field label="Kategori">
              <div className="grid grid-cols-4 gap-2">
                {cats.map(c => {
                  const active = c.id === selectedCat;
                  return (
                    <button
                      key={c.id}
                      onClick={() => txType === 'income' ? setIncomeCat(c.id) : setExpenseCat(c.id)}
                      className={`flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-[10px] cursor-pointer border transition-all duration-[120ms] ${
                        active
                          ? 'bg-[#E6F6F0] border-[#1D9E75]'
                          : 'bg-[#F6F9F7] border-[#E0EAE6]'
                      }`}
                    >
                      <CatBubble cat={c.id} size={32} />
                      <span className={`text-[10.5px] font-bold ${active ? 'text-[#15735A]' : 'text-[#7D9590]'}`}>
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
            <div className="flex gap-2.5 px-3.5 py-3 bg-[#FDF1DD] border border-[#F4D7A0] rounded-[10px] mb-4">
              <span className="text-[#D4860B] shrink-0 mt-0.5">{Icon.warn(16)}</span>
              <div>
                <div className="text-[12.5px] font-bold text-[#8C5A0E] mb-0.5">
                  Anggaran {budget.name} sudah {budgetPct}% terpakai
                </div>
                <div className="text-[11.5px] text-[#8C5A0E] leading-[1.4]">
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
                <div className="flex flex-col gap-1.5">
                  {accounts.map(a => {
                    const active = a.id === selectedAcct;
                    return (
                      <button
                        key={a.id}
                        onClick={() => setSelectedAcct(a.id)}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[9px] cursor-pointer text-left border ${
                          active ? 'bg-[#E6F6F0] border-[#1D9E75]' : 'bg-[#F6F9F7] border-[#E0EAE6]'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: a.color }} />
                        <span className="flex-1 text-[13px] font-semibold text-[#1A2420]">{a.name}</span>
                        <span className="text-[11.5px] text-[#A4B8B2] tabular-nums">{formatRp(a.balance)}</span>
                        {active && <span className="text-[#1D9E75]">{Icon.check(14)}</span>}
                      </button>
                    );
                  })}
                </div>
              </Field>
              <Field label="Rekening Tujuan">
                <div className="flex flex-col gap-1.5">
                  {accounts.map(a => {
                    const active = a.id === toAcctId;
                    const isSame = a.id === selectedAcct;
                    return (
                      <button
                        key={a.id}
                        onClick={() => { setToAcctId(a.id); if (errors.toAcct) setErrors(p => ({ ...p, toAcct: undefined })); }}
                        disabled={isSame}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[9px] text-left border ${
                          active ? 'bg-[#E6F6F0] border-[#1D9E75]' : 'bg-[#F6F9F7] border-[#E0EAE6]'
                        } ${isSame ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
                      >
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: a.color }} />
                        <span className="flex-1 text-[13px] font-semibold text-[#1A2420]">{a.name}</span>
                        <span className="text-[11.5px] text-[#A4B8B2] tabular-nums">{formatRp(a.balance)}</span>
                        {active && <span className="text-[#1D9E75]">{Icon.check(14)}</span>}
                      </button>
                    );
                  })}
                </div>
                {errors.toAcct && (
                  <div className="text-[11.5px] text-[#C0392B] mt-1">{errors.toAcct}</div>
                )}
              </Field>
            </>
          ) : (
            <Field label="Rekening">
              <div className="flex flex-col gap-1.5">
                {accounts.map(a => {
                  const active = a.id === selectedAcct;
                  return (
                    <button
                      key={a.id}
                      onClick={() => setSelectedAcct(a.id)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[9px] cursor-pointer text-left border ${
                        active ? 'bg-[#E6F6F0] border-[#1D9E75]' : 'bg-[#F6F9F7] border-[#E0EAE6]'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: a.color }} />
                      <span className="flex-1 text-[13px] font-semibold text-[#1A2420]">{a.name}</span>
                      <span className="text-[11.5px] text-[#A4B8B2] tabular-nums">{formatRp(a.balance)}</span>
                      {active && <span className="text-[#1D9E75]">{Icon.check(14)}</span>}
                    </button>
                  );
                })}
              </div>
            </Field>
          )}

          {/* Inter-bank admin fee notice */}
          {isInterBankTransfer && (
            <div className="px-3.5 py-3 bg-[#EEF4FF] border border-[#BFCFEF] rounded-[10px] mb-4">
              <div className="flex gap-2.5 mb-2.5">
                <span className="text-[#1846A8] shrink-0 mt-0.5">{Icon.warn(16)}</span>
                <div className="text-[12.5px] font-bold text-[#1B3A8C]">
                  Biaya Admin Beda Bank
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#1B3A8C] flex-1">
                  Biaya transfer (dicatat terpisah):
                </span>
                <div className="flex items-center gap-1 bg-white border border-[#BFCFEF] rounded-[7px] px-2.5 py-1.5">
                  <span className="text-[12px] text-[#1B3A8C] font-semibold">Rp</span>
                  <input
                    value={adminFeeRaw === '0' ? '' : Number(adminFeeRaw).toLocaleString('id-ID')}
                    onChange={e => setAdminFeeRaw(e.target.value.replace(/\D/g, '') || '0')}
                    inputMode="numeric"
                    placeholder={ADMIN_FEE_DEFAULT.toLocaleString('id-ID')}
                    className="border-none outline-none bg-transparent text-[13px] font-bold text-[#1B3A8C] w-20 text-right tabular-nums"
                  />
                </div>
              </div>
              {Number(adminFeeRaw) === 0 && (
                <div className="text-[11px] text-[#1B3A8C] mt-1.5 opacity-70">
                  Biaya 0 — hanya transfer yang akan dicatat.
                </div>
              )}
            </div>
          )}

          {/* Date + User */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Tanggal & Waktu">
              <input
                type="datetime-local"
                value={dateVal}
                onChange={e => setDateVal(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#F6F9F7] border border-[#E0EAE6] rounded-[9px] text-[13px] text-[#1A2420] outline-none box-border"
              />
            </Field>
            <Field label="Pencatat">
              <div className="flex gap-1.5">
                {(['H', 'W'] as const).map(u => {
                  const active = u === selectedUser;
                  return (
                    <button
                      key={u}
                      onClick={() => setSelectedUser(u)}
                      className={`flex-1 py-2.5 px-2 rounded-[9px] cursor-pointer flex items-center justify-center gap-1.5 border ${
                        active
                          ? u === 'H'
                            ? 'bg-[#E6F6F0] border-[#1D9E75]'
                            : 'bg-[#FBE9F2] border-[#A82672]'
                          : 'bg-[#F6F9F7] border-[#E0EAE6]'
                      }`}
                    >
                      <UserBadge user={u} size={20} />
                      <span className={`text-[12.5px] font-bold ${active ? 'text-[#1A2420]' : 'text-[#7D9590]'}`}>
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
                className="w-full border-none outline-none bg-transparent text-[13.5px] text-[#1A2420]"
              />
            </InputRow>
          </Field>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-[#EEF2F0] flex gap-2.5 bg-[#F6F9F7] shrink-0">
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
