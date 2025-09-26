"use client";

import { useMemo } from "react";
import type { AgentStep, AgentStepId, StepLogEntry } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Sparkles, Info } from "@/lib/lucide-react";

interface AutomationLogPanelProps {
  logs: StepLogEntry[];
  steps: AgentStep[];
  activeStepId: AgentStepId | null;
  completedSteps: Set<AgentStepId>;
}

export function AutomationLogPanel({ logs, steps, activeStepId, completedSteps }: AutomationLogPanelProps) {
  const stepMap = useMemo(() => new Map(steps.map((step) => [step.id, step])), [steps]);
  const lastIndexByStep = useMemo(() => {
    const map = new Map<AgentStepId, number>();
    logs.forEach((log, index) => {
      map.set(log.stepId, index);
    });
    return map;
  }, [logs]);

  const pendingSteps = steps.filter((step) => !lastIndexByStep.has(step.id));

  return (
    <div className="rounded-2xl border border-border bg-background/60 p-4 shadow-inner">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Automation log</h3>
        <span className="text-xs text-muted-foreground">{logs.length} updates</span>
      </div>
      {logs.length === 0 && (
        <div className="mt-3 rounded-xl border border-dashed border-border/60 bg-muted/10 p-3 text-xs text-muted-foreground">
          Agents narrate every step in plain business language. Kick off a run to populate the timeline below.
        </div>
      )}
      <ScrollArea className="mt-4 h-72 pr-2">
        <ol className="space-y-3">
          {logs.map((log, index) => {
            const step = stepMap.get(log.stepId);
            const isLastForStep = lastIndexByStep.get(log.stepId) === index;
            const isComplete = isLastForStep && completedSteps.has(log.stepId);
            const isActive = isLastForStep && activeStepId === log.stepId && !completedSteps.has(log.stepId);
            const iconClass = isComplete
              ? "border-primary/40 bg-primary/10 text-primary"
              : isActive
                ? "border-amber-400/60 bg-amber-500/10 text-amber-500"
                : "border-border/60 bg-muted/20 text-muted-foreground";
            const Icon = isComplete ? Check : isActive ? Sparkles : Info;
            return (
              <li key={log.id} className="flex gap-3 rounded-xl border border-border/40 bg-background/80 p-3">
                <span className={`mt-1 flex h-7 w-7 items-center justify-center rounded-full border text-xs ${iconClass}`}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="space-y-1">
                  {step && (
                    <Badge variant="outline" className="rounded-full text-[10px] uppercase tracking-wide">
                      {step.label}
                    </Badge>
                  )}
                  <p className="text-sm text-muted-foreground">{log.message}</p>
                </div>
              </li>
            );
          })}
          {pendingSteps.map((step) => (
            <li key={step.id} className="flex gap-3 rounded-xl border border-dashed border-border/60 bg-muted/10 p-3">
              <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full border border-border/50 bg-muted/20 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5" />
              </span>
              <div className="space-y-1">
                <Badge variant="outline" className="rounded-full text-[10px] uppercase tracking-wide text-muted-foreground">
                  {step.label}
                </Badge>
                <p className="text-sm text-muted-foreground/80">Awaiting automation signal…</p>
              </div>
            </li>
          ))}
        </ol>
      </ScrollArea>
    </div>
  );
}
