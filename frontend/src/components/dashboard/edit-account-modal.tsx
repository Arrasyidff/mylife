"use client";
import { useState } from 'react';
import { X, Check, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';
import type { Account, AccountType } from '@/lib/dashboard-data';
import { accountService } from '@/lib/services/account';

const ACCOUNT_TYPES: { id: AccountType; label: string; hint: string }[] = [
  { id: 'tabungan',    label: 'Tabungan',     hint: 'Rekening bank biasa'     },
  { id: 'ewallet',     label: 'E-Wallet',     hint: 'Gopay, OVO, Dana, dll.'  },
  { id: 'tunai',       label: 'Tunai',        hint: 'Uang fisik / dompet'     },
  { id: 'investasi',   label: 'Investasi',    hint: 'Saham, reksa dana, dll.' },
  { id: 'kartukredit', label: 'Kartu Kredit', hint: 'Saldo = utang'           },
];

const COLORS = [
  '#1565C0', '#003D79', '#00A6E2', '#5C815B',
  '#1D9E75', '#D4860B', '#C0392B', '#7B1FA2',
  '#1846A8', '#E65100', '#2E7D32', '#4527A0',
];

interface EditAccountModalProps {
  account: Account;
  onSave: (account: Account) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

function Field({ label, children, hint, optional }: {
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

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 9,
  border: `1px solid ${T.border}`,
  background: T.surfaceAlt,
  fontSize: 13.5,
  color: T.text,
  fontFamily: T.fontSans,
  outline: 'none',
  boxSizing: 'border-box',
};

export function EditAccountModal({ account, onSave, onDelete, onClose }: EditAccountModalProps) {
  const [name, setName] = useState(account.name);
  const [type, setType] = useState<AccountType>(account.type);
  const [color, setColor] = useState(account.color);
  const [balance, setBalance] = useState(account.balance);
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewGlyph = name ? name.slice(0, 3).toUpperCase() : '···';
  const typeLabel = ACCOUNT_TYPES.find(t => t.id === type)?.label ?? '';
  const previewSubtitle = `${typeLabel}${accountNumber ? ' · ****' + accountNumber.slice(-4) : ''}`;

  function handleBalanceInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^\d]/g, '');
    setBalance(raw ? parseInt(raw) : 0);
  }

  async function handleSave() {
    if (!name.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const updated = await accountService.update(account.id, {
        name: name.trim(),
        subtitle: previewSubtitle || typeLabel,
        balance,
        color,
        glyph: name.slice(0, 3).toUpperCase(),
        type,
        ...(accountNumber.trim() ? { account_number: accountNumber.trim() } : {}),
      });
      onSave(updated);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menyimpan perubahan');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (deleting) return;
    setDeleting(true);
    setError(null);
    try {
      await accountService.remove(account.id);
      onDelete(account.id);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menghapus rekening');
      setDeleting(false);
    }
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(20,30,25,0.35)',
          backdropFilter: 'blur(2px)',
          zIndex: 40,
        }}
      />

      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 480,
        background: T.surface,
        boxShadow: '-16px 0 40px rgba(20,30,25,0.18), -1px 0 0 rgba(20,30,25,0.06)',
        display: 'flex', flexDirection: 'column',
        zIndex: 50,
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: `1px solid ${T.divider}`,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 11, color: T.warning, fontWeight: 700, letterSpacing: 0.5, marginBottom: 3 }}>
              EDIT REKENING
            </div>
            <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700, letterSpacing: -0.4, color: T.text }}>
              {account.name}
            </h2>
            <div style={{ fontSize: 12.5, color: T.textMuted, marginTop: 4 }}>
              Perbarui detail rekening
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: 'none', background: T.surfaceAlt,
              cursor: 'pointer', color: T.textMuted,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px' }}>

          {/* Preview card */}
          <div style={{
            background: color + '14',
            border: `1px solid ${color}30`,
            borderLeft: `4px solid ${color}`,
            borderRadius: 12,
            padding: '16px 18px',
            marginBottom: 22,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 11,
              background: color, color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>
              {previewGlyph}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>
                {name || 'Nama Rekening'}
              </div>
              <div style={{ fontSize: 11.5, color: T.textSubtle, marginTop: 2 }}>
                {previewSubtitle || account.subtitle}
              </div>
            </div>
            <div style={{
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 700, fontSize: 15, color: T.text,
            }}>
              {formatRp(balance)}
            </div>
          </div>

          {/* Name */}
          <Field label="Nama Rekening">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="cth: BCA Utama, GoPay, Dompet Harian…"
              style={inputStyle}
            />
          </Field>

          {/* Type */}
          <Field label="Jenis Rekening">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ACCOUNT_TYPES.map(t => {
                const active = t.id === type;
                return (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '11px 14px',
                      background: active ? T.primaryLight : T.surfaceAlt,
                      border: `1px solid ${active ? T.primary : T.border}`,
                      borderRadius: 9,
                      cursor: 'pointer', fontFamily: T.fontSans, textAlign: 'left',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: active ? T.primaryDark : T.text }}>
                        {t.label}
                      </div>
                      <div style={{ fontSize: 11.5, color: T.textSubtle }}>{t.hint}</div>
                    </div>
                    {active && (
                      <div style={{
                        width: 18, height: 18, borderRadius: 9,
                        background: T.primary, color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Color */}
          <Field label="Warna Label">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: 32, height: 32, borderRadius: 9,
                    background: c,
                    border: color === c ? `3px solid ${T.text}` : '3px solid transparent',
                    cursor: 'pointer', outline: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'border-color 0.1s',
                  }}
                >
                  {color === c && <Check size={14} color="white" strokeWidth={3} />}
                </button>
              ))}
            </div>
          </Field>

          {/* Account number */}
          <Field label="Nomor Rekening / ID" optional>
            <input
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value)}
              placeholder={account.subtitle}
              style={inputStyle}
            />
          </Field>

          {/* Balance */}
          <Field
            label="Saldo Terkini"
            hint="Perbarui jika ada perbedaan dengan saldo aktual."
          >
            <div style={{
              background: T.primarySoft,
              border: `1.5px solid ${T.primary}`,
              borderRadius: 12,
              padding: '16px 18px',
              textAlign: 'center',
              marginBottom: 10,
            }}>
              <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 17, color: T.primaryDark, fontWeight: 600 }}>Rp</span>
                <input
                  type="text"
                  value={balance.toLocaleString('id-ID')}
                  onChange={handleBalanceInput}
                  style={{
                    fontSize: 34, fontWeight: 700, letterSpacing: -1,
                    color: T.text, fontVariantNumeric: 'tabular-nums',
                    border: 'none', background: 'transparent',
                    outline: 'none', fontFamily: T.fontSans,
                    textAlign: 'center', width: 200,
                  }}
                />
              </div>
            </div>
          </Field>

          {/* Danger zone */}
          <div style={{
            padding: '16px 18px',
            background: T.dangerLight,
            borderRadius: 10,
            border: `1px solid ${T.danger}22`,
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.danger, marginBottom: 10 }}>
              Zona Bahaya
            </div>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 7,
                  border: `1px solid ${T.danger}44`,
                  background: T.surface, color: T.danger,
                  fontSize: 12.5, fontWeight: 600,
                  cursor: 'pointer', fontFamily: T.fontSans,
                }}
              >
                <Trash2 size={13} />
                Hapus Rekening Ini
              </button>
            ) : (
              <div>
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 7,
                  fontSize: 12.5, color: T.danger, marginBottom: 12, lineHeight: 1.5,
                }}>
                  <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>
                    Yakin hapus rekening <strong>{account.name}</strong>?
                    Tindakan ini tidak dapat dibatalkan.
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    disabled={deleting}
                    style={{
                      padding: '7px 16px', borderRadius: 7,
                      border: `1px solid ${T.border}`,
                      background: T.surface, color: T.text,
                      fontSize: 12.5, fontWeight: 600,
                      cursor: deleting ? 'not-allowed' : 'pointer',
                      fontFamily: T.fontSans, opacity: deleting ? 0.6 : 1,
                    }}
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    style={{
                      padding: '7px 16px', borderRadius: 7,
                      border: 'none', background: T.danger, color: 'white',
                      fontSize: 12.5, fontWeight: 600,
                      cursor: deleting ? 'not-allowed' : 'pointer',
                      fontFamily: T.fontSans,
                      display: 'flex', alignItems: 'center', gap: 6,
                      opacity: deleting ? 0.8 : 1,
                    }}
                  >
                    {deleting && <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />}
                    {deleting ? 'Menghapus…' : 'Ya, Hapus'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: `1px solid ${T.divider}`,
          background: T.surfaceAlt,
        }}>
          {error && (
            <div style={{
              fontSize: 12.5, color: T.danger, fontWeight: 500,
              marginBottom: 10, padding: '8px 12px',
              background: T.dangerLight, borderRadius: 7,
              border: `1px solid ${T.danger}22`,
            }}>
              {error}
            </div>
          )}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={onClose}
              disabled={loading || deleting}
              style={{
                flex: 1, padding: 11, borderRadius: 9,
                border: `1px solid ${T.border}`,
                background: T.surface, color: T.text,
                fontSize: 13.5, fontWeight: 600,
                cursor: loading || deleting ? 'not-allowed' : 'pointer',
                fontFamily: T.fontSans, opacity: loading || deleting ? 0.6 : 1,
              }}
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim() || loading || deleting}
              style={{
                flex: 2, padding: 11, borderRadius: 9,
                border: 'none',
                background: name.trim() && !loading && !deleting ? T.primary : T.borderStrong,
                color: 'white',
                fontSize: 13.5, fontWeight: 600,
                cursor: name.trim() && !loading && !deleting ? 'pointer' : 'not-allowed',
                fontFamily: T.fontSans,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={14} />}
              {loading ? 'Menyimpan…' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
