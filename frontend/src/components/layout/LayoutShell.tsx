"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import AuthGuard from "./AuthGuard";
import { T } from "@/lib/tokens";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div style={{ display: 'flex', minHeight: '100vh', background: T.bg }}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {/* Content — offset by sidebar width on md+ */}
        <div className="flex flex-col flex-1 min-w-0 md:ml-58">
          <Navbar onMenuToggle={() => setSidebarOpen(prev => !prev)} />
          <main style={{ flex: 1, padding: 24 }}>
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
