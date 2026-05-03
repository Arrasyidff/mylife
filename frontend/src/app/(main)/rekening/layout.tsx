import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rekening",
  description: "Kelola rekening bank, e-wallet, dan tunai",
};

export default function RekeningLayout({ children }: { children: React.ReactNode }) {
  return children;
}
