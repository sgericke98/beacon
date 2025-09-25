import type { KPIValue } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface KPIProps {
  item: KPIValue;
}

export function KPI({ item }: KPIProps) {
  const TrendIcon = item.trend === "down" ? ArrowDownRight : ArrowUpRight;
  return (
    <Card className="rounded-2xl border-border/80 bg-background/70 shadow-sm">
      <CardContent className="space-y-2 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
        <div className="text-2xl font-semibold text-foreground">{item.value}</div>
        {item.delta && (
          <div className={`inline-flex items-center gap-1 text-xs font-medium ${item.trend === "down" ? "text-red-500" : "text-emerald-500"}`}>
            <TrendIcon className="h-3 w-3" />
            {item.delta}
          </div>
        )}
        {item.caption && <p className="text-xs text-muted-foreground">{item.caption}</p>}
      </CardContent>
    </Card>
  );
}
