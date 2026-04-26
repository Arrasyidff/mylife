"use client";
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { User } from "@/lib/data";
import { getAuthToken, setAuthToken } from "@/lib/api";
import { loginApi, getMeApi } from "@/lib/services/auth";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const token = getAuthToken();
      if (!token) { setLoading(false); return; }
      try {
        const me = await getMeApi();
        setUser(me);
      } catch {
        setAuthToken(null);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const token = await loginApi(username, password);
    setAuthToken(token);
    const me = await getMeApi();
    setUser(me);
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useRequiredAuth() {
  const { user, ...rest } = useAuth();
  if (!user) throw new Error("useRequiredAuth: user is null");
  return { user, ...rest };
}
