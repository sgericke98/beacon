import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { generateSparkline } from "@/lib/mock";
import { fmtCurrency, fmtDays, fmtPct } from "@/lib/format";

interface KPIProps {
  label: string;
  value: number;
  deltaPct?: number;
  format?: "currency" | "days" | "percent" | "number";
  seed?: number;
}

export function KPI({ label, value, deltaPct, format = "number", seed = 1 }: KPIProps) {
  const sparkline = generateSparkline(16, seed);

  const formattedValue = (() => {
    switch (format) {
      case "currency":
        return fmtCurrency(value);
      case "days":
        return fmtDays(value);
      case "percent":
        return fmtPct(value);
      default:
        return value.toLocaleString();
    }
  })();

  const deltaColor = deltaPct !== undefined && deltaPct >= 0 ? "text-green-600" : "text-red-600";
  const DeltaIcon = deltaPct !== undefined && deltaPct >= 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="flex flex-col rounded-lg border border-border bg-background p-4 shadow-sm">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="mt-2 flex items-end justify-between">
        <div>
          <div className="text-2xl font-semibold text-foreground">{formattedValue}</div>
          {deltaPct !== undefined ? (
            <div className={`mt-1 flex items-center gap-1 text-sm ${deltaColor}`}>
              <DeltaIcon className="h-4 w-4" />
              {fmtPct(Math.abs(deltaPct))}
            </div>
          ) : null}
        </div>
        <Sparkline values={sparkline} />
      </div>
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const normalized = values.length === 1 ? 0.5 : (value - min) / (max - min || 1);
      const y = 100 - normalized * 100;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" className="h-12 w-24">
      <polyline fill="none" stroke="currentColor" strokeWidth={3} points={points} className="text-foreground/70" />
    </svg>
  );
}
