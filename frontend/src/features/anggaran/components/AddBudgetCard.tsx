"use client";
import { Icon } from '@/components/ui/icon';

interface AddBudgetCardProps {
  onClick: () => void;
}

export function AddBudgetCard({ onClick }: AddBudgetCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-transparent border-[1.5px] border-dashed border-[#CEDAD4] rounded-[0.75rem] p-[18px] cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[184px] text-[#7D9590] font-sans"
    >
      <div className="w-[38px] h-[38px] rounded-[12px] border-[1.5px] border-dashed border-[#CEDAD4] flex items-center justify-center">
        {Icon.plus(18)}
      </div>
      <div className="text-[13px] font-semibold">Tambah Anggaran</div>
      <div className="text-[11.5px] text-[#A4B8B2]">Buat anggaran kategori baru</div>
    </button>
  );
}
