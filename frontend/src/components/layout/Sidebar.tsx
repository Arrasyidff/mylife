"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { can } from "@/lib/permissions";
import { useRequiredAuth } from "@/contexts/auth-context";
import {
  LayoutDashboard,
  ArrowDownCircle,
  ArrowUpCircle,
  FileBarChart,
  Users,
  UserCog,
  ClipboardList,
  ChevronDown,
  X,
} from "lucide-react";

type NavLink = {
  type: "link";
  label: string;
  href: string;
  icon: React.ReactNode;
};

type NavGroup = {
  type: "group";
  label: string;
  icon: React.ReactNode;
  children: { label: string; href: string }[];
};

type NavItem = NavLink | NavGroup;

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useRequiredAuth();
  const level = user.aksesLevel;

  const allNavItems: NavItem[] = [
    {
      type: "link",
      label: "Beranda",
      href: "/",
      icon: <LayoutDashboard size={18} />,
    },
    {
      type: "group",
      label: "Transaksi",
      icon: <FileBarChart size={18} />,
      children: [
        { label: "Semua Transaksi", href: "/transaksi" },
        { label: "Pemasukan",       href: "/transaksi/pemasukan" },
        { label: "Pengeluaran",     href: "/transaksi/pengeluaran" },
      ],
    },
    {
      type: "link",
      label: "Anggaran",
      href: "/anggaran",
      icon: <ClipboardList size={18} />,
    },
    {
      type: "link",
      label: "Rekening",
      href: "/rekening",
      icon: <ArrowDownCircle size={18} />,
    },
    {
      type: "link",
      label: "Laporan",
      href: "/laporan",
      icon: <ArrowUpCircle size={18} />,
    },
    ...(can(level, "pengguna", "lihat")
      ? [{
          type: "link" as const,
          label: "Pengaturan",
          href: "/pengaturan",
          icon: <UserCog size={18} />,
        }]
      : []),
  ];

  const isGroupActive = (item: NavGroup) =>
    item.children.some((c) => pathname === c.href || pathname.startsWith(c.href + "/"));

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const item of allNavItems) {
      if (item.type === "group" && isGroupActive(item)) {
        initial[item.label] = true;
      }
    }
    return initial;
  });

  useEffect(() => {
    setOpenGroups((prev) => {
      const updated = { ...prev };
      for (const item of allNavItems) {
        if (item.type === "group" && isGroupActive(item)) {
          updated[item.label] = true;
        }
      }
      return updated;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      {/* Brand */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <p className="font-bold text-primary leading-tight">MyLife Finance</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Keuangan Keluarga</p>
        </div>
        <button
          className="md:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={onClose}
          aria-label="Tutup sidebar"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {allNavItems.map((item) => {
          if (item.type === "link") {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          }

          const groupOpen = openGroups[item.label] ?? false;
          const groupActive = isGroupActive(item);

          return (
            <div key={item.label}>
              <button
                onClick={() => toggleGroup(item.label)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  groupActive && !groupOpen
                    ? "bg-primary/10 text-primary dark:bg-primary/20"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronDown
                  size={16}
                  className={cn("transition-transform", groupOpen && "rotate-180")}
                />
              </button>
              {groupOpen && (
                <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-gray-200 dark:border-gray-600 pl-3">
                  {item.children.map((child) => {
                    const childActive = isActive(child.href);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center py-1.5 px-2 rounded-md text-sm transition-colors",
                          childActive
                            ? "bg-primary text-white font-medium"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
