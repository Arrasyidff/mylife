import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laporan",
  description: "Analisis dan laporan keuangan keluarga",
};

export default function LaporanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
