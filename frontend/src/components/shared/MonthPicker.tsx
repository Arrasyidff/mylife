"use client";
import { useState, useRef, useEffect } from 'react';
import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';

const MONTH_SHORT = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const TODAY = new Date();

interface MonthPickerProps {
  viewMonth: number;
  viewYear: number;
  btnLabel: string;
  setViewMonth: (month: number) => void;
  setViewYear: (fn: (year: number) => number) => void;
}

export function MonthPicker({ viewMonth, viewYear, btnLabel, setViewMonth, setViewYear }: MonthPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function onClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <Btn kind="ghost" size="sm" icon={Icon.calendar(14)} onClick={() => setIsOpen(open => !open)} style={{ userSelect: 'none' }}>
        {btnLabel}
      </Btn>

      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 top-[calc(100%+6px)] z-200 bg-white border border-app-border rounded-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] p-3.5 w-55">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setViewYear(year => year - 1)}
              className="w-7 h-7 rounded-[7px] border border-app-border bg-surface-alt text-app-text cursor-pointer flex items-center justify-center"
            >
              {Icon.chev(12, 'left')}
            </button>
            <span className="font-bold text-sm text-app-text">{viewYear}</span>
            <button
              onClick={() => setViewYear(year => year + 1)}
              className="w-7 h-7 rounded-[7px] border border-app-border bg-surface-alt text-app-text cursor-pointer flex items-center justify-center"
            >
              {Icon.chev(12, 'right')}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.25">
            {MONTH_SHORT.map((monthName, index) => {
              const isCurrent = index === TODAY.getMonth() && viewYear === TODAY.getFullYear();
              const isSelected = index === viewMonth;
              return (
                <button
                  key={index}
                  onClick={() => { setViewMonth(index); setIsOpen(false); }}
                  className={[
                    'py-1.75 px-1 rounded-[7px] border-none text-[12.5px] font-semibold cursor-pointer font-sans',
                    isSelected
                      ? 'bg-brand-light text-brand-dark'
                      : isCurrent
                      ? 'text-brand [outline:1.5px_solid_#E6F6F0]'
                      : 'bg-transparent text-app-text',
                  ].join(' ')}
                >
                  {monthName}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
