import type { StatItem } from '../types';

type Props = { stats: StatItem[] };

export function TopStatsGrid({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-3.5 mb-4.5 md:mb-5.5">
      {stats.map((s, i) => (
        <div key={i} className="bg-white border border-app-border rounded-xl p-3.5 md:p-4.5">
          <div className="text-[10.5px] md:text-[11px] font-semibold text-app-text-muted tracking-[0.025rem]">{s.label}</div>
          <div className="text-[16px] md:text-[19px] font-bold mt-1.5 tracking-[-0.025rem] tabular-nums leading-tight" style={{ color: s.tone }}>
            {s.value}
          </div>
          <div className="text-[11px] md:text-[11.5px] text-app-text-subtle mt-0.75 leading-snug">{s.sub}</div>
        </div>
      ))}
    </div>
  );
}
