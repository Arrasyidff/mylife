export type AksesLevel = "Super Admin" | "Admin" | "Viewer";

export type User = {
  id: string;
  nama: string;
  username: string;
  aksesLevel: AksesLevel;
  jabatan?: string;
};
