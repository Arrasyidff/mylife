import { accounts, budgets, transactions } from '@/lib/dashboard-data';
import { T } from '@/lib/tokens';
import { formatRp } from '@/lib/format';
import { Surface } from '@/components/ui/surface';
import { Pill } from '@/components/ui/pill';
import { AccountCard } from '@/components/dashboard/account-card';
import { SummaryStat } from '@/components/dashboard/summary-stat';
import { BudgetRow } from '@/components/dashboard/budget-row';
import { TxRow } from '@/components/dashboard/tx-row';
import { AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';

const MONTH_INCOME  = 14_750_000;
const MONTH_EXPENSE =  9_412_500;

export default function DashboardPage() {
  const totalAssets = accounts.reduce((s, a) => s + a.balance, 0);
  const net = MONTH_INCOME - MONTH_EXPENSE;

  return (
    <div style={{ fontFamily: T.fontSans }}>
      {/* Hero summary stats */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
        <SummaryStat
          large
          label="TOTAL ASET"
          value={formatRp(totalAssets)}
          delta="+ Rp 1.420.000 dari bulan lalu"
        />
        <SummaryStat
          label="Pemasukan Bulan Ini"
          value={formatRp(MONTH_INCOME)}
          delta="vs Rp 14.500.000 lalu"
          deltaTone="up"
          icon={<ArrowUp size={13} color={T.primary} />}
        />
        <SummaryStat
          label="Pengeluaran Bulan Ini"
          value={formatRp(MONTH_EXPENSE)}
          delta="73% dari rata-rata"
          deltaTone="down"
          icon={<ArrowDown size={13} color={T.danger} />}
        />
        <SummaryStat
          label="Net Bulan Ini"
          value={formatRp(net)}
          delta="Surplus sehat"
          deltaTone="up"
        />
      </div>

      {/* Rekening */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 style={{
          margin: 0,
          fontSize: 12,
          fontWeight: 600,
          color: T.textMuted,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        }}>
          Rekening
        </h2>
        <a style={{ fontSize: 12.5, color: T.primaryDark, fontWeight: 600, cursor: 'pointer' }}>
          Kelola →
        </a>
      </div>
      <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
        {accounts.map(a => <AccountCard key={a.id} acct={a} />)}
      </div>

      {/* Two-column: anggaran + transaksi */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {/* Anggaran */}
        <Surface pad={20}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>Anggaran April</h3>
              <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 3 }}>
                {formatRp(9_400_000)} dari {formatRp(11_600_000)} terpakai
              </div>
            </div>
            <Pill tone="warning" icon={<AlertTriangle size={11} />}>
              2 kategori dekat batas
            </Pill>
          </div>
          <div style={{ marginTop: 12 }}>
            {budgets.slice(0, 5).map(b => <BudgetRow key={b.id} b={b} />)}
          </div>
          <a style={{
            display: 'block',
            textAlign: 'center',
            marginTop: 12,
            fontSize: 12.5,
            color: T.primaryDark,
            fontWeight: 600,
            cursor: 'pointer',
          }}>
            Lihat semua anggaran →
          </a>
        </Surface>

        {/* Transaksi terkini */}
        <Surface pad={20}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>Transaksi Terkini</h3>
              <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 3 }}>10 transaksi terakhir</div>
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            {transactions.slice(0, 7).map(t => <TxRow key={t.id} t={t} />)}
          </div>
          <a style={{
            display: 'block',
            textAlign: 'center',
            marginTop: 12,
            fontSize: 12.5,
            color: T.primaryDark,
            fontWeight: 600,
            cursor: 'pointer',
          }}>
            Lihat semua transaksi →
          </a>
        </Surface>
      </div>
    </div>
  );
}
