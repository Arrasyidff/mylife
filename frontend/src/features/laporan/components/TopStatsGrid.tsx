import type { StatItem } from '../types';

type Props = { stats: StatItem[] };

export function TopStatsGrid({ stats }: Props) {
  return (
    <div className="grid grid-cols-4 gap-3.5 mb-5.5">
      {stats.map((s, i) => (
        <div key={i} className="bg-white border border-[#E0EAE6] rounded-xl p-4.5">
          <div className="text-[11px] font-semibold text-[#7D9590] tracking-[0.025rem]">{s.label}</div>
          <div className="text-[19px] font-bold mt-1.5 tracking-[-0.025rem] tabular-nums" style={{ color: s.tone }}>
            {s.value}
          </div>
          <div className="text-[11.5px] text-[#A4B8B2] mt-0.75">{s.sub}</div>
        </div>
      ))}
    </div>
  );
}
