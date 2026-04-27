"use client";
import { T } from '@/lib/tokens';
import { formatRp, formatTxDate } from '@/lib/format';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { CatBubble } from '@/components/dashboard/cat-bubble';
import { UserBadge } from '@/components/dashboard/user-badge';
import { accounts, budgets, transactions } from '@/lib/dashboard-data';

// ── Tab bar ────────────────────────────────────────────────────
function TabBar() {
  const items = [
    { id: 'home',   label: 'Beranda',   icon: Icon.home   },
    { id: 'tx',     label: 'Transaksi', icon: Icon.list   },
    { id: 'budget', label: 'Anggaran',  icon: Icon.budget },
    { id: 'rep',    label: 'Laporan',   icon: Icon.reports },
  ] as const;

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      background: T.surface,
      borderTop: `1px solid ${T.border}`,
      display: 'flex',
      alignItems: 'flex-end',
      paddingTop: 8,
      paddingBottom: 22,
    }}>
      {/* Left two tabs */}
      {items.slice(0, 2).map((it, idx) => (
        <button
          key={it.id}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            padding: '6px 0',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: idx === 0 ? T.primaryDark : T.textSubtle,
            fontFamily: T.fontSans,
          }}
        >
          {it.icon(20)}
          <span style={{ fontSize: 10.5, fontWeight: idx === 0 ? 600 : 500 }}>{it.label}</span>
        </button>
      ))}

      {/* FAB center */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <button style={{
          position: 'absolute',
          bottom: 6,
          width: 50,
          height: 50,
          borderRadius: 25,
          background: T.primary,
          color: 'white',
          border: `4px solid ${T.surface}`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 16px rgba(29,158,117,0.35)',
        }}>
          {Icon.plus(22)}
        </button>
      </div>

      {/* Right two tabs */}
      {items.slice(2).map(it => (
        <button
          key={it.id}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            padding: '6px 0',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: T.textSubtle,
            fontFamily: T.fontSans,
          }}
        >
          {it.icon(20)}
          <span style={{ fontSize: 10.5, fontWeight: 500 }}>{it.label}</span>
        </button>
      ))}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────
