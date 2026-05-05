import { PERIODS } from '../constants';
import type { Period } from '../types';

type Props = {
  period: Period;
  setPeriod: (p: Period) => void;
};

export function PeriodToggle({ period, setPeriod }: Props) {
  return (
    <div className="inline-flex w-full md:w-auto p-0.75 bg-surface-alt rounded-[9px] border border-app-border">
      {PERIODS.map((p, i) => {
        const active = i === period;
        return (
          <button
            key={p}
            onClick={() => setPeriod(i as Period)}
            className={[
              'flex-1 md:flex-none px-3.5 py-1.5 rounded-[7px] border-none text-[12.5px] font-semibold cursor-pointer font-sans transition-[background,color] duration-120',
              active
                ? 'bg-white text-app-text shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                : 'bg-transparent text-app-text-muted',
            ].join(' ')}
          >
            {p}
          </button>
        );
      })}
    </div>
  );
}
