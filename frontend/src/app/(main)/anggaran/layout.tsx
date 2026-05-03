import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anggaran",
  description: "Atur batas pengeluaran per kategori",
};

export default function AnggaranLayout({ children }: { children: React.ReactNode }) {
  return children;
}
