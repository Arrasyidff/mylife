import { Sparkles } from "lucide-react";
import Link from "next/link";

export function LoginHeader() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="relative w-16 h-16 flex items-center justify-center rounded-full border border-[rgb(21,115,90)]/30"
        style={{ background: "linear-gradient(135deg, rgba(21,115,90,0.12) 0%, rgba(29,158,117,0.08) 100%)" }}>
        <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(135deg, rgba(21,115,90,0.15) 0%, transparent 100%)" }} />
        <Sparkles className="relative z-10" size={28} style={{ color: "rgb(21, 115, 90)" }} />
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
