import { Icon } from '@/components/ui/icon';
import { Pill } from '@/components/ui/pill';
import { CatBubble } from '@/components/shared/CatBubble';
import { UserBadge } from '@/components/shared/UserBadge';
import { formatRp, formatTxDate } from '@/lib/format';
import type { Transaction } from '../types';

interface TxLineProps {
  t: Transaction;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
}

export function TxLine({ t, expanded, onToggle, onEdit }: TxLineProps) {
  const acct = t.acct_info;
  const isIncome = t.type === 'income';

  const borderColorClass =
    t.type === 'income'   ? 'border-l-brand' :
    t.type === 'transfer' ? 'border-l-[#3B82F6]' : 'border-l-app-danger';

  const amountColorClass =
    isIncome              ? 'text-brand-dark' :
    t.type === 'transfer' ? 'text-app-info'   : 'text-app-text';

  return (
    <>
      <div
        onClick={onEdit}
        className={[
          'flex items-center gap-3 md:gap-3.5',
          'px-3.5 md:px-4.5 py-3 md:py-3.5',
          'border-l-[3px]', borderColorClass,
          'bg-surface hover:bg-surface-alt',
          'border-b border-b-app-divider',
          'cursor-pointer transition-colors duration-100',
        ].join(' ')}
      >
        <CatBubble cat={t.cat} size={38} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-sm font-semibold text-app-text truncate">{t.merch}</span>
            <Pill
              tone={t.type === 'income' ? 'success' : t.type === 'transfer' ? 'info' : 'danger'}
              size="sm"
            >
              {t.type === 'income' ? 'Pemasukan' : t.type === 'transfer' ? 'Transfer' : 'Pengeluaran'}
            </Pill>
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-[12px] text-app-text-subtle overflow-hidden">
            {acct && (
              <span className="inline-flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: acct.color }} />
                {acct.name}
              </span>
            )}
            {acct && <span className="shrink-0">·</span>}
            <span className="shrink-0">{formatTxDate(t.date)}</span>
            {t.note && (
              <>
                <span className="shrink-0 hidden md:block">·</span>
                <span className="italic truncate hidden md:block">{t.note}</span>
              </>
            )}
          </div>
        </div>

        {/* UserBadge: hidden on mobile */}
        <div className="hidden md:block shrink-0">
          <UserBadge user={t.user} size={22} />
        </div>

        <div className={[
          'text-sm md:text-[15px] font-bold tabular-nums whitespace-nowrap text-right shrink-0',
          'md:min-w-32.5',
          amountColorClass,
        ].join(' ')}>
          {isIncome ? '+' : ''}{formatRp(t.amount)}
        </div>

        {t.type === 'transfer' && (
          <button
            onClick={e => { e.stopPropagation(); onToggle(); }}
            className="border-0 bg-transparent text-app-text-subtle cursor-pointer p-1 shrink-0 flex"
          >
            {Icon.chev(16, expanded ? 'up' : 'down')}
          </button>
        )}
      </div>

      {expanded && t.type === 'transfer' && (
        <div className="bg-surface-alt border-l-[3px] border-l-[#3B82F6] border-b border-b-app-divider px-4.5 pt-3 pb-3.5 pl-16">
          <div className="text-[11px] font-bold text-app-text-muted tracking-[0.3px] uppercase mb-2">
            3 ENTRI TERHUBUNG
          </div>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Debit dari Mandiri', amt: -500_000, colorClass: 'text-app-danger',  dotClass: 'bg-app-danger'  },
              { label: 'Kredit ke GoPay',    amt:  500_000, colorClass: 'text-brand',        dotClass: 'bg-brand'       },
              { label: 'Biaya Admin',        amt:   -2_500, colorClass: 'text-app-warning',  dotClass: 'bg-app-warning' },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-2.5 text-[12.5px]">
                <span className={`w-2 h-2 rounded-full shrink-0 ${r.dotClass}`} />
                <span className="flex-1 text-app-text">{r.label}</span>
                <span className={`tabular-nums font-semibold ${r.colorClass}`}>
                  {r.amt > 0 ? '+' : ''}{formatRp(r.amt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
