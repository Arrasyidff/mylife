"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, Moon, Sun, Settings, LogOut, ChevronRight } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/contexts/auth-context";
import { T } from "@/lib/tokens";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const pathLabels: Record<string, string> = {
  "/":                      "Beranda",
  "/transaksi":             "Transaksi",
  "/transaksi/pemasukan":   "Pemasukan",
  "/transaksi/pengeluaran": "Pengeluaran",
  "/anggaran":              "Anggaran",
  "/rekening":              "Rekening",
  "/laporan":               "Laporan",
  "/pengaturan":            "Pengaturan",
};

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

function Breadcrumb() {
  const pathname = usePathname();

  if (pathname === "/") {
    return (
      <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Beranda</span>
    );
  }

  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [{ label: "Beranda", href: "/" }];
  let accumulated = "";
  for (const seg of segments) {
    accumulated += `/${seg}`;
    const label = pathLabels[accumulated];
    if (label) crumbs.push({ label, href: accumulated });
  }

  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {i > 0 && <ChevronRight size={13} color={T.textSubtle} />}
          {i === crumbs.length - 1 ? (
            <span style={{ fontWeight: 600, color: T.text }}>{crumb.label}</span>
          ) : (
            <Link href={crumb.href} style={{ color: T.textMuted, textDecoration: 'none' }}>
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

type NavbarProps = {
  onMenuToggle: () => void;
};

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setOpen(false);
    logout();
    router.replace("/login");
  };

  const initials = user ? getInitials(user.nama) : "";

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 20,
      height: 60,
      background: T.surface,
      borderBottom: `1px solid ${T.border}`,
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 12,
      fontFamily: T.fontSans,
    }}>
      {/* Hamburger — mobile */}
      <button
        className="md:hidden"
        onClick={onMenuToggle}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: T.textMuted,
          display: 'flex',
          padding: 4,
        }}
      >
        <Menu size={22} />
      </button>

      {/* Breadcrumb */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Breadcrumb />
      </div>

      {/* Dark mode toggle */}
      <button
        onClick={toggle}
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          border: `1px solid ${T.border}`,
          background: T.surfaceAlt,
          cursor: 'pointer',
          color: T.textMuted,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* User dropdown */}
      {user && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '5px 10px',
                borderRadius: 9,
                border: `1px solid ${T.border}`,
                background: T.surfaceAlt,
                cursor: 'pointer',
                fontFamily: T.fontSans,
              }} />
            }
          >
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 999,
              background: T.primary,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              flexShrink: 0,
            }}>
              {initials}
            </div>
            <div className="hidden sm:block" style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text, lineHeight: 1.2 }}>
                {user.nama}
              </div>
              <div style={{ fontSize: 11, color: T.textSubtle, marginTop: 1 }}>
                {user.aksesLevel}
              </div>
            </div>
          </PopoverTrigger>

          <PopoverContent align="end" className="w-52 p-1">
            <div style={{ padding: '10px 14px', borderBottom: `1px solid ${T.divider}`, marginBottom: 4 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{user.nama}</div>
              {user.jabatan && (
                <div style={{ fontSize: 11.5, color: T.textSubtle, marginTop: 1 }}>{user.jabatan}</div>
              )}
            </div>
            <Link
              href="/pengaturan"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-50 transition-colors"
              style={{ color: T.text, textDecoration: 'none' }}
            >
              <Settings size={14} color={T.textMuted} />
              Pengaturan
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-red-50 transition-colors"
              style={{ color: '#C0392B', background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.fontSans, textAlign: 'left' }}
            >
              <LogOut size={14} />
              Keluar
            </button>
          </PopoverContent>
        </Popover>
      )}
    </header>
  );
}
