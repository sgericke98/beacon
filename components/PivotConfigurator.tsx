"use client";

import { useMemo, useState } from "react";
import type { PivotConfig, Row } from "@/types";
import { buildPivot } from "@/lib/pivot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const AGGREGATIONS: PivotConfig["values"][number]["agg"][] = ["sum", "avg", "count", "min", "max"];

interface PivotConfiguratorProps {
  fields: string[];
  numericFields: string[];
  data: Row[];
  initialConfig?: PivotConfig;
  onConfigChange?: (config: PivotConfig) => void;
}

export function PivotConfigurator({ fields, numericFields, data, initialConfig, onConfigChange }: PivotConfiguratorProps) {
  const [config, setConfig] = useState<PivotConfig>(
    initialConfig ?? {
      rows: [fields[0] ?? ""].filter(Boolean),
      cols: [fields[1] ?? ""].filter(Boolean),
      values: numericFields.length ? [{ field: numericFields[0], agg: "sum" }] : [],
    }
  );

  const updateConfig = (next: PivotConfig) => {
    setConfig(next);
    onConfigChange?.(next);
  };

  const pivotTable = useMemo(() => buildPivot(config, data), [config, data]);

  const availableFields = fields.filter(
    (field) => !config.rows.includes(field) && !config.cols.includes(field) && !config.values.some((value) => value.field === field)
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Configure Pivot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Section title="Rows">
            <FieldZone
              fields={config.rows}
              onRemove={(field) => updateConfig({ ...config, rows: config.rows.filter((item) => item !== field) })}
            />
          </Section>
          <Section title="Columns">
            <FieldZone
              fields={config.cols}
              onRemove={(field) => updateConfig({ ...config, cols: config.cols.filter((item) => item !== field) })}
            />
          </Section>
          <Section title="Values">
            <div className="flex flex-col gap-2">
              {config.values.map((value, index) => (
                <div key={`${value.field}-${index}`} className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex-1 justify-between">
                    {value.field}
                  </Badge>
                  <Select
                    value={value.agg}
                    onChange={(event) => {
                      const nextValues = [...config.values];
                      nextValues[index] = { ...value, agg: event.target.value as PivotConfig["values"][number]["agg"] };
                      updateConfig({ ...config, values: nextValues });
                    }}
                  >
                    {AGGREGATIONS.map((agg) => (
                      <option key={agg} value={agg}>
                        {agg.toUpperCase()}
                      </option>
                    ))}
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateConfig({ ...config, values: config.values.filter((_, idx) => idx !== index) })}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </Section>
          <Section title="Available Fields">
            <div className="flex flex-wrap gap-2">
              {availableFields.map((field) => (
                <Badge key={field} variant="outline" className="cursor-pointer px-3 py-1" onClick={() => addField(field)}>
                  {field}
                </Badge>
              ))}
            </div>
          </Section>
        </CardContent>
      </Card>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Pivot Preview</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {pivotTable.rows.length ? (
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  {pivotTable.header.map((header, index) => (
                    <TableHead key={`${header}-${index}`}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {pivotTable.rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>{typeof cell === "number" ? cell.toLocaleString() : cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">Select fields to see pivot output.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );

  function addField(field: string) {
    if (!config.rows.length) {
      updateConfig({ ...config, rows: [...config.rows, field] });
    } else if (!config.cols.length) {
      updateConfig({ ...config, cols: [...config.cols, field] });
    } else if (numericFields.includes(field)) {
      updateConfig({ ...config, values: [...config.values, { field, agg: "sum" }] });
    } else {
      updateConfig({ ...config, rows: [...config.rows, field] });
    }
  }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
      <div className="mt-2 rounded-md border border-dashed border-border p-3 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

function FieldZone({ fields, onRemove }: { fields: string[]; onRemove: (field: string) => void }) {
  if (!fields.length) {
    return <p className="text-xs">Drop fields here</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {fields.map((field) => (
        <Badge key={field} variant="outline" className="flex items-center gap-2 px-3 py-1">
          {field}
          <button type="button" onClick={() => onRemove(field)} className="text-xs text-muted-foreground">
            ×
          </button>
        </Badge>
      ))}
    </div>
  );
}
