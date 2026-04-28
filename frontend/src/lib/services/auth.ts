import { api, getAuthToken } from "@/lib/api";
import type { User } from "@/lib/data";
import { mockLoginApi, mockGetMeApi } from "@/lib/mock/auth";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export async function loginApi(username: string, password: string): Promise<{ token: string; user: User }> {
  if (USE_MOCK) return mockLoginApi(username, password);
  const data = await api.post<{ access_token: string; user: User }>("/api/auth/login", { username, password });
  return { token: data.access_token, user: data.user };
}

export async function getMeApi(): Promise<User> {
  if (USE_MOCK) {
    const token = getAuthToken() ?? "";
    return mockGetMeApi(token);
  }
  return api.get<User>("/api/auth/me");
}
