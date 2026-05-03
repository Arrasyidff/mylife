"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import AuthGuard from "./AuthGuard";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-white">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex flex-col flex-1 min-w-0 md:ml-64">
          <Navbar onMenuToggle={() => setSidebarOpen(prev => !prev)} />
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
