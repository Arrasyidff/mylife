import { T } from '@/lib/tokens';
import { CheckCircle, XCircle } from 'lucide-react';
import type { Toast } from '../hooks/useDashboard';

interface DashboardToastProps {
  toast: Toast | null;
}

export function DashboardToast({ toast }: DashboardToastProps) {
  if (!toast) return null;

  return (
    <div
      className="fixed top-5 right-6 bg-white rounded-[10px] py-3 px-4 shadow-[0_4px_20px_rgba(20,30,25,0.12)] flex items-center gap-2.5 z-[100] max-w-[340px]"
      style={{
        border:     `1px solid ${toast.ok ? T.primary : T.danger}44`,
        borderLeft: `4px solid ${toast.ok ? T.primary : T.danger}`,
      }}
    >
      {toast.ok
        ? <CheckCircle size={16} color={T.primary} />
        : <XCircle size={16} color={T.danger} />
      }
      <span className="text-[13px] font-semibold text-[#1A2420]">{toast.msg}</span>
    </div>
  );
}
