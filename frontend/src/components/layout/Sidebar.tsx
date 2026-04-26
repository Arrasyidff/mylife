"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { can } from "@/lib/permissions";
import { useRequiredAuth } from "@/contexts/auth-context";
import { T } from "@/lib/tokens";
import { Icon } from "@/components/ui/icon";
import { UserBadge } from "@/components/dashboard/user-badge";
import { X } from "lucide-react";

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
  { id: 'home',     label: 'Beranda',    href: '/',         icon: Icon.home    },
  { id: 'tx',       label: 'Transaksi',  href: '/transaksi', icon: Icon.list   },
  { id: 'budget',   label: 'Anggaran',   href: '/anggaran', icon: Icon.budget  },
  { id: 'rekening', label: 'Rekening',   href: '/rekening', icon: Icon.rekening },
  { id: 'reports',  label: 'Laporan',    href: '/laporan',  icon: Icon.reports },
];

const adminNavItems: NavItem[] = [
  { id: 'settings', label: 'Pengaturan', href: '/pengaturan', icon: Icon.settings, adminOnly: true },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useRequiredAuth();

  const navItems = [
    ...baseNavItems,
    ...adminNavItems.filter(item => !item.adminOnly || can(user.aksesLevel, 'pengguna', 'lihat')),
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');

  // Close on route change (mobile)
  useEffect(() => { onClose(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

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
          padding: '20px 14px',
          fontFamily: T.fontSans,
          height: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 40,
          transform: isOpen ? 'translateX(0)' : undefined,
          transition: 'transform 0.3s',
        }}
        className={!isOpen ? 'max-md:-translate-x-full' : ''}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              background: `linear-gradient(135deg, ${T.primary}, ${T.primaryDark})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: 15,
              flexShrink: 0,
            }}>
              F
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text, letterSpacing: -0.2 }}>
                Money Tracker
              </div>
              <div style={{ fontSize: 11, color: T.textSubtle }}>Keuangan Keluarga</div>
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
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          {navItems.map(item => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  padding: '9px 10px',
                  borderRadius: 9,
                  fontSize: 13.5,
                  fontWeight: active ? 600 : 500,
                  color: active ? T.primaryDark : T.textMuted,
                  background: active ? T.primaryLight : 'transparent',
                  textDecoration: 'none',
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                <span style={{ color: active ? T.primary : T.textSubtle, display: 'inline-flex' }}>
                  {item.icon(18)}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Couple footer */}
        <div style={{ borderTop: `1px solid ${T.divider}`, paddingTop: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 6px' }}>
            <div style={{ display: 'flex', flexShrink: 0 }}>
              <UserBadge user="H" size={26} />
              <span style={{ marginLeft: -8 }}>
                <UserBadge user="W" size={26} />
              </span>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: T.text, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                Husband &amp; Wife
              </div>
              <div style={{ fontSize: 11, color: T.textSubtle, marginTop: 2 }}>
                Sinkron · 2 menit lalu
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
