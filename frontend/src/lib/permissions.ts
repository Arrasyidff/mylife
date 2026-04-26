import type { AksesLevel } from "./data";

export type Modul = "transaksi" | "pelanggan" | "pengguna" | "logAktivitas" | "pengaturan";
export type Aksi  = "lihat" | "tambah" | "edit" | "hapus" | "export";

const matrix: Record<AksesLevel, Partial<Record<Modul, Aksi[]>>> = {
  "Super Admin": {
    transaksi:    ["lihat", "tambah", "edit", "hapus", "export"],
    pelanggan:    ["lihat", "tambah", "edit", "hapus"],
    pengguna:     ["lihat", "tambah", "edit", "hapus"],
    logAktivitas: ["lihat"],
    pengaturan:   ["lihat", "edit"],
  },
  "Admin": {
    transaksi:    ["lihat", "tambah", "edit", "hapus", "export"],
    pelanggan:    ["lihat", "tambah", "edit", "hapus"],
    pengguna:     [],
    logAktivitas: ["lihat"],
    pengaturan:   ["lihat", "edit"],
  },
  "Viewer": {
    transaksi:    ["lihat", "export"],
    pelanggan:    ["lihat"],
    pengguna:     [],
    logAktivitas: [],
    pengaturan:   ["lihat", "edit"],
  },
};

export function can(role: AksesLevel, modul: Modul, aksi: Aksi): boolean {
  return matrix[role]?.[modul]?.includes(aksi) ?? false;
}
