import { PERIODS } from '../constants';
import type { Period } from '../types';

type Props = {
  period: Period;
  setPeriod: (p: Period) => void;
};

export function PeriodToggle({ period, setPeriod }: Props) {
  return (
    <div className="inline-flex p-0.75 bg-[#F6F9F7] rounded-[9px] border border-[#E0EAE6]">
      {PERIODS.map((p, i) => {
        const active = i === period;
        return (
          <button
            key={p}
            onClick={() => setPeriod(i as Period)}
            className={[
              'px-3.5 py-1.5 rounded-[7px] border-none text-[12.5px] font-semibold cursor-pointer font-sans transition-[background,color] duration-120',
              active
                ? 'bg-white text-[#1A2420] shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                : 'bg-transparent text-[#7D9590]',
            ].join(' ')}
          >
            {p}
          </button>
        );
      })}
    </div>
  );
}
