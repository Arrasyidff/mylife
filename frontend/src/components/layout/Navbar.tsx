"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, Sun, Moon, LogOut, ChevronRight } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/contexts/auth-context";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

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

function buildBreadcrumbs(pathname: string) {
  const crumbs: { label: string; href: string }[] = [
    { label: "Beranda", href: "/" },
  ];

  const segments = pathname.split("/").filter(Boolean);
  let accumulated = "";
  for (const segment of segments) {
    accumulated += `/${segment}`;
    const label = pathLabels[accumulated];
    if (label && accumulated !== "/") {
      crumbs.push({ label, href: accumulated });
    }
  }

  return crumbs;
}

function getCurrentDate() {
  return new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type NavbarProps = {
  onMenuToggle: () => void;
};

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const breadcrumbs = buildBreadcrumbs(pathname);
  const pageLabel = pathLabels[pathname] ?? "";
  const initial = user ? user.username.charAt(0).toUpperCase() : "?";

  const handleLogout = () => {
    setOpen(false);
    logout();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 h-16 px-4 md:px-6 flex justify-between items-center bg-white/80 backdrop-blur-xl border-b border-gray-200 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden text-gray-400 hover:text-gray-700 transition-colors p-1"
          aria-label="Buka menu"
        >
          <Menu size={20} />
        </button>

        {/* Mobile: page label */}
        {pageLabel && (
          <span className="text-gray-900 text-xs font-bold uppercase tracking-tighter md:hidden">
            {pageLabel}
          </span>
        )}

        {/* Desktop: breadcrumb */}
        <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-1">
          {breadcrumbs.map((crumb, i) => {
            const isLast = i === breadcrumbs.length - 1;
            return (
              <span key={crumb.href} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={12} className="text-gray-300" />}
                {isLast ? (
                  <span className="text-gray-900 text-[10px] font-bold uppercase tracking-tighter">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-gray-400 hover:text-gray-700 text-[10px] font-bold uppercase tracking-tighter transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-5">
        <div className="text-gray-400 text-[10px] uppercase font-bold tracking-widest hidden lg:block">
          {getCurrentDate()}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="text-gray-400 hover:text-gray-700 transition-colors"
            title={theme === "dark" ? "Mode terang" : "Mode gelap"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user && (
            <div className="pl-3 border-l border-gray-200">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger
                  render={
                    <button className="flex items-center gap-3 hover:opacity-80 transition-opacity" />
                  }
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-gray-900 text-[10px] font-bold uppercase tracking-tighter">
                      {user.nama}
                    </p>
                    <p className="text-gray-400 text-[9px] uppercase font-bold">
                      {user.aksesLevel}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 text-xs font-bold flex-shrink-0">
                    {initial}
                  </div>
                </PopoverTrigger>

                <PopoverContent align="end" className="w-48 p-1 bg-white border border-gray-200">
                  <div className="px-3 py-2.5 border-b border-gray-100 mb-1">
                    <p className="text-gray-900 text-xs font-bold uppercase tracking-tighter">{user.nama}</p>
                    {user.jabatan && (
                      <p className="text-gray-400 text-[10px] uppercase font-bold mt-0.5">{user.jabatan}</p>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs uppercase font-bold text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <LogOut size={14} />
                    Keluar
                  </button>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
