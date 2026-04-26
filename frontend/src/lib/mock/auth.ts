import type { User } from "@/lib/data";

const MOCK_USERS: Record<string, User & { password: string }> = {
  superadmin: {
    id: "1",
    nama: "Budi Santoso",
    username: "superadmin",
    password: "password",
    aksesLevel: "Super Admin",
    jabatan: "Direktur",
  },
  admin: {
    id: "2",
    nama: "Siti Rahayu",
    username: "admin",
    password: "password",
    aksesLevel: "Admin",
    jabatan: "Manajer Operasional",
  },
  viewer: {
    id: "3",
    nama: "Andi Pratama",
    username: "viewer",
    password: "password",
    aksesLevel: "Viewer",
    jabatan: "Staff",
  },
};

const MOCK_TOKEN_PREFIX = "mock-token-";

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockLoginApi(username: string, password: string): Promise<string> {
  await delay();
  const user = MOCK_USERS[username.toLowerCase()];
  if (!user || user.password !== password) {
    throw new Error("Username atau kata sandi salah.");
  }
  return `${MOCK_TOKEN_PREFIX}${user.id}`;
}

export async function mockGetMeApi(token: string): Promise<User> {
  await delay(200);
  const userId = token.replace(MOCK_TOKEN_PREFIX, "");
  const user = Object.values(MOCK_USERS).find((u) => u.id === userId);
  if (!user) throw new Error("Sesi tidak valid.");
  const { password: _, ...safeUser } = user;
  return safeUser;
}
