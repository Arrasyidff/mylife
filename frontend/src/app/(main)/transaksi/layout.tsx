import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transaksi",
  description: "Riwayat dan pencatatan transaksi keuangan",
};

export default function TransaksiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
