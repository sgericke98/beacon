"use client";

import { useEffect, useMemo, useState } from "react";
import type { DedupSuggestion } from "@/types";
import { PageHeader } from "@/components/PageHeader";
import { DedupList } from "@/components/DedupList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUIStore } from "@/store/ui";

export default function DataCleaningHierarchyPage() {
  const [suggestions, setSuggestions] = useState<DedupSuggestion[]>([]);
  const [entityFilter, setEntityFilter] = useState<DedupSuggestion["entity"] | "all">("account");
  const [threshold, setThreshold] = useState(0.8);
  const { dedupDecisions, setDedupDecision, resetDedup } = useUIStore();

  useEffect(() => {
    const fetchSuggestions = async () => {
      const response = await fetch("/api/mock/cleaning/suggestions");
      const payload = await response.json();
      setSuggestions(payload.suggestions as DedupSuggestion[]);
      resetDedup();
    };
    fetchSuggestions();
  }, [resetDedup]);

  const filtered = useMemo(() => {
    return suggestions.filter((suggestion) => {
      const entityMatch = entityFilter === "all" || suggestion.entity === entityFilter;
      const thresholdMatch = suggestion.similarity >= threshold;
      return entityMatch && thresholdMatch;
    });
  }, [suggestions, entityFilter, threshold]);

  const mergedPreview = useMemo(() => {
    const groups: Record<string, string[]> = {};
    Object.entries(dedupDecisions).forEach(([id, decision]) => {
      if (decision === "merge") {
        const suggestion = suggestions.find((item) => item.id === id);
        if (suggestion) {
          if (!groups[suggestion.primaryId]) groups[suggestion.primaryId] = [];
          groups[suggestion.primaryId].push(suggestion.duplicateId);
        }
      }
    });
    return groups;
  }, [dedupDecisions, suggestions]);

  const applyAllMerges = () => {
    filtered.forEach((suggestion) => setDedupDecision(suggestion.id, "merge"));
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Data Cleaning – Hierarchy"
        description="Simulated embeddings highlight duplicates across entities. Confirm merges to strengthen hierarchy quality."
      />
      <section className="rounded-lg border border-border bg-background p-4">
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <label className="flex items-center gap-2">
            Entity
            <select
              className="rounded-md border border-border bg-background px-2 py-1"
              value={entityFilter}
              onChange={(event) => setEntityFilter(event.target.value as DedupSuggestion["entity"] | "all")}
            >
              <option value="account">Accounts</option>
              <option value="contact">Contacts</option>
              <option value="product">Products</option>
              <option value="all">All</option>
            </select>
          </label>
          <label className="flex items-center gap-2">
            Similarity ≥
            <input
              type="range"
              min={0.7}
              max={0.99}
              step={0.01}
              value={threshold}
              onChange={(event) => setThreshold(Number(event.target.value))}
            />
            <span className="font-medium text-foreground">{Math.round(threshold * 100)}%</span>
          </label>
          <Button type="button" variant="outline" size="sm" onClick={applyAllMerges}>
            Apply all merges
          </Button>
        </div>
      </section>
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Potential duplicates</CardTitle>
          </CardHeader>
          <CardContent>
            <DedupList suggestions={filtered} decisions={dedupDecisions} onDecision={setDedupDecision} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Hierarchy preview</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(mergedPreview).length ? (
              <ul className="space-y-3 text-sm">
                {Object.entries(mergedPreview).map(([primary, children]) => (
                  <li key={primary}>
                    <div className="font-semibold text-foreground">{primary}</div>
                    <ul className="ml-4 mt-1 space-y-1 border-l border-dashed border-border pl-3 text-muted-foreground">
                      {children.map((child) => (
                        <li key={child}>{child}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No merges selected yet.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
