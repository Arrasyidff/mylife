export type Period = 0 | 1 | 2;

export type MonthRow = {
  m: string;
  income: number;
  expense: number;
  idx: number;
};

export type StatItem = {
  label: string;
  value: string;
  sub: string;
  tone: string;
};

export type CatBreakdownItem = {
  name: string;
  value: number;
  cat: string;
  color: string;
};

export type HWDataItem = {
  cat: string;
  h: number;
  w: number;
};

export type ChartBar = {
  key: string;
  suami: number;
  istri: number;
};
