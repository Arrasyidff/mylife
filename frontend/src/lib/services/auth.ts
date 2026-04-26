import { api, getAuthToken } from "@/lib/api";
import type { User } from "@/lib/data";
import { mockLoginApi, mockGetMeApi } from "@/lib/mock/auth";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export async function loginApi(username: string, password: string): Promise<string> {
  if (USE_MOCK) return mockLoginApi(username, password);
  const data = await api.post<{ token: string }>("/auth/login", { username, password });
  return data.token;
}

export async function getMeApi(): Promise<User> {
  if (USE_MOCK) {
    const token = getAuthToken() ?? "";
    return mockGetMeApi(token);
  }
  return api.get<User>("/auth/me");
}
