"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AgentDefinition, AgentStepId, KPIValue, RunArtifact, StepLogEntry } from "@/lib/types";
import { FiltersBar } from "@/components/FiltersBar";
import { Stepper } from "@/components/Stepper";
import { TraceConsole } from "@/components/TraceConsole";
import { KPI } from "@/components/KPI";
import { ArtifactCard } from "@/components/ArtifactCard";
import { Button } from "@/components/ui/button";
import { runAgentAndSummarize } from "@/lib/agentRunner";
import { useAgentContext } from "@/store/agent-context";

interface AgentRunViewProps {
  agent: AgentDefinition;
}

export function AgentRunView({ agent }: AgentRunViewProps) {
  const { registerRun } = useAgentContext();
  const [filters, setFilters] = useState<Record<string, string>>(() => ({
    ...(agent.defaultFilters ?? {}),
  }));
  const [activeStep, setActiveStep] = useState<AgentStepId | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<AgentStepId>>(new Set());
  const [logs, setLogs] = useState<StepLogEntry[]>([]);
  const [kpis, setKpis] = useState<KPIValue[]>([]);
  const [artifacts, setArtifacts] = useState<RunArtifact[]>([]);
  const [running, setRunning] = useState(false);
  const cancelRef = useRef<() => void>();
  const activeRef = useRef<AgentStepId | null>(null);
  const runStartRef = useRef<number>(Date.now());

  const resetState = useCallback(() => {
    setLogs([]);
    setKpis([]);
    setArtifacts([]);
    setCompletedSteps(new Set());
    setActiveStep(null);
    activeRef.current = null;
  }, []);

  const startRun = useCallback(() => {
    cancelRef.current?.();
    resetState();
    setRunning(true);
    runStartRef.current = Date.now();
    cancelRef.current = runAgentAndSummarize(
      agent,
      filters,
      (event) => {
        if (event.type === "step" && event.stepId) {
          setCompletedSteps((prev) => {
            const next = new Set(prev);
            if (activeRef.current && activeRef.current !== event.stepId) {
              next.add(activeRef.current);
            }
            return next;
          });
          activeRef.current = event.stepId;
          setActiveStep(event.stepId);
        }
        if (event.type === "log" && event.log) {
          setLogs((prev) => [...prev, event.log!]);
        }
        if (event.type === "complete" && event.result) {
          setCompletedSteps((prev) => {
            const next = new Set(prev);
            if (activeRef.current) {
              next.add(activeRef.current);
            }
            return next;
          });
          setKpis(event.result.kpis);
          setArtifacts(event.result.artifacts);
          setRunning(false);
          setActiveStep(null);
        }
      },
      (result, summary) => {
        registerRun({
          id: `${result.agentId}-${result.completedAt}`,
          agentId: result.agentId,
          startedAt: runStartRef.current,
          completedAt: result.completedAt,
          summary,
          filters: result.filters,
        });
      }
    );
  }, [agent, filters, registerRun, resetState]);

  useEffect(() => {
    startRun();
    return () => cancelRef.current?.();
  }, [startRun]);

  const handleFilterChange = useCallback(
    (id: string, value: string) => {
      setFilters((prev) => ({ ...prev, [id]: value }));
    },
    []
  );

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-8 shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-wide text-primary/80">{agent.vertical.replace(/-/g, " ")}</p>
            <h1 className="text-3xl font-semibold text-foreground">{agent.name}</h1>
            <p className="max-w-3xl text-base text-muted-foreground">{agent.headline}</p>
            <div className="flex flex-wrap gap-2 text-xs text-primary">
              {agent.features.map((feature) => (
                <span key={feature} className="rounded-full bg-primary/10 px-3 py-1">
                  {feature}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => startRun()} disabled={running}>
              {running ? "Running…" : "Re-run"}
            </Button>
          </div>
        </div>
      </section>

      <FiltersBar filters={agent.filters} values={filters} onChange={handleFilterChange} disabled={running} />

      <section className="space-y-6">
        <Stepper steps={agent.steps} activeStepId={activeStep} completedSteps={completedSteps} />
        <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
          <TraceConsole logs={logs} />
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Key metrics</h3>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {kpis.map((item) => (
                <KPI key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Artifacts</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {artifacts.map((artifact) => (
            <ArtifactCard key={artifact.id} artifact={artifact} />
          ))}
        </div>
        {artifacts.length === 0 && (
          <p className="text-sm text-muted-foreground">Agent will populate artifacts as the run progresses.</p>
        )}
      </section>
    </div>
  );
}
