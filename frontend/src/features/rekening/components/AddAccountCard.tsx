"use client";
import { Icon } from '@/components/ui/icon';

interface AddAccountCardProps {
  onClick: () => void;
}

export function AddAccountCard({ onClick }: AddAccountCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-transparent border-[1.5px] border-dashed border-[#CEDAD4] rounded-[12px] cursor-pointer flex flex-col items-center justify-center gap-2.5 min-h-60 text-[#7D9590] font-sans"
    >
      <div className="w-11.5 h-11.5 rounded-[13px] border-[1.5px] border-dashed border-[#CEDAD4] flex items-center justify-center">
        {Icon.plus(20)}
      </div>
      <div className="text-center">
        <div className="text-sm font-semibold text-[#1A2420]">Tambah Rekening</div>
        <div className="text-xs text-[#A4B8B2] mt-0.75">
          Bank, e-wallet, atau tunai
        </div>
      </div>
    </button>
  );
}
