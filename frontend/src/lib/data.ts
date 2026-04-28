export type AksesLevel = "SUPER_ADMIN" | "ADMIN" | "VIEWER";

export const AKSES_LEVEL_LABEL: Record<AksesLevel, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  VIEWER: "Viewer",
};

export type User = {
  id: string;
  full_name: string;
  username: string;
  email: string;
  access_level: AksesLevel;
  position: string | null;
  phone_number: string | null;
  address: string | null;
  status: "ACTIVE" | "INACTIVE";
  created_at: string;
  updated_at: string;
};
