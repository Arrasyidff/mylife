"use client";
import { KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormInput } from "@/components/ui/form-input";
import { useLoginForm } from "../hooks/useLoginForm";

export function LoginForm() {
  const {
    username, setUsername,
    password, setPassword,
    showPassword, setShowPassword,
    error, submitting, isDisabled, handleSubmit,
  } = useLoginForm();

  return (
    <div className="w-full space-y-6">
      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <FormInput
            id="username"
            label="Nama Pengguna"
            type="text"
            autoFocus
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Masukkan nama pengguna"
          />
          <FormInput
            id="password"
            label="Kata Sandi"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            showToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword((v) => !v)}
          />
        </div>

        <div className="space-y-4">
          <button
            type="submit"
            disabled={isDisabled}
            className={cn(
              "w-full py-3.5 sm:py-4 rounded-xl text-sm font-bold tracking-[0.02em] transition-transform active:scale-[0.98]",
              isDisabled
                ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                : "text-white"
            )}
            style={!isDisabled ? { background: "linear-gradient(135deg, rgb(21, 115, 90) 0%, rgb(29, 158, 117) 100%)" } : undefined}
          >
            {submitting ? "Memproses..." : "Masuk"}
          </button>
        </div>
      </form>
    </div>
  );
}
