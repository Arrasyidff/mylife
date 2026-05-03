import type { Metadata } from "next";
import LayoutShell from "@/components/layout/LayoutShell";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Ringkasan keuangan keluarga hari ini",
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <LayoutShell>{children}</LayoutShell>;
}
