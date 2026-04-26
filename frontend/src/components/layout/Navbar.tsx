"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, Moon, Sun, Settings, LogOut, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/contexts/auth-context";
import type { AksesLevel } from "@/lib/data";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const pathLabels: Record<string, string> = {
  "/": "Dashboard",
  "/transaksi/pemasukan": "Pemasukan",
  "/transaksi/pengeluaran": "Pengeluaran",
  "/transaksi/rekap-laporan": "Rekap Laporan",
  "/pelanggan": "Pelanggan",
  "/pengguna": "Pengguna",
  "/log-aktivitas": "Log Aktivitas",
  "/pengaturan": "Pengaturan Akun",
};

const roleColors: Record<AksesLevel, string> = {
  "Super Admin": "text-purple-500",
  "Admin": "text-blue-500",
  "Viewer": "text-gray-400",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function Breadcrumb() {
  const pathname = usePathname();

  if (pathname === "/") {
    return <span className="text-sm font-semibold text-foreground">Dashboard</span>;
  }

  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [{ label: "Dashboard", href: "/" }];

  let accumulated = "";
  for (const seg of segments) {
    accumulated += `/${seg}`;
    const label = pathLabels[accumulated];
    if (label) crumbs.push({ label, href: accumulated });
  }

  return (
    <nav className="flex items-center gap-1 text-sm">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={14} className="text-gray-400" />}
          {i === crumbs.length - 1 ? (
            <span className="font-semibold text-foreground">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="text-gray-500 hover:text-foreground transition-colors">
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

  return (
    <header className="sticky top-0 z-20 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 gap-3">
      {/* Hamburger — mobile only */}
      <button
        className="md:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        onClick={onMenuToggle}
        aria-label="Toggle menu"
      >
        <Menu size={22} />
      </button>

      {/* Breadcrumb */}
      <div className="flex-1 min-w-0">
        <Breadcrumb />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User dropdown */}
        {user && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              render={
                <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" />
              }
            >
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                {getInitials(user.nama)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-foreground leading-tight">{user.nama}</p>
                <p className={cn("text-xs leading-tight", roleColors[user.aksesLevel])}>
                  {user.aksesLevel}
                </p>
              </div>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-1">
              {/* Header info */}
              <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
                <p className="text-sm font-semibold text-foreground">{user.nama}</p>
                {user.jabatan && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.jabatan}</p>
                )}
                <p className={cn("text-xs font-medium mt-0.5", roleColors[user.aksesLevel])}>
                  {user.aksesLevel}
                </p>
              </div>
              {/* Actions */}
              <Link
                href="/pengaturan"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Settings size={15} />
                Pengaturan
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut size={15} />
                Logout
              </button>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </header>
  );
}
