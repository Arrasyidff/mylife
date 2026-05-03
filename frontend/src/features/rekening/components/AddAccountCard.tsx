"use client";
import { T } from '@/lib/tokens';
import { Icon } from '@/components/ui/icon';

interface AddAccountCardProps {
  onClick: () => void;
}

export function AddAccountCard({ onClick }: AddAccountCardProps) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'transparent',
        border: `1.5px dashed ${T.borderStrong}`,
        borderRadius: T.radius.lg,
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 10, minHeight: 240,
        color: T.textMuted, fontFamily: T.fontSans,
      }}
    >
      <div style={{
        width: 46, height: 46, borderRadius: 13,
        border: `1.5px dashed ${T.borderStrong}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {Icon.plus(20)}
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Tambah Rekening</div>
        <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 3 }}>
          Bank, e-wallet, atau tunai
        </div>
      </div>
    </button>
  );
}
