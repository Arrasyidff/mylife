"use client";
import { useState, useRef, useEffect } from 'react';
import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';
import { TODAY, MONTH_SHORT } from '../constants';
import type { Period } from '../types';

type Props = {
  period: Period;
  viewMonth: number;
  viewYear: number;
  btnLabel: string;
  setViewMonth: (m: number) => void;
  setViewYear: (fn: (y: number) => number) => void;
};

export function DatePicker({ period, viewMonth, viewYear, btnLabel, setViewMonth, setViewYear }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <Btn kind="ghost" size="sm" icon={Icon.calendar(14)} onClick={() => setOpen(o => !o)} style={{ userSelect: 'none' }}>
        {btnLabel}
      </Btn>

      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-200 bg-white border border-app-border rounded-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] p-3.5 w-55">
          <div className={`flex items-center justify-between ${period === 1 ? 'mb-3' : ''}`}>
            <button
              onClick={() => setViewYear(y => y - 1)}
              className="w-7 h-7 rounded-[7px] border border-app-border bg-surface-alt text-app-text cursor-pointer flex items-center justify-center"
            >
              {Icon.chev(12, 'left')}
            </button>
            <span className="font-bold text-sm text-app-text">{viewYear}</span>
            <button
              onClick={() => setViewYear(y => y + 1)}
              className="w-7 h-7 rounded-[7px] border border-app-border bg-surface-alt text-app-text cursor-pointer flex items-center justify-center"
            >
              {Icon.chev(12, 'right')}
            </button>
          </div>

          {period === 1 && (
            <div className="grid grid-cols-3 gap-1.25">
              {MONTH_SHORT.map((m, i) => {
                const isCurrent = i === TODAY.getMonth() && viewYear === TODAY.getFullYear();
                const isSelected = i === viewMonth;
                return (
                  <button
                    key={i}
                    onClick={() => { setViewMonth(i); setOpen(false); }}
                    className={[
                      'py-1.75 px-1 rounded-[7px] border-none text-[12.5px] font-semibold cursor-pointer font-sans',
                      isSelected
                        ? 'bg-brand-light text-brand-dark'
                        : isCurrent
                        ? 'text-brand [outline:1.5px_solid_#E6F6F0]'
                        : 'bg-transparent text-app-text',
                    ].join(' ')}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
