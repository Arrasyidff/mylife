import { Sparkles } from "lucide-react";
import Link from "next/link";

export function LoginHeader() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-zinc-100 border border-zinc-200">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-zinc-200/60 to-transparent" />
        <Sparkles className="text-zinc-800 relative z-10" size={28} />
      </div>
      <div className="space-y-2">
        <h1 className="text-[32px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1a1a1a]">
          Yooo, welcome back!
        </h1>
        <p className="text-base text-zinc-500">
          Let's track our journey
        </p>
      </div>
    </div>
  );
}
