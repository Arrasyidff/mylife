"use client";
import { useState } from 'react';
import { X, Check, CalendarDays } from 'lucide-react';
import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';
import { CatBubble } from './cat-bubble';

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

const PERIODS = [
  { id: 'weekly',  label: 'Mingguan', hint: 'Reset tiap Senin'     },
  { id: 'monthly', label: 'Bulanan',  hint: 'Reset tiap tanggal 1' },
  { id: 'yearly',  label: 'Tahunan',  hint: 'Reset tiap Januari'   },
];

const PRESETS = [500_000, 1_000_000, 1_500_000, 2_000_000, 3_000_000, 5_000_000];

const AMOUNT_WORDS: Record<number, string> = {
  500_000:   'lima ratus ribu rupiah',
  1_000_000: 'satu juta rupiah',
  1_500_000: 'satu juta lima ratus ribu rupiah',
  2_000_000: 'dua juta rupiah',
  3_000_000: 'tiga juta rupiah',
  5_000_000: 'lima juta rupiah',
};

const TOTAL_EXISTING = 11_600_000;
const MONTHLY_INCOME = 14_750_000;

interface AddBudgetModalProps {
  onClose: () => void;
}

function Field({
  label,
  children,
  hint,
  optional,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  optional?: boolean;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: T.textMuted, letterSpacing: 0.3 }}>
          {label.toUpperCase()}
        </div>
        {optional && <span style={{ fontSize: 11, color: T.textSubtle, fontWeight: 500 }}>opsional</span>}
      </div>
      {children}
      {hint && <div style={{ fontSize: 11.5, color: T.textSubtle, marginTop: 6, lineHeight: 1.45 }}>{hint}</div>}
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (val: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 32,
        height: 18,
        borderRadius: 9,
        background: on ? T.primary : '#D6D8D0',
        position: 'relative',
        flexShrink: 0,
        border: 'none',
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
    >
      <span style={{
        position: 'absolute',
        top: 2,
        left: on ? 16 : 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        background: 'white',
        boxShadow: '0 1px 2px rgba(0,0,0,0.18)',
        transition: 'left 0.15s',
        display: 'block',
      }} />
    </button>
  );
}

