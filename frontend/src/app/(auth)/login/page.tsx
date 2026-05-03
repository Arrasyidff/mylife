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
    <div
      className="relative min-h-screen bg-white text-[#1a1a1a] overflow-hidden"
    >
      <header className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-6">
        <div className="text-xl font-bold tracking-tighter text-[#1a1a1a]">MYLIFE</div>
        <button className="text-zinc-400 hover:text-zinc-700 transition-colors duration-200">
          <HelpCircle size={20} />
        </button>
      </header>

      <main className="flex flex-col items-center justify-center min-h-screen px-4 relative z-10">
        <div className="w-full max-w-[420px] flex flex-col items-center gap-10">
          <LoginHeader />
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
