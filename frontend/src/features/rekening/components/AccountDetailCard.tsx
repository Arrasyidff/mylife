"use client";
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { Icon } from '@/components/ui/icon';
import { transactions } from '@/lib/dashboard-data';
import { formatRp, formatTxDate } from '@/lib/format';
import type { Account, Transaction } from '../types';

function getAccountTxs(acctId: string): Transaction[] {
  return transactions.filter(t => t.acct === acctId);
}

function getAccountStats(acctId: string) {
  const txs = getAccountTxs(acctId);
  const income  = txs.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expense = txs.filter(t => t.amount < 0 && t.type !== 'transfer').reduce((s, t) => s + Math.abs(t.amount), 0);
  return { income, expense, net: income - expense };
}

interface AccountDetailCardProps {
  acct: Account;
  isHidden: boolean;
  onEdit: () => void;
  onToggleHide: () => void;
}

export function AccountDetailCard({ acct, isHidden, onEdit, onToggleHide }: AccountDetailCardProps) {
  const recentTxs = getAccountTxs(acct.id);
  const { income, expense, net } = getAccountStats(acct.id);

  const stats = [
    { label: 'MASUK',  val: income,  bgCls: 'bg-[#E6F6F0]', fgCls: 'text-[#15735A]' },
    { label: 'KELUAR', val: expense, bgCls: 'bg-[#FDEEEE]',  fgCls: 'text-[#C0392B]' },
    {
      label: 'NET', val: net,
      bgCls: net >= 0 ? 'bg-[#E6F6F0]' : 'bg-[#FDEEEE]',
      fgCls: net >= 0 ? 'text-[#15735A]' : 'text-[#C0392B]',
    },
  ];

  return (
    <div
      className="bg-white border border-[#E0EAE6] rounded-[0.75rem] overflow-hidden transition-opacity duration-200"
      style={{ opacity: isHidden ? 0.55 : 1 }}
    >
      {/* Colored header */}
      <div
        className="px-5 py-4.5 flex flex-row items-start gap-3 border-b"
        style={{
          background: isHidden ? '#F6F9F7' : acct.color + '12',
          borderBottomColor: isHidden ? '#EEF2F0' : acct.color + '28',
        }}
      >
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div
            className="w-11.5 h-11.5 rounded-[0.8125rem] flex items-center justify-center text-xs font-bold tracking-[0.025rem] shrink-0 text-white"
            style={{ background: isHidden ? '#7D959030' : acct.color }}
          >
            {acct.glyph}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-bold text-[#1A2420] flex items-center gap-2 flex-wrap">
              {acct.name}
              {isHidden && (
                <span className="text-[0.625rem] font-semibold text-[#7D9590] bg-[#F6F9F7] border border-[#E0EAE6] rounded-lg py-px px-1.5 tracking-[0.01875rem]">
                  TIDAK DIHITUNG
                </span>
              )}
            </div>
            <div className="text-xs text-[#A4B8B2] mt-0.5">{acct.subtitle}</div>
          </div>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <button
            onClick={onToggleHide}
            title={isHidden ? 'Masukkan ke total aset' : 'Keluarkan dari total aset'}
            className={`inline-flex items-center justify-center w-7.5 h-7.5 rounded-[0.4375rem] cursor-pointer text-[#7D9590] border ${
              isHidden ? 'border-[#CEDAD4] bg-[#F6F9F7]' : 'border-[#E0EAE6] bg-white'
            }`}
          >
            {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1.25 py-1.25 px-2.5 rounded-[0.4375rem] border border-[#E0EAE6] bg-white text-[#7D9590] cursor-pointer text-xs font-semibold font-sans"
          >
            {Icon.edit(13)} Edit
          </button>
        </div>
      </div>

      {/* Balance + monthly stats */}
      <div className="px-5 pt-5">
        <div className="text-[0.6875rem] text-[#7D9590] font-semibold tracking-[0.01875rem] mb-1">
          SALDO SAAT INI
        </div>
        <div className="text-[1.375rem] sm:text-[1.75rem] font-bold text-[#1A2420] tracking-[-0.05rem] tabular-nums">
          {formatRp(acct.balance)}
        </div>

        <div className="grid grid-cols-3 gap-2.5 mt-4">
          {stats.map((s, i) => (
            <div key={i} className={`${s.bgCls} rounded-[0.5rem] py-2.5 px-3`}>
              <div className={`text-[0.625rem] font-bold tracking-[0.01875rem] mb-0.75 ${s.fgCls}`}>
                {s.label}
              </div>
              <div className={`text-[0.8125rem] font-bold tabular-nums ${s.fgCls}`}>
                {i === 2 && net > 0 ? '+' : ''}{formatRp(s.val)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      {recentTxs.length > 0 && (
        <div className="px-5 pt-4">
          <div className="text-[0.6875rem] font-semibold text-[#7D9590] tracking-[0.01875rem] mb-2">
            TRANSAKSI TERBARU
          </div>
          <div className="bg-[#F6F9F7] rounded-[0.5rem] border border-[#EEF2F0] overflow-hidden">
            {recentTxs.slice(0, 3).map((t, i, arr) => (
              <div
                key={t.id}
                className={`flex items-center gap-2.5 py-2.5 px-3.5 ${i < arr.length - 1 ? 'border-b border-[#EEF2F0]' : ''}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[0.78125rem] font-semibold text-[#1A2420] truncate">
                    {t.merch}
                  </div>
                  <div className="text-[0.6875rem] text-[#A4B8B2] mt-px">{formatTxDate(t.date)}</div>
                </div>
                <div className={`text-[0.8125rem] font-bold tabular-nums shrink-0 ${t.amount > 0 ? 'text-[#15735A]' : 'text-[#1A2420]'}`}>
                  {t.amount > 0 ? '+' : ''}{formatRp(t.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-5 pt-3 pb-4.5">
        <Link
          href="/transaksi"
          className="block text-center w-full py-2.25 rounded-[0.5rem] border border-[#E0EAE6] bg-[#F6F9F7] text-[#15735A] text-[0.78125rem] font-semibold no-underline font-sans"
        >
          Lihat semua transaksi →
        </Link>
      </div>
    </div>
  );
}
