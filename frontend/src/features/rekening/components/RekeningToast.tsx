import { CheckCircle, XCircle } from 'lucide-react';
import { T } from '@/lib/tokens';

interface RekeningToastProps {
  toast: { ok: boolean; msg: string };
}

export function RekeningToast({ toast }: RekeningToastProps) {
  return (
    <div
      className="fixed top-5 right-6 bg-white rounded-[0.625rem] py-3 px-4 shadow-[0_4px_20px_rgba(20,30,25,0.12)] flex items-center gap-2.5 z-100 max-w-85"
      style={{
        border: `1px solid ${toast.ok ? T.primary : T.danger}44`,
        borderLeft: `4px solid ${toast.ok ? T.primary : T.danger}`,
        animation: 'slideIn 0.2s ease',
      }}
    >
      {toast.ok
        ? <CheckCircle size={16} color={T.primary} />
        : <XCircle size={16} color={T.danger} />
      }
      <span className="text-[0.8125rem] font-semibold text-[#1A2420]">{toast.msg}</span>
    </div>
  );
}
