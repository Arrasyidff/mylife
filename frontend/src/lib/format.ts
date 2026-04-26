export function formatRp(amount: number): string {
  const abs = Math.abs(amount);
  const formatted = 'Rp ' + abs.toLocaleString('id-ID');
  return amount < 0 ? '-' + formatted : formatted;
}
