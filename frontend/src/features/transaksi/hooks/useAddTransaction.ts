"use client";
import { useState } from 'react';
import { createTransaksi } from '../services/transaksiService';
import type { Transaction } from '../types';

interface UseAddTransactionOptions {
  onSuccess: () => Promise<void>;
  showToast: (message: string, isSuccess?: boolean) => void;
}

export function useAddTransaction({ onSuccess, showToast }: UseAddTransactionOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleAdd(drafts: Omit<Transaction, 'id'>[]) {
    setIsSubmitting(true);
    try {
      await Promise.all([
        Promise.all(
          drafts.map(draft =>
            createTransaksi({
              user:          draft.user,
              cat:           draft.cat,
              merch:         draft.merch,
              acct:          draft.acct,
              to_account_id: draft.to_account_id ?? undefined,
              amount:        Math.abs(draft.amount),
              date:          draft.date,
              type:          draft.type,
              note:          draft.note ?? undefined,
            })
          )
        ),
        new Promise<void>(resolve => setTimeout(resolve, 500)),
      ]);
      await onSuccess();
      showToast(
        drafts.length > 1
          ? 'Transfer + biaya admin berhasil dicatat'
          : `Transaksi "${drafts[0]?.merch}" berhasil ditambahkan`
      );
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Gagal menambah transaksi', false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return { handleAdd, isSubmitting };
}
