"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { HelpCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { LoginHeader } from "@/features/auth/components/LoginHeader";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [loading, user, router]);

  if (loading) return null;

  return (
    <div className="relative min-h-screen bg-white text-[#1a1a1a] overflow-hidden">
      <header className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-4 sm:px-8 py-4 sm:py-6">
        <div className="text-lg sm:text-xl font-bold tracking-tighter text-[#1a1a1a]">MY<span style={{ background: "linear-gradient(135deg, rgb(21, 115, 90) 0%, rgb(29, 158, 117) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>LIFE</span></div>
        <button className="text-zinc-400 hover:text-zinc-700 transition-colors duration-200 p-1">
          <HelpCircle size={20} />
        </button>
      </header>

      <main className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 relative z-10">
        <div className="w-full max-w-[420px] flex flex-col items-center gap-8 sm:gap-10
          sm:bg-white sm:border sm:border-zinc-100 sm:rounded-2xl sm:shadow-sm sm:px-8 sm:py-10
          md:px-10 md:py-12">
          <LoginHeader />
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
