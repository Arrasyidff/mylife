import { Sparkles } from "lucide-react";
import Link from "next/link";

export function LoginHeader() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-green-50 border border-green-200">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-green-100/60 to-transparent" />
        <Sparkles className="text-green-600 relative z-10" size={28} />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-[32px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1a1a1a]">
          Yooo, welcome back!
        </h1>
        <p className="text-sm sm:text-base text-zinc-500">
          Let's track our journey
        </p>
      </div>
    </div>
  );
}
