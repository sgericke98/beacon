import type { FilterDefinition } from "@/lib/types";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FiltersBarProps {
  filters?: FilterDefinition[];
  values: Record<string, string>;
  onChange: (id: string, value: string) => void;
  disabled?: boolean;
}

export function FiltersBar({ filters = [], values, onChange, disabled }: FiltersBarProps) {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-background/60 p-4">
      {filters.map((filter) => {
        if (filter.type === "select") {
          return (
            <div key={filter.id} className="space-y-1 text-sm">
              <label className="text-xs uppercase tracking-wide text-muted-foreground">{filter.label}</label>
              <Select
                value={values[filter.id] ?? filter.options[0]?.value}
                onChange={(event) => onChange(filter.id, event.target.value)}
                disabled={disabled}
                className="min-w-[180px]"
              >
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          );
        }
        return (
          <div key={filter.id} className="space-y-1 text-sm">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{filter.label}</p>
            <div className="flex flex-wrap gap-2">
              {filter.options.map((option) => {
                const isActive = (values[filter.id] ?? filter.options[0]?.value) === option.value;
                return (
                  <Button
                    key={option.value}
                    size="sm"
                    variant={isActive ? "default" : "outline"}
                    onClick={() => onChange(filter.id, option.value)}
                    disabled={disabled}
                    className="rounded-full"
                  >
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
