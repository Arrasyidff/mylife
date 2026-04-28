import type { User } from "@/lib/data";

const MOCK_USERS: Record<string, User & { password: string }> = {
  superadmin: {
    id: "1",
    full_name: "Budi Santoso",
    username: "superadmin",
    email: "superadmin@example.com",
    password: "password",
    access_level: "SUPER_ADMIN",
    position: "Direktur",
    phone_number: null,
    address: null,
    status: "ACTIVE",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  admin: {
    id: "2",
    full_name: "Siti Rahayu",
    username: "admin",
    email: "admin@example.com",
    password: "password",
    access_level: "ADMIN",
    position: "Manajer Operasional",
    phone_number: null,
    address: null,
    status: "ACTIVE",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  viewer: {
    id: "3",
    full_name: "Andi Pratama",
    username: "viewer",
    email: "viewer@example.com",
    password: "password",
    access_level: "VIEWER",
    position: "Staff",
    phone_number: null,
    address: null,
    status: "ACTIVE",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

const MOCK_TOKEN_PREFIX = "mock-token-";

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockLoginApi(username: string, password: string): Promise<{ token: string; user: User }> {
  await delay();
  const user = MOCK_USERS[username.toLowerCase()];
  if (!user || user.password !== password) {
    throw new Error("Username atau kata sandi salah.");
  }
  const token = `${MOCK_TOKEN_PREFIX}${user.id}`;
  const { password: _, ...safeUser } = user;
  return { token, user: safeUser };
}

export async function mockGetMeApi(token: string): Promise<User> {
  await delay(200);
  const userId = token.replace(MOCK_TOKEN_PREFIX, "");
  const user = Object.values(MOCK_USERS).find((u) => u.id === userId);
  if (!user) throw new Error("Sesi tidak valid.");
  const { password: _, ...safeUser } = user;
  return safeUser;
}
