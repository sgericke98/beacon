"use client";

import { useEffect, useMemo, useState } from "react";
import type { LeakageFinding } from "@/types";
import { PageHeader } from "@/components/PageHeader";
import { UploadDropzone } from "@/components/UploadDropzone";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fmtCurrency } from "@/lib/format";

interface FindingWithSnippet extends LeakageFinding {
  snippet: string;
}

export default function RevenueLeakagePage() {
  const [findings, setFindings] = useState<FindingWithSnippet[]>([]);
  const [selectedFinding, setSelectedFinding] = useState<FindingWithSnippet | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  const columns = useMemo<Column<FindingWithSnippet>[]>(
    () => [
      { key: "contractId", header: "Contract" },
      { key: "category", header: "Category" },
      {
        key: "severity",
        header: "Severity",
        render: (value) => (
          <Badge variant={value === "high" ? "destructive" : value === "medium" ? "warning" : "secondary"}>{value}</Badge>
        ),
      },
      {
        key: "impactUSD",
        header: "Impact",
        render: (value) => fmtCurrency(Number(value)),
      },
      { key: "description", header: "Description" },
    ],
    []
  );

  const filteredFindings = useMemo(() => {
    return findings.filter((finding) => {
      const categoryMatch = categoryFilter === "all" || finding.category === categoryFilter;
      const severityMatch = severityFilter === "all" || finding.severity === severityFilter;
      return categoryMatch && severityMatch;
    });
  }, [findings, categoryFilter, severityFilter]);

  const totalImpact = filteredFindings.reduce((sum, finding) => sum + finding.impactUSD, 0);

  const loadFindings = async () => {
    const response = await fetch("/api/mock/leakage/findings");
    const payload = await response.json();
    setFindings(payload.findings as FindingWithSnippet[]);
    setSelectedFinding((payload.findings as FindingWithSnippet[])[0] ?? null);
  };

  useEffect(() => {
    loadFindings();
  }, []);

  useEffect(() => {
    if (selectedFinding && !filteredFindings.find((finding) => finding.id === selectedFinding.id)) {
      setSelectedFinding(filteredFindings[0] ?? null);
    }
  }, [filteredFindings, selectedFinding]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Revenue Leakage"
        description="Upload contracts or use the sample data to inspect leakage categories and remediation options."
        action={
          <Button variant="outline" onClick={loadFindings}>
            Load sample data
          </Button>
        }
      />
      <UploadDropzone onFiles={(/* files */) => loadFindings()} />
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Leakage findings</CardTitle>
            <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
              <label>
                Category:
                <select
                  className="ml-2 rounded-md border border-border bg-background px-2 py-1 text-sm"
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                >
                  <option value="all">All</option>
                  {Array.from(new Set(findings.map((finding) => finding.category))).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Severity:
                <select
                  className="ml-2 rounded-md border border-border bg-background px-2 py-1 text-sm"
                  value={severityFilter}
                  onChange={(event) => setSeverityFilter(event.target.value)}
                >
                  <option value="all">All</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
              <span className="ml-auto font-medium text-foreground">Estimated total impact: {fmtCurrency(totalImpact)}</span>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={filteredFindings}
              searchable
              pageSize={10}
              onRowClick={(row) => setSelectedFinding(row)}
              getRowId={(row) => row.id}
              selectedRowId={selectedFinding?.id}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Clause snippet</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedFinding ? (
              <article className="space-y-3 text-sm">
                <div>
                  <div className="font-semibold text-foreground">{selectedFinding.category}</div>
                  <div className="text-muted-foreground">{selectedFinding.description}</div>
                </div>
                <div className="rounded-md border border-border bg-muted/40 p-3 text-xs leading-relaxed text-foreground">
                  {selectedFinding.snippet}
                </div>
                <div className="text-xs text-muted-foreground">
                  Contract {selectedFinding.contractId} · Impact {fmtCurrency(selectedFinding.impactUSD)}
                </div>
              </article>
            ) : (
              <p className="text-sm text-muted-foreground">Select a finding to view extracted clause context.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
