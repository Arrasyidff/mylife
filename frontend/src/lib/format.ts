function _pad(n: number): string {
  return String(n).padStart(2, '0');
}

function _localDateStr(d: Date): string {
  return `${d.getFullYear()}-${_pad(d.getMonth() + 1)}-${_pad(d.getDate())}`;
}

function _parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

const _today    = new Date();
const _todayStr = _localDateStr(_today);
const _yest     = new Date(_today.getFullYear(), _today.getMonth(), _today.getDate() - 1);
const _yesterdayStr = _localDateStr(_yest);

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const DAYS_ID      = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];

export function formatRp(amount: number): string {
  const abs = Math.abs(amount);
  const formatted = 'Rp ' + abs.toLocaleString('id-ID');
  return amount < 0 ? '-' + formatted : formatted;
}

/** "Hari ini, 09:15" / "Kemarin, 21:12" / "25 Apr, 08:20" */
export function formatTxDate(iso: string): string {
  const [dateStr = '', timeStr = ''] = iso.split('T');
  const time = timeStr.substring(0, 5);
  if (dateStr === _todayStr)     return `Hari ini, ${time}`;
  if (dateStr === _yesterdayStr) return `Kemarin, ${time}`;
  const d = _parseLocalDate(dateStr);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}, ${time}`;
}

/** "today" | "yesterday" | "2026-04-25" */
export function txDateGroupKey(iso: string): string {
  const dateStr = iso.split('T')[0] ?? '';
  if (dateStr === _todayStr)     return 'today';
  if (dateStr === _yesterdayStr) return 'yesterday';
  return dateStr;
}

/** "Hari ini · Minggu, 27 Apr" / "Rabu · 25 Apr" */
export function formatGroupLabel(key: string): string {
  if (key === 'today') {
    return `Hari ini · ${DAYS_ID[_today.getDay()]}, ${_today.getDate()} ${MONTHS_SHORT[_today.getMonth()]}`;
  }
  if (key === 'yesterday') {
    return `Kemarin · ${DAYS_ID[_yest.getDay()]}, ${_yest.getDate()} ${MONTHS_SHORT[_yest.getMonth()]}`;
  }
  const d = _parseLocalDate(key);
  return `${DAYS_ID[d.getDay()]} · ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

/** datetime-local value → ISO string "2026-04-27T09:15:00" */
export function fromDatetimeLocal(val: string): string {
  return val.length === 16 ? val + ':00' : val;
}

/** ISO string → datetime-local value "2026-04-27T09:15" */
export function toDatetimeLocal(iso: string): string {
  return iso.substring(0, 16);
}

/** Current datetime as datetime-local value, in the configured timezone */
export function nowDatetimeLocal(): string {
  const tz = process.env.NEXT_PUBLIC_TIMEZONE ?? 'Asia/Jakarta';
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(now);
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? '00';
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
}
