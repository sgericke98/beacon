"use client";

import type { DedupSuggestion } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DedupListProps {
  suggestions: DedupSuggestion[];
  decisions: Record<string, "merge" | "ignore" | null | undefined>;
  onDecision: (id: string, decision: "merge" | "ignore" | null) => void;
}

export function DedupList({ suggestions, decisions, onDecision }: DedupListProps) {
  if (!suggestions.length) {
    return <p className="text-sm text-muted-foreground">No duplicates detected at this time.</p>;
  }

  return (
    <div className="space-y-4">
      {suggestions.map((suggestion) => {
        const decision = decisions[suggestion.id] ?? null;
        return (
          <div key={suggestion.id} className="rounded-lg border border-border bg-background p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {suggestion.entity.toUpperCase()} {suggestion.primaryId}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Possible duplicate with {suggestion.duplicateId} – suggested action {suggestion.suggestedAction}.
                </p>
              </div>
              <Badge variant={suggestion.similarity > 0.9 ? "success" : suggestion.similarity > 0.8 ? "warning" : "secondary"}>
                Similarity {Math.round(suggestion.similarity * 100)}%
              </Badge>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant={decision === "merge" ? "default" : "outline"}
                onClick={() => onDecision(suggestion.id, decision === "merge" ? null : "merge")}
              >
                Merge
              </Button>
              <Button
                size="sm"
                variant={decision === "ignore" ? "default" : "outline"}
                onClick={() => onDecision(suggestion.id, decision === "ignore" ? null : "ignore")}
              >
                Ignore
              </Button>
              {decision ? <Badge variant="secondary">Marked as {decision}</Badge> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
