export type AccountType = 'tabungan' | 'ewallet' | 'tunai' | 'investasi' | 'kartukredit';

export type Account = {
  id: string;
  name: string;
  subtitle: string;
  balance: number;
  color: string;
  glyph: string;
  type: AccountType;
  hidden?: boolean;
};

export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly';

export type Budget = {
  id: string;
  name: string;
  used: number;
  total: number;
  cat: string;
  period?: BudgetPeriod;
  carryOver?: boolean;
};

export type Transaction = {
  id: number;
  user: 'W' | 'H';
  cat: string;
  merch: string;
  acct: string;
  /** Destination account id when type === 'transfer' */
  toAcct?: string;
  amount: number;
  date: string; // ISO datetime: "2026-04-27T09:15:00"
  type: 'expense' | 'income' | 'transfer';
  note?: string;
};

export const accounts: Account[] = [
  { id: 'bca',     name: 'BCA',     subtitle: 'Tabungan · ****4821',      balance: 24_750_000, color: '#1565C0', glyph: 'BCA', type: 'tabungan' },
  { id: 'mandiri', name: 'Mandiri', subtitle: 'Tabungan · ****1037',      balance: 18_320_500, color: '#003D79', glyph: 'M',   type: 'tabungan' },
  { id: 'gopay',   name: 'GoPay',   subtitle: 'E-Wallet · 0812-***-4422', balance:  1_485_000, color: '#00A6E2', glyph: 'G',   type: 'ewallet'  },
  { id: 'cash',    name: 'Tunai',   subtitle: 'Dompet bersama',           balance:    620_000, color: '#5C815B', glyph: 'Rp',  type: 'tunai'    },
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
  // Today 2026-04-27
  { id: 1,  user: 'W', cat: 'food',      merch: 'Kopi Kenangan',     acct: 'gopay',   amount: -42_000,    date: '2026-04-27T09:15:00', type: 'expense'  },
  { id: 2,  user: 'H', cat: 'transport', merch: 'Gojek',             acct: 'gopay',   amount: -28_500,    date: '2026-04-27T08:40:00', type: 'expense'  },
  { id: 3,  user: 'H', cat: 'salary',    merch: 'Gaji Bulanan',      acct: 'bca',     amount: 12_500_000, date: '2026-04-27T06:00:00', type: 'income'   },
  // Yesterday 2026-04-26
  { id: 4,  user: 'W', cat: 'shopping',  merch: 'Tokopedia',         acct: 'bca',     amount: -385_000,   date: '2026-04-26T21:12:00', type: 'expense',  note: 'Baju anak'            },
  { id: 5,  user: 'H', cat: 'transfer',  merch: 'Transfer ke GoPay', acct: 'mandiri', amount: -500_000,   date: '2026-04-26T17:30:00', type: 'transfer' },
  { id: 6,  user: 'W', cat: 'bills',     merch: 'PLN Listrik',       acct: 'mandiri', amount: -780_000,   date: '2026-04-26T14:02:00', type: 'expense'  },
  { id: 7,  user: 'W', cat: 'food',      merch: 'Warung Makan',      acct: 'cash',    amount: -45_000,    date: '2026-04-26T12:30:00', type: 'expense'  },
  // 25 Apr
  { id: 8,  user: 'H', cat: 'transport', merch: 'Grab',              acct: 'gopay',   amount: -33_000,    date: '2026-04-25T08:20:00', type: 'expense'  },
  { id: 9,  user: 'W', cat: 'shopping',  merch: 'Shopee',            acct: 'bca',     amount: -210_000,   date: '2026-04-25T20:45:00', type: 'expense',  note: 'Peralatan dapur'      },
  { id: 10, user: 'W', cat: 'health',    merch: 'BPJS Kesehatan',    acct: 'bca',     amount: -150_000,   date: '2026-04-25T10:00:00', type: 'expense'  },
  // 24 Apr
  { id: 11, user: 'W', cat: 'food',      merch: 'Indomaret',         acct: 'cash',    amount: -67_500,    date: '2026-04-24T19:48:00', type: 'expense'  },
  { id: 12, user: 'H', cat: 'fun',       merch: 'Netflix',           acct: 'bca',     amount: -186_000,   date: '2026-04-24T12:15:00', type: 'expense'  },
  { id: 13, user: 'H', cat: 'salary',    merch: 'Freelance Project', acct: 'bca',     amount: 2_500_000,  date: '2026-04-24T09:00:00', type: 'income',   note: 'Landing page client'  },
  // 23 Apr
  { id: 14, user: 'W', cat: 'health',    merch: 'Apotek K-24',       acct: 'gopay',   amount: -125_000,   date: '2026-04-23T18:30:00', type: 'expense'  },
  { id: 15, user: 'H', cat: 'home',      merch: 'IKEA',              acct: 'bca',     amount: -1_245_000, date: '2026-04-23T11:05:00', type: 'expense',  note: 'Lemari baru'          },
  { id: 16, user: 'H', cat: 'transport', merch: 'Bensin',            acct: 'cash',    amount: -120_000,   date: '2026-04-23T07:30:00', type: 'expense'  },
  // 22 Apr
  { id: 17, user: 'W', cat: 'food',      merch: 'GrabFood',          acct: 'gopay',   amount: -85_000,    date: '2026-04-22T19:20:00', type: 'expense'  },
  { id: 18, user: 'H', cat: 'bills',     merch: 'Listrik Token',     acct: 'gopay',   amount: -50_000,    date: '2026-04-22T15:00:00', type: 'expense'  },
  { id: 19, user: 'H', cat: 'fun',       merch: 'Spotify',           acct: 'bca',     amount: -54_990,    date: '2026-04-22T08:00:00', type: 'expense'  },
];
