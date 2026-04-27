"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { can } from "@/lib/permissions";
import { useRequiredAuth } from "@/contexts/auth-context";
import { T } from "@/lib/tokens";
import { Icon } from "@/components/ui/icon";
import { X, LogOut } from "lucide-react";

type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: (s?: number) => React.ReactNode;
  adminOnly?: boolean;
};

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const baseNavItems: NavItem[] = [
  { id: 'home',     label: 'Beranda',    href: '/',          icon: Icon.home     },
  { id: 'tx',       label: 'Transaksi',  href: '/transaksi', icon: Icon.list     },
  { id: 'budget',   label: 'Anggaran',   href: '/anggaran',  icon: Icon.budget   },
  { id: 'rekening', label: 'Rekening',   href: '/rekening',  icon: Icon.rekening },
  { id: 'reports',  label: 'Laporan',    href: '/laporan',   icon: Icon.reports  },
];

const adminNavItems: NavItem[] = [
  { id: 'settings', label: 'Pengaturan', href: '/pengaturan', icon: Icon.settings, adminOnly: true },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useRequiredAuth();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const navItems = [
    ...baseNavItems,
    ...adminNavItems.filter(item => !item.adminOnly || can(user.aksesLevel, 'pengguna', 'lihat')),
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');

  // Close on route change (mobile)
  useEffect(() => { onClose(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const initial = user.nama.charAt(0).toUpperCase();
  const roleLabel = user.jabatan ?? user.aksesLevel;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        style={{
          width: 232,
          flexShrink: 0,
          background: T.surface,
          borderRight: `1px solid ${T.border}`,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 12px',
          fontFamily: T.fontSans,
          height: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 40,
          transform: isOpen ? 'translateX(0)' : undefined,
          transition: 'transform 0.3s',
          boxShadow: '2px 0 16px 0 rgba(0,0,0,0.04)',
        }}
        className={!isOpen ? 'max-md:-translate-x-full' : ''}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 6px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${T.primary}, ${T.primaryDark})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: 16,
              flexShrink: 0,
              boxShadow: `0 3px 10px ${T.primary}50`,
            }}>
              F
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: T.text, letterSpacing: -0.3, lineHeight: 1.2 }}>
                Money Tracker
              </div>
              <div style={{ fontSize: 10.5, color: T.textSubtle, marginTop: 1 }}>Keuangan Keluarga</div>
            </div>
          </div>
          {/* Close button mobile */}
          <button
            className="md:hidden"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: T.textMuted,
              padding: 4,
              display: 'flex',
              borderRadius: 6,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Section label */}
        <div style={{
          padding: '0 10px 6px',
          fontSize: 10,
          fontWeight: 600,
          color: T.textSubtle,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
        }}>
          Navigasi
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
          {navItems.map(item => {
            const active = isActive(item.href);
            const hovered = hoveredId === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 10px 9px 9px',
                  borderRadius: 9,
                  fontSize: 13.5,
                  fontWeight: active ? 600 : 500,
                  color: active ? T.primaryDark : hovered ? T.text : T.textMuted,
                  background: active ? T.primaryLight : hovered ? T.surfaceAlt : 'transparent',
                  textDecoration: 'none',
                  transition: 'background 0.12s, color 0.12s',
                  borderLeft: `3px solid ${active ? T.primary : 'transparent'}`,
                }}
              >
                <span style={{
                  color: active ? T.primary : hovered ? T.textMuted : T.textSubtle,
                  display: 'inline-flex',
                  flexShrink: 0,
                  transition: 'color 0.12s',
                }}>
                  {item.icon(17)}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div style={{ borderTop: `1px solid ${T.divider}`, paddingTop: 12, marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 6px', borderRadius: 9 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              background: `linear-gradient(135deg, ${T.primary}, ${T.primaryDark})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 13,
              fontWeight: 700,
              flexShrink: 0,
              boxShadow: `0 2px 6px ${T.primary}40`,
            }}>
              {initial}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: T.text,
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {user.nama}
              </div>
              <div style={{ fontSize: 10.5, color: T.textSubtle, marginTop: 2 }}>
                {roleLabel}
              </div>
            </div>
            <button
              onClick={logout}
              title="Keluar"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: T.textSubtle,
                padding: 5,
                display: 'flex',
                borderRadius: 6,
                flexShrink: 0,
                transition: 'color 0.12s, background 0.12s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = T.danger;
                e.currentTarget.style.background = T.dangerLight;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = T.textSubtle;
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
