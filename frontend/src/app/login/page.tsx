"use client";
import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setError("");
    setSubmitting(true);
    try {
      await login(username, password);
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal. Periksa kembali kredensial Anda.");
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled = !username || !password || submitting;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-xl">
            NA
          </div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 px-6 py-8">
          <h1 className="text-xl font-bold text-foreground mb-1 text-center">Masuk</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
            Masukkan kredensial Anda untuk melanjutkan
          </p>

          {/* Error alert */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Nama Pengguna
              </label>
              <input
                id="username"
                type="text"
                autoFocus
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan nama pengguna"
                className={cn(
                  "w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-gray-900",
                  "border-gray-300 dark:border-gray-600 text-foreground",
                  "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                  "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
                  "transition-colors"
                )}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className={cn(
                    "w-full px-3 py-2 pr-10 rounded-lg border text-sm bg-white dark:bg-gray-900",
                    "border-gray-300 dark:border-gray-600 text-foreground",
                    "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                    "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
                    "transition-colors"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isDisabled}
              className={cn(
                "w-full py-2.5 rounded-lg text-sm font-semibold transition-colors mt-2",
                isDisabled
                  ? "bg-primary/50 text-white/70 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary/90 active:bg-primary/80"
              )}
            >
              {submitting ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