export default function MobilePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#E8EBE8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
    }}>
      {/* Phone frame */}
      <div style={{
        width: 390,
        height: 844,
        background: T.bg,
        borderRadius: 44,
        boxShadow: '0 40px 80px rgba(0,0,0,0.3), 0 0 0 10px #1A1A1A, inset 0 0 0 2px #3A3A3A',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: T.fontSans,
        color: T.text,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Status bar */}
        <div style={{
          height: 44,
          padding: '12px 22px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 13,
          fontWeight: 600,
          background: T.bg,
        }}>
          <span>9:41</span>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center', fontSize: 11 }}>
            <span>●●●</span>
            <span>▲▲▲</span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: 22,
              height: 11,
              border: `1.5px solid ${T.text}`,
              borderRadius: 3,
              padding: '1px 1px',
            }}>
              <span style={{ width: 15, height: '100%', background: T.text, borderRadius: 1, display: 'block' }} />
            </span>
          </div>
        </div>

        {/* Header */}
        <div style={{ padding: '12px 18px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{ display: 'flex' }}>
                <UserBadge user="H" size={28} />
                <span style={{ marginLeft: -8 }}><UserBadge user="W" size={28} /></span>
              </div>
              <div>
                <div style={{ fontSize: 11, color: T.textSubtle }}>Halo, Pratama</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Sabtu, 25 April</div>
              </div>
            </div>
            <button style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              background: T.surface,
              border: `1px solid ${T.border}`,
              cursor: 'pointer',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: T.textMuted,
            }}>
              {Icon.bell(16)}
              <span style={{
                position: 'absolute',
                top: 8,
                right: 9,
                width: 7,
                height: 7,
                borderRadius: 4,
                background: T.danger,
                border: '1.5px solid white',
                display: 'block',
              }} />
            </button>
          </div>

          {/* Hero card */}
          <div style={{
            padding: '20px 20px 22px',
            background: `linear-gradient(135deg, ${T.primaryDark} 0%, ${T.primary} 100%)`,
            borderRadius: 20,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: -40,
              right: -40,
              width: 160,
              height: 160,
              borderRadius: 80,
              background: 'rgba(255,255,255,0.06)',
              pointerEvents: 'none',
            }} />
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.4, opacity: 0.85 }}>TOTAL ASET</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 6, letterSpacing: -0.6, fontVariantNumeric: 'tabular-nums' }}>
              {formatRp(45_175_500)}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10.5, opacity: 0.8, fontWeight: 600 }}>PEMASUKAN</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
                  + Rp 14.750.000
                </div>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.2)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10.5, opacity: 0.8, fontWeight: 600 }}>PENGELUARAN</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
                  − Rp 9.412.500
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px 90px' }}>

          {/* Rekening */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <h3 style={{ margin: 0, fontSize: 12, fontWeight: 600, color: T.textMuted, letterSpacing: 0.4 }}>REKENING</h3>
            <a style={{ fontSize: 12, color: T.primaryDark, fontWeight: 600, cursor: 'pointer' }}>Semua</a>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', marginBottom: 18, paddingBottom: 4 }}>
            {accounts.map(a => (
              <div key={a.id} style={{
                flexShrink: 0,
                width: 152,
                padding: '14px 14px',
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderLeft: `3px solid ${a.color}`,
                borderRadius: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                  <div style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: a.color + '18',
                    color: a.color,
                    fontSize: 9,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {a.glyph}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{a.name}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.3, fontVariantNumeric: 'tabular-nums', color: T.text }}>
                  {formatRp(a.balance)}
                </div>
              </div>
            ))}
          </div>

          {/* Anggaran */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <h3 style={{ margin: 0, fontSize: 12, fontWeight: 600, color: T.textMuted, letterSpacing: 0.4 }}>ANGGARAN</h3>
            <a style={{ fontSize: 12, color: T.primaryDark, fontWeight: 600, cursor: 'pointer' }}>Semua</a>
          </div>
          <div style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            padding: '14px 16px',
            marginBottom: 18,
          }}>
            {budgets.slice(0, 3).map((b, i) => {
              const pct = Math.round((b.used / b.total) * 100);
              return (
                <div key={b.id} style={{
                  padding: '8px 0',
                  borderBottom: i < 2 ? `1px solid ${T.divider}` : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <CatBubble cat={b.cat} size={28} />
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: T.text }}>{b.name}</span>
                    <span style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      fontVariantNumeric: 'tabular-nums',
                      color: pct >= 100 ? T.danger : pct >= 75 ? '#8C5A0E' : T.primaryDark,
                    }}>
                      {pct}%
                    </span>
                  </div>
                  <ProgressBar pct={pct} height={5} />
                </div>
              );
            })}
          </div>

          {/* Transaksi terkini */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <h3 style={{ margin: 0, fontSize: 12, fontWeight: 600, color: T.textMuted, letterSpacing: 0.4 }}>TERKINI</h3>
            <a style={{ fontSize: 12, color: T.primaryDark, fontWeight: 600, cursor: 'pointer' }}>Semua</a>
          </div>
          <div style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            padding: '4px 14px',
          }}>
            {transactions.slice(0, 4).map((t, i) => {
              const acct  = accounts.find(a => a.id === t.acct);
              const isIn  = t.amount > 0;
              const dateShort = formatTxDate(t.date).split(',')[1]?.trim() ?? formatTxDate(t.date);
              return (
                <div key={t.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  padding: '11px 0',
                  borderBottom: i < 3 ? `1px solid ${T.divider}` : 'none',
                }}>
                  <CatBubble cat={t.cat} size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: T.text,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {t.merch}
                      </span>
                      <UserBadge user={t.user} size={15} />
                    </div>
                    <div style={{ fontSize: 11, color: T.textSubtle, marginTop: 2 }}>
                      {acct?.name ?? '—'} · {dateShort}
                    </div>
                  </div>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: isIn ? T.primaryDark : T.text,
                    fontVariantNumeric: 'tabular-nums',
                    whiteSpace: 'nowrap',
                  }}>
                    {isIn ? '+' : ''}{formatRp(t.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <TabBar />
      </div>
    </div>
  );
}
