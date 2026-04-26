"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import AuthGuard from "./AuthGuard";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Overlay mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex flex-col flex-1 min-w-0 md:ml-64">
          <Navbar onMenuToggle={() => setSidebarOpen(prev => !prev)} />
          <main className="flex-1 p-4">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
