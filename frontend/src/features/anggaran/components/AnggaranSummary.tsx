import { ProgressBar } from '@/components/ui/progress-bar';
import { formatRp } from '@/lib/format';
import { MONTH_NAMES } from '../constants';
import type { StatusFilter } from '../types';

type StatusKey = Exclude<StatusFilter, 'all'>;

interface StatusConfig {
  label: string;
  bg: string;
  borderInactive: string;
  borderActive: string;
  ring: string;
  countColor: string;
  labelColor: string;
}

const STATUS_CONFIG: Record<StatusKey, StatusConfig> = {
  safe: {
    label: 'Aman',
    bg: 'bg-brand-light',
    borderInactive: 'border-brand/[19%]',
    borderActive: 'border-brand',
    ring: 'ring-[3px] ring-brand/[13%]',
    countColor: 'text-brand',
    labelColor: 'text-brand',
  },
  warn: {
    label: 'Hampir Habis',
    bg: 'bg-app-warning-light',
    borderInactive: 'border-app-warning/[19%]',
    borderActive: 'border-app-warning',
    ring: 'ring-[3px] ring-app-warning/[13%]',
    countColor: 'text-app-warning',
    labelColor: 'text-app-warning',
  },
  over: {
    label: 'Lewat Batas',
    bg: 'bg-app-danger-light',
    borderInactive: 'border-app-danger/[19%]',
    borderActive: 'border-app-danger',
    ring: 'ring-[3px] ring-app-danger/[13%]',
    countColor: 'text-app-danger',
    labelColor: 'text-app-danger',
  },
};

interface AnggaranSummaryProps {
  currentDate: Date;
  totalUsed: number;
  totalBudget: number;
  overallPct: number;
  daysLeft: number;
  safeCount: number;
  warnCount: number;
  overCount: number;
  statusFilter: StatusFilter;
  onStatusFilterChange: (filter: StatusFilter) => void;
}

export function AnggaranSummary({
  currentDate,
  totalUsed,
  totalBudget,
  overallPct,
  daysLeft,
  safeCount,
  warnCount,
  overCount,
  statusFilter,
  onStatusFilterChange,
}: AnggaranSummaryProps) {
  const statusCounts: Record<StatusKey, number> = {
    safe: safeCount,
    warn: warnCount,
    over: overCount,
  };

  return (
    <div className="bg-surface border border-app-border rounded-[12px] p-4 sm:p-[22px] mb-4 sm:mb-[22px] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr] gap-5 sm:gap-7">

      {/* Total usage */}
      <div className="sm:col-span-2 xl:col-span-1">
        <div className="text-[11.5px] font-semibold text-app-text-muted tracking-[0.3px] mb-1.5">
          RINGKASAN {MONTH_NAMES[currentDate.getMonth()].toUpperCase()}
        </div>
        <div className="text-[22px] sm:text-[26px] font-bold tracking-[-0.03125rem] tabular-nums text-app-text">
          {formatRp(totalUsed)}{' '}
          <span className="text-sm sm:text-base text-app-text-subtle font-medium">
            / {formatRp(totalBudget)}
          </span>
        </div>
        <div className="mt-2.5">
          <ProgressBar pct={overallPct} height={8} />
        </div>
        <div className="text-xs text-app-text-muted mt-1.5">
          {overallPct}% terpakai · {daysLeft} hari tersisa di bulan ini
        </div>
      </div>

      {/* Status filter cards */}
      {(Object.keys(STATUS_CONFIG) as StatusKey[]).map(statusKey => {
        const config = STATUS_CONFIG[statusKey];
        const count = statusCounts[statusKey];
        const isActive = statusFilter === statusKey;

        return (
          <button
            key={statusKey}
            onClick={() => onStatusFilterChange(isActive ? 'all' : statusKey)}
            className={`
              py-4 px-4 rounded-[12px] text-left cursor-pointer font-sans
              transition-[box-shadow,border-color] duration-150 border
              ${config.bg}
              ${isActive
                ? `${config.borderActive} ${config.ring}`
                : config.borderInactive
              }
            `}
          >
            <div className="text-[11.5px] font-semibold text-app-text-muted tracking-[0.3px]">
              {config.label.toUpperCase()}
            </div>
            <div className={`text-[26px] sm:text-[28px] font-bold tracking-[-0.03125rem] mt-1 ${config.countColor}`}>
              {count}
            </div>
            <div className={`text-[11.5px] ${isActive ? `${config.labelColor} font-semibold` : 'text-app-text-muted font-normal'}`}>
              {isActive ? 'klik untuk reset' : 'kategori'}
            </div>
          </button>
        );
      })}
    </div>
  );
}
