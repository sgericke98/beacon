"use client";
import datasets from "@/data/datasets.json" assert { type: "json" };
import opportunities from "@/data/opportunities.json" assert { type: "json" };
import quotes from "@/data/quotes.json" assert { type: "json" };
import invoices from "@/data/invoices.json" assert { type: "json" };
import payments from "@/data/payments.json" assert { type: "json" };
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, type Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useUIStore } from "@/store/ui";
import type { Row } from "@/types";

const DATASETS: Record<string, Row[]> = {
  opportunities,
  quotes,
  invoices,
  payments,
};

const EXTRA_DATASETS: Record<string, Row[]> = {
  accounts: opportunities.map((row) => ({
    id: row.account,
    owner: row.owner,
    segment: row.segment,
    region: row.region,
    createdAt: row.createdAt,
  })),
  products: opportunities.map((row, index) => ({
    id: `PROD-${index + 1}`,
    name: row.name,
    amount: row.amount,
    segment: row.segment,
  })),
};

const DATASET_LABELS: Record<string, string> = Object.fromEntries(datasets.map((dataset) => [dataset.id, dataset.label]));

export default function RawDataPage() {
  const { selectedDataset, setSelectedDataset } = useUIStore();
  const mergedData: Record<string, Row[]> = { ...DATASETS, ...EXTRA_DATASETS };
  const datasetIds = Object.keys(mergedData);

  return (
    <div className="space-y-8">
      <PageHeader title="Raw Data" description="Inspect synced datasets and export CSV slices." />
      <Tabs defaultValue={selectedDataset} value={selectedDataset} onValueChange={setSelectedDataset}>
        <TabsList className="flex flex-wrap">
          {datasetIds.map((id) => (
            <TabsTrigger key={id} value={id}>
              {DATASET_LABELS[id] ?? id}
            </TabsTrigger>
          ))}
        </TabsList>
        {datasetIds.map((id) => {
          const rows = mergedData[id];
          const columns = buildColumns(rows);
          return (
            <TabsContent key={id} value={id}>
              <div className="flex items-center justify-end pb-4">
                <Button variant="outline" size="sm" onClick={() => downloadCSV(DATASET_LABELS[id] ?? id, rows, columns)}>
                  <Download className="mr-2 h-4 w-4" /> Export CSV
                </Button>
              </div>
              <DataTable columns={columns} data={rows} searchable pageSize={20} />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

function buildColumns(rows: Row[]): Column<Row>[] {
  if (!rows.length) return [];
  const keys = Object.keys(rows[0]);
  return keys.map((key) => ({ key, header: key }));
}

function downloadCSV(name: string, rows: Row[], columns: Column<Row>[]) {
  const headers = columns.map((column) => column.header);
  const csvRows = rows.map((row) =>
    columns
      .map((column) => {
        const value = row[column.key as keyof Row];
        if (value === null || value === undefined) return "";
        const stringValue = String(value).replace(/"/g, '""');
        return `"${stringValue}"`;
      })
      .join(",")
  );
  const csv = [headers.join(","), ...csvRows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${name.toLowerCase().replace(/\s+/g, "-")}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