export function AddBudgetModal({ onClose }: AddBudgetModalProps) {
  const [selectedCat, setSelectedCat] = useState('fun');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [amount, setAmount] = useState(1_500_000);
  const [notifs, setNotifs] = useState({ pct75: true, pct100: true, weekly: false });
  const [carryOver, setCarryOver] = useState(false);

  const totalAfter = TOTAL_EXISTING + amount;
  const remaining = MONTHLY_INCOME - totalAfter;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(20,30,25,0.35)',
          backdropFilter: 'blur(2px)',
          zIndex: 40,
        }}
      />

      {/* Side panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 480,
        background: T.surface,
        boxShadow: '-16px 0 40px rgba(20,30,25,0.18), -1px 0 0 rgba(20,30,25,0.06)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: `1px solid ${T.divider}`,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 11, color: T.primary, fontWeight: 700, letterSpacing: 0.5, marginBottom: 3 }}>
              ANGGARAN BARU
            </div>
            <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700, letterSpacing: -0.4, color: T.text }}>
              Tambah Anggaran
            </h2>
            <div style={{ fontSize: 12.5, color: T.textMuted, marginTop: 4 }}>
              Tetapkan batas pengeluaran untuk satu kategori
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: 'none',
              background: T.surfaceAlt,
              cursor: 'pointer',
              color: T.textMuted,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px' }}>

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
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                      padding: '11px 4px',
                      background: active ? T.primaryLight : T.surfaceAlt,
                      border: `1px solid ${active ? T.primary : T.border}`,
                      borderRadius: 10,
                      cursor: 'pointer',
                      fontFamily: T.fontSans,
                      position: 'relative',
                    }}
                  >
                    {active && (
                      <span style={{
                        position: 'absolute',
                        top: 5,
                        right: 5,
                        width: 14,
                        height: 14,
                        borderRadius: 7,
                        background: T.primary,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Check size={9} strokeWidth={3} />
                      </span>
                    )}
                    <CatBubble cat={c.id} size={32} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: active ? T.primaryDark : T.textMuted }}>
                      {c.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Amount */}
          <Field label="Batas Anggaran">
            <div style={{
              background: T.primarySoft,
              border: `1.5px solid ${T.primary}`,
              borderRadius: 12,
              padding: '18px 18px 16px',
              textAlign: 'center',
              marginBottom: 10,
            }}>
              <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 18, color: T.primaryDark, fontWeight: 600 }}>Rp</span>
                <span style={{
                  fontSize: 38,
                  fontWeight: 700,
                  letterSpacing: -1,
                  color: T.text,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {amount.toLocaleString('id-ID')}
                </span>
              </div>
              <div style={{ fontSize: 11.5, color: T.primaryDark, marginTop: 4, fontWeight: 500 }}>
                {AMOUNT_WORDS[amount] ?? formatRp(amount)}
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {PRESETS.map(p => {
                const active = p === amount;
                return (
                  <button
                    key={p}
                    onClick={() => setAmount(p)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 999,
                      background: active ? T.primary : T.surface,
                      color: active ? 'white' : T.textMuted,
                      border: `1px solid ${active ? T.primary : T.border}`,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: T.fontSans,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    Rp {p.toLocaleString('id-ID')}
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Period */}
          <Field label="Periode">
            <div style={{ display: 'flex', gap: 8 }}>
              {PERIODS.map(p => {
                const active = p.id === selectedPeriod;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPeriod(p.id)}
                    style={{
                      flex: 1,
                      padding: '12px 10px',
                      borderRadius: 10,
                      background: active ? T.primaryLight : T.surfaceAlt,
                      border: `1px solid ${active ? T.primary : T.border}`,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 3,
                      fontFamily: T.fontSans,
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 600, color: active ? T.primaryDark : T.text }}>
                      {p.label}
                    </span>
                    <span style={{ fontSize: 10.5, color: T.textSubtle }}>{p.hint}</span>
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Start date */}
          <Field label="Mulai Berlaku">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: T.surfaceAlt,
              border: `1px solid ${T.border}`,
              borderRadius: 9,
              padding: '10px 12px',
              fontSize: 13.5,
            }}>
              <span style={{ flex: 1, fontWeight: 500, color: T.text }}>1 Mei 2026</span>
              <CalendarDays size={15} color={T.textSubtle} />
            </div>
          </Field>

          {/* Notification toggles */}
          <Field
            label="Notifikasi"
            hint="Kami akan mengirim peringatan saat anggaran mencapai ambang ini."
          >
            <div style={{
              background: T.surfaceAlt,
              border: `1px solid ${T.border}`,
              borderRadius: 10,
              padding: '4px 14px',
            }}>
              {([
                { key: 'pct75'  as const, label: 'Saat mencapai 75%',  dotColor: T.warning    },
                { key: 'pct100' as const, label: 'Saat mencapai 100%', dotColor: T.danger      },
                { key: 'weekly' as const, label: 'Ringkasan mingguan',  dotColor: T.textSubtle },
              ] as const).map((row, i, arr) => (
                <div
                  key={row.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 0',
                    borderBottom: i < arr.length - 1 ? `1px solid ${T.divider}` : 'none',
                  }}
                >
                  <span style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    background: row.dotColor,
                    flexShrink: 0,
                    display: 'block',
                  }} />
                  <span style={{ flex: 1, fontSize: 13, color: T.text }}>{row.label}</span>
                  <Toggle
                    on={notifs[row.key]}
                    onChange={val => setNotifs(prev => ({ ...prev, [row.key]: val }))}
                  />
                </div>
              ))}
            </div>
          </Field>

          {/* Carry over */}
          <Field label="Lanjut ke Bulan Berikutnya" optional>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '12px 14px',
              background: T.surfaceAlt,
              border: `1px solid ${T.border}`,
              borderRadius: 10,
            }}>
              <div style={{ marginTop: 2 }}>
                <Toggle on={carryOver} onChange={setCarryOver} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Sisa anggaran dilanjutkan</div>
                <div style={{ fontSize: 11.5, color: T.textSubtle, marginTop: 2, lineHeight: 1.45 }}>
                  Jika tidak terpakai, sisa akan ditambahkan ke periode berikutnya.
                </div>
              </div>
            </div>
          </Field>

          {/* Forecast preview */}
          <div style={{
            background: T.primarySoft,
            border: `1px solid ${T.primary}30`,
            borderRadius: 12,
            padding: '14px 16px',
            marginBottom: 4,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
              <CatBubble cat={selectedCat} size={26} />
              <span style={{ fontSize: 12.5, fontWeight: 600, color: T.text }}>
                Setelah anggaran ini ditambahkan
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 11.5, color: T.textMuted }}>Total anggaran bulanan</span>
              <span style={{ fontSize: 13, fontVariantNumeric: 'tabular-nums', color: T.textMuted }}>
                <span style={{ textDecoration: 'line-through' }}>{formatRp(TOTAL_EXISTING)}</span>
                <span style={{ margin: '0 6px' }}>→</span>
                <strong style={{ color: T.primaryDark, fontWeight: 700 }}>{formatRp(totalAfter)}</strong>
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 6 }}>
              <span style={{ fontSize: 11.5, color: T.textMuted }}>Sisa kapasitas (vs pemasukan)</span>
              <span style={{
                fontSize: 13,
                fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
                color: remaining >= 0 ? T.primaryDark : T.danger,
              }}>
                {formatRp(Math.abs(remaining))} {remaining >= 0 ? 'aman' : 'melebihi'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: `1px solid ${T.divider}`,
          background: T.surfaceAlt,
          display: 'flex',
          gap: 10,
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: 11,
              borderRadius: 9,
              border: `1px solid ${T.border}`,
              background: T.surface,
              color: T.text,
              fontSize: 13.5,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: T.fontSans,
            }}
          >
            Batal
          </button>
          <button
            style={{
              flex: 2,
              padding: 11,
              borderRadius: 9,
              border: 'none',
              background: T.primary,
              color: 'white',
              fontSize: 13.5,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: T.fontSans,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Check size={14} />
            Simpan Anggaran
          </button>
        </div>
      </div>
    </>
  );
}
