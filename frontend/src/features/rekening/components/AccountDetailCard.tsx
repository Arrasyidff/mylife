"use client";
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { T } from '@/lib/tokens';
import { Icon } from '@/components/ui/icon';
import { transactions } from '@/lib/dashboard-data';
import { formatRp, formatTxDate } from '@/lib/format';
import type { Account, Transaction } from '../types';

function getAccountTxs(acctId: string): Transaction[] {
  return transactions.filter(t => t.acct === acctId);
}

function getAccountStats(acctId: string) {
  const txs = getAccountTxs(acctId);
  const income  = txs.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expense = txs.filter(t => t.amount < 0 && t.type !== 'transfer').reduce((s, t) => s + Math.abs(t.amount), 0);
  return { income, expense, net: income - expense, count: txs.length };
}

interface AccountDetailCardProps {
  acct: Account;
  isHidden: boolean;
  onEdit: () => void;
  onToggleHide: () => void;
}

export function AccountDetailCard({ acct, isHidden, onEdit, onToggleHide }: AccountDetailCardProps) {
  const recentTxs = getAccountTxs(acct.id);
  const { income, expense, net } = getAccountStats(acct.id);
  const netColor = net >= 0 ? T.primaryDark : T.danger;

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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 16 }}>
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
          <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: 0.3, marginBottom: 8 }}>
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
