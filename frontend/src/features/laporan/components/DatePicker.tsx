"use client";
import { useState, useRef, useEffect } from 'react';
import { T } from '@/lib/tokens';
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
    <div ref={ref} style={{ position: 'relative' }}>
      <Btn kind="ghost" size="sm" icon={Icon.calendar(14)} onClick={() => setOpen(o => !o)} style={{ userSelect: 'none' }}>
        {btnLabel}
      </Btn>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 6px)', zIndex: 200,
          background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10,
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)', padding: 14, width: 220,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: period === 1 ? 12 : 0,
          }}>
            <button
              onClick={() => setViewYear(y => y - 1)}
              style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${T.border}`, background: T.surfaceAlt, color: T.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {Icon.chev(12, 'left')}
            </button>
            <span style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{viewYear}</span>
            <button
              onClick={() => setViewYear(y => y + 1)}
              style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${T.border}`, background: T.surfaceAlt, color: T.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {Icon.chev(12, 'right')}
            </button>
          </div>

          {period === 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5 }}>
              {MONTH_SHORT.map((m, i) => {
                const isCurrent = i === TODAY.getMonth() && viewYear === TODAY.getFullYear();
                return (
                  <button
                    key={i}
                    onClick={() => { setViewMonth(i); setOpen(false); }}
                    style={{
                      padding: '7px 4px', borderRadius: 7, border: 'none', fontSize: 12.5, fontWeight: 600,
                      background: i === viewMonth ? T.primaryLight : 'transparent',
                      color: i === viewMonth ? T.primaryDark : isCurrent ? T.primary : T.text,
                      cursor: 'pointer', fontFamily: T.fontSans,
                      outline: isCurrent && i !== viewMonth ? `1.5px solid ${T.primaryLight}` : 'none',
                    }}
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
