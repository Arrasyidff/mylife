import { T } from '@/lib/tokens';

export const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
export const MONTHS_FULL  = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

export const TX_TYPES = [
  { id: 'expense',  label: 'Pengeluaran', color: T.danger  },
  { id: 'income',   label: 'Pemasukan',   color: T.primary },
  { id: 'transfer', label: 'Transfer',    color: '#1846A8' },
] as const;

export const EXPENSE_CATS = [
  { id: 'food',      name: 'Makanan'    },
  { id: 'transport', name: 'Transport'  },
  { id: 'shopping',  name: 'Belanja'    },
  { id: 'bills',     name: 'Tagihan'    },
  { id: 'health',    name: 'Kesehatan'  },
  { id: 'home',      name: 'Rumah'      },
  { id: 'fun',       name: 'Hiburan'    },
  { id: 'edu',       name: 'Pendidikan' },
];

export const INCOME_CATS = [
  { id: 'salary', name: 'Gaji'    },
  { id: 'fun',    name: 'Bonus'   },
  { id: 'home',   name: 'Sewa'    },
  { id: 'edu',    name: 'Lainnya' },
];

export const ADMIN_FEE_DEFAULT = 2_500;
