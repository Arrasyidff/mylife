"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRequiredAuth } from "@/contexts/auth-context";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Landmark,
  BarChart3,
  LogOut,
  X,
} from "lucide-react";

type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    label: "Menu Utama",
    items: [
      { id: "home",   label: "Beranda",   href: "/",          icon: LayoutDashboard },
      { id: "tx",     label: "Transaksi", href: "/transaksi", icon: ArrowLeftRight  },
      { id: "budget", label: "Anggaran",  href: "/anggaran",  icon: Wallet          },
    ],
  },
  {
    label: "Finansial",
    items: [
      { id: "rekening", label: "Rekening", href: "/rekening", icon: Landmark  },
      { id: "reports",  label: "Laporan",  href: "/laporan",  icon: BarChart3 },
    ],
  },
];

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useRequiredAuth();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  useEffect(() => { onClose(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const initial = user.username.charAt(0).toUpperCase();
  const roleLabel = user.jabatan ?? user.aksesLevel;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          "fixed left-0 top-0 h-full w-64 border-r border-gray-200 bg-white flex flex-col gap-2 p-6 z-40 transition-transform duration-300",
          !isOpen ? "max-md:-translate-x-full" : "",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="mb-8 px-2 flex items-start justify-between">
          <div>
            <h1 className="text-gray-900 font-black text-2xl tracking-tighter uppercase">
              The M-Line
            </h1>
            <div className="mt-1 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
              Miracle Generation
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-gray-700 transition-colors p-1 mt-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-8 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="px-4 mb-3 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                {section.label}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={[
                        "px-4 py-2.5 flex items-center gap-3 text-xs uppercase font-bold tracking-tighter rounded-lg transition-all duration-150",
                        active
                          ? "bg-gray-100 text-gray-900 border border-gray-200"
                          : "text-gray-400 hover:bg-gray-50 hover:text-gray-700",
                      ].join(" ")}
                    >
                      <Icon size={16} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="mt-auto border-t border-gray-200 pt-6 space-y-1">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 text-xs font-bold flex-shrink-0">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 text-[10px] font-bold uppercase tracking-tighter truncate">
                {user.nama}
              </p>
              <p className="text-gray-400 text-[9px] uppercase font-bold">{roleLabel}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full text-gray-400 px-4 py-2.5 flex items-center gap-3 text-xs uppercase font-bold tracking-tighter hover:bg-gray-50 hover:text-gray-700 transition-all duration-150 rounded-lg"
          >
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
