export function fmtCurrency(usd: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(usd);
}

export function fmtDays(days: number): string {
  return `${Math.round(days)} days`;
}

export function fmtPct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}
