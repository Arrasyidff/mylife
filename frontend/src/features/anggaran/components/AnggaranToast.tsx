import { CheckCircle, XCircle } from 'lucide-react';
import type { Toast } from '../types';

interface AnggaranToastProps {
  toast: Toast;
}

export function AnggaranToast({ toast }: AnggaranToastProps) {
  return (
    <div
      className={`
        fixed top-5 right-4 sm:right-6 z-[100]
        flex items-center gap-2.5
        max-w-[calc(100vw-2rem)] sm:max-w-[340px]
        bg-surface rounded-[10px] py-3 px-4
        shadow-[0_4px_20px_rgba(20,30,25,0.12)]
        border border-l-4
        ${toast.ok
          ? 'border-brand/[27%] border-l-brand'
          : 'border-app-danger/[27%] border-l-app-danger'
        }
      `}
    >
      {toast.ok
        ? <CheckCircle size={16} className="text-brand shrink-0" />
        : <XCircle size={16} className="text-app-danger shrink-0" />
      }
      <span className="text-[13px] font-semibold text-app-text">{toast.msg}</span>
    </div>
  );
}
