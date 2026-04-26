export type Account = {
  id: string;
  name: string;
  subtitle: string;
  balance: number;
  color: string;
  glyph: string;
};

export type Budget = {
  id: string;
  name: string;
  used: number;
  total: number;
  cat: string;
};

export type Transaction = {
  id: number;
  user: 'W' | 'H';
  cat: string;
  merch: string;
  acct: string;
  amount: number;
  date: string;
  type: 'expense' | 'income' | 'transfer';
};

export const accounts: Account[] = [
  { id: 'bca',     name: 'BCA',     subtitle: 'Tabungan · ****4821',      balance: 24_750_000, color: '#1565C0', glyph: 'BCA' },
  { id: 'mandiri', name: 'Mandiri', subtitle: 'Tabungan · ****1037',      balance: 18_320_500, color: '#003D79', glyph: 'M'   },
  { id: 'gopay',   name: 'GoPay',   subtitle: 'E-Wallet · 0812-***-4422', balance:  1_485_000, color: '#00A6E2', glyph: 'G'   },
  { id: 'cash',    name: 'Tunai',   subtitle: 'Dompet bersama',           balance:    620_000, color: '#5C815B', glyph: 'Rp'  },
];

export const budgets: Budget[] = [
  { id: 'food',      name: 'Makanan',      used: 2_180_000, total: 3_000_000, cat: 'food'      },
  { id: 'transport', name: 'Transportasi', used: 1_465_000, total: 1_500_000, cat: 'transport' },
  { id: 'shopping',  name: 'Belanja',      used: 1_870_000, total: 1_800_000, cat: 'shopping'  },
  { id: 'bills',     name: 'Tagihan',      used: 2_950_000, total: 3_500_000, cat: 'bills'     },
  { id: 'health',    name: 'Kesehatan',    used:   320_000, total: 1_000_000, cat: 'health'    },
  { id: 'fun',       name: 'Hiburan',      used:   615_000, total:   800_000, cat: 'fun'       },
  { id: 'home',      name: 'Rumah',        used: 1_245_000, total: 2_000_000, cat: 'home'      },
  { id: 'edu',       name: 'Pendidikan',   used:         0, total:   500_000, cat: 'edu'       },
];

export const transactions: Transaction[] = [
  { id: 1,  user: 'W', cat: 'food',      merch: 'Kopi Kenangan',     acct: 'gopay',   amount: -42_000,    date: 'Hari ini, 09:15', type: 'expense'  },
  { id: 2,  user: 'H', cat: 'transport', merch: 'Gojek',             acct: 'gopay',   amount: -28_500,    date: 'Hari ini, 08:40', type: 'expense'  },
  { id: 3,  user: 'H', cat: 'salary',    merch: 'Gaji Bulanan',      acct: 'bca',     amount: 12_500_000, date: 'Hari ini, 06:00', type: 'income'   },
  { id: 4,  user: 'W', cat: 'shopping',  merch: 'Tokopedia',         acct: 'bca',     amount: -385_000,   date: 'Kemarin, 21:12',  type: 'expense'  },
  { id: 5,  user: 'H', cat: 'transfer',  merch: 'Transfer ke GoPay', acct: 'mandiri', amount: -500_000,   date: 'Kemarin, 17:30',  type: 'transfer' },
  { id: 6,  user: 'W', cat: 'bills',     merch: 'PLN Listrik',       acct: 'mandiri', amount: -780_000,   date: 'Kemarin, 14:02',  type: 'expense'  },
  { id: 7,  user: 'W', cat: 'food',      merch: 'Indomaret',         acct: 'cash',    amount: -67_500,    date: '23 Apr, 19:48',   type: 'expense'  },
  { id: 8,  user: 'H', cat: 'fun',       merch: 'Netflix',           acct: 'bca',     amount: -186_000,   date: '23 Apr, 12:15',   type: 'expense'  },
  { id: 9,  user: 'W', cat: 'health',    merch: 'Apotek K-24',       acct: 'gopay',   amount: -125_000,   date: '22 Apr, 18:30',   type: 'expense'  },
  { id: 10, user: 'H', cat: 'home',      merch: 'IKEA',              acct: 'bca',     amount: -1_245_000, date: '22 Apr, 11:05',   type: 'expense'  },
];
