import { CheckCircle, XCircle } from 'lucide-react';
import type { Toast } from '../types';

interface TransaksiToastProps {
  toast: Toast | null;
}

export function TransaksiToast({ toast }: TransaksiToastProps) {
  if (!toast) return null;
  const ok = toast.ok;
  return (
    <div className={[
      'fixed top-5 right-4 md:right-6 z-[200] max-w-[360px] w-[calc(100vw-2rem)] md:w-auto',
      'flex items-center gap-2.5',
      'bg-surface rounded-[10px] px-4 py-3',
      'shadow-[0_4px_20px_rgba(20,30,25,0.12)]',
      'border border-l-4',
      ok
        ? 'border-brand/25 border-l-brand'
        : 'border-app-danger/25 border-l-app-danger',
    ].join(' ')}>
      {ok
        ? <CheckCircle size={16} className="text-brand shrink-0" />
        : <XCircle size={16} className="text-app-danger shrink-0" />
      }
      <span className="text-[13px] font-semibold text-app-text">{toast.msg}</span>
    </div>
  );
}
