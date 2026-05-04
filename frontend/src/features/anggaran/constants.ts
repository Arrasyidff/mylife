export const PERIOD_LABEL: Record<string, string> = {
  weekly:  'Mingguan',
  monthly: 'Bulanan',
  yearly:  'Tahunan',
};

export const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret',    'April',
  'Mei',     'Juni',     'Juli',      'Agustus',
  'September','Oktober', 'November', 'Desember',
];

export const BASE  = new Date(2026, 3);
export const TODAY = new Date(2026, 3, 27);

export const CATS = [
  { id: 'food',      name: 'Makanan'    },
  { id: 'transport', name: 'Transport'  },
  { id: 'shopping',  name: 'Belanja'    },
  { id: 'bills',     name: 'Tagihan'    },
  { id: 'health',    name: 'Kesehatan'  },
  { id: 'home',      name: 'Rumah'      },
  { id: 'fun',       name: 'Hiburan'    },
  { id: 'edu',       name: 'Pendidikan' },
];

export const PERIODS = [
  { id: 'weekly',  label: 'Mingguan', hint: 'Reset tiap Senin'     },
  { id: 'monthly', label: 'Bulanan',  hint: 'Reset tiap tanggal 1' },
  { id: 'yearly',  label: 'Tahunan',  hint: 'Reset tiap Januari'   },
];

export const AMOUNT_PRESETS = [500_000, 1_000_000, 1_500_000, 2_000_000, 3_000_000, 5_000_000];

export const AMOUNT_WORDS: Record<number, string> = {
  500_000:   'lima ratus ribu rupiah',
  1_000_000: 'satu juta rupiah',
  1_500_000: 'satu juta lima ratus ribu rupiah',
  2_000_000: 'dua juta rupiah',
  3_000_000: 'tiga juta rupiah',
  5_000_000: 'lima juta rupiah',
};

export const MONTHLY_INCOME = 14_750_000;
