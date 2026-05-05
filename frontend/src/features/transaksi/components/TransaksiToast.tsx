import { CheckCircle, XCircle } from 'lucide-react';
import { T } from '@/lib/tokens';
import type { Toast } from '../types';

interface TransaksiToastProps {
  toast: Toast | null;
}

export function TransaksiToast({ toast }: TransaksiToastProps) {
  if (!toast) return null;
  return (
    <div style={{
      position: 'fixed', top: 20, right: 24,
      background: T.surface,
      border: `1px solid ${toast.ok ? T.primary : T.danger}44`,
      borderLeft: `4px solid ${toast.ok ? T.primary : T.danger}`,
      borderRadius: 10,
      padding: '12px 16px',
      boxShadow: '0 4px 20px rgba(20,30,25,0.12)',
      display: 'flex', alignItems: 'center', gap: 10,
      zIndex: 200, maxWidth: 360,
    }}>
      {toast.ok
        ? <CheckCircle size={16} color={T.primary} />
        : <XCircle size={16} color={T.danger} />
      }
      <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{toast.msg}</span>
    </div>
  );
}
