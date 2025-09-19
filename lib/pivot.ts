import type { PivotConfig, Row } from "@/types";

type Stat = {
  sum: number;
  count: number;
  min: number;
  max: number;
};

const defaultStat = (): Stat => ({ sum: 0, count: 0, min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY });

function updateStat(stat: Stat, value: number) {
  stat.sum += value;
  stat.count += 1;
  stat.min = Math.min(stat.min, value);
  stat.max = Math.max(stat.max, value);
}

function formatKey(values: (string | number | boolean | null)[]): string {
  if (!values.length) return "Total";
  return values
    .map((value) => {
      if (value === null || value === undefined || value === "") {
        return "(blank)";
      }
      return String(value);
    })
    .join(" • ");
}

export interface PivotTable {
  header: string[];
  rows: (string | number)[][];
}

export function buildPivot(config: PivotConfig, rows: Row[]): PivotTable {
  const rowFields = config.rows.length ? config.rows : ["All"];

  const rowBuckets = new Map<string, Map<string, Stat[]>>();
  const columnKeys = new Set<string>();

  for (const row of rows) {
    const rowKeyValues = config.rows.length
      ? config.rows.map((field) => row[field])
      : ["All"];
    const rowKey = formatKey(rowKeyValues);

    const colKeyValues = config.cols.length
      ? config.cols.map((field) => row[field])
      : ["Total"];
    const colKey = formatKey(colKeyValues);
    columnKeys.add(colKey);

    if (!rowBuckets.has(rowKey)) {
      rowBuckets.set(rowKey, new Map());
    }
    const columnBucket = rowBuckets.get(rowKey)!;

    if (!columnBucket.has(colKey)) {
      columnBucket.set(
        colKey,
        config.values.map(() => defaultStat())
      );
    }

    const statsArray = columnBucket.get(colKey)!;

    config.values.forEach((valueConfig, idx) => {
      const raw = row[valueConfig.field];
      if (valueConfig.agg === "count") {
        updateStat(statsArray[idx], 1);
        return;
      }
      if (typeof raw === "number") {
        updateStat(statsArray[idx], raw);
        return;
      }
      if (typeof raw === "string") {
        const numeric = Number(raw);
        if (!Number.isNaN(numeric)) {
          updateStat(statsArray[idx], numeric);
        }
      }
    });
  }

  const sortedColumns = Array.from(columnKeys).sort();
  const valueHeaders = config.values.map((value) => `${value.field} (${value.agg})`);
  const header = [...rowFields, ...sortedColumns.flatMap((col) => valueHeaders.map((vh) => `${col} • ${vh}`))];

  const tableRows: (string | number)[][] = [];
  const sortedRows = Array.from(rowBuckets.keys()).sort();

  for (const rowKey of sortedRows) {
    const rowValues = rowKey === "All" ? ["All"] : rowKey.split(" • ");
    const columnBucket = rowBuckets.get(rowKey)!;
    const cells: (string | number)[] = [...rowValues];
    for (const colKey of sortedColumns) {
      const statsArray = columnBucket.get(colKey) ?? config.values.map(() => defaultStat());
      config.values.forEach((valueConfig, idx) => {
        const stat = statsArray[idx];
        let cellValue: number = 0;
        switch (valueConfig.agg) {
          case "sum":
            cellValue = stat.sum;
            break;
          case "avg":
            cellValue = stat.count ? stat.sum / stat.count : 0;
            break;
          case "count":
            cellValue = stat.count;
            break;
          case "min":
            cellValue = stat.count ? stat.min : 0;
            break;
          case "max":
            cellValue = stat.count ? stat.max : 0;
            break;
        }
        cells.push(Number.isFinite(cellValue) ? Math.round(cellValue * 100) / 100 : 0);
      });
    }
    tableRows.push(cells);
  }

  return { header, rows: tableRows };
}
