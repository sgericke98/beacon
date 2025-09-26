"use client";

import { motion } from "framer-motion";
import { Activity, ArrowUpRight, Check, Info, Sparkles, Layers, Table, BadgeCheck } from "@/lib/lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  adoptionPlan,
  impactMetrics,
  roiBreakdown,
  buyerPains,
  caseStudies,
  partners,
  extensions,
  explainability,
} from "@/lib/demo-data";
import { useWorkspaceStore, allGoldenSteps, accountMap } from "@/store/workspace-store";

const agentRace = [
  { id: "crm", label: "CRM Copilot", progress: 0.92 },
  { id: "match", label: "Opportunity Matchmaker", progress: 0.76 },
  { id: "sow", label: "SOW Builder", progress: 0.64 },
  { id: "erp", label: "ERP Copilot", progress: 0.82 },
  { id: "deliverable", label: "Deliverable Pack", progress: 0.58 },
];

const beaconRadar = [
  { label: "CRM", status: "Strong" },
  { label: "ERP", status: "Strong" },
  { label: "Finance", status: "Glow" },
  { label: "HR", status: "Warm" },
  { label: "Market", status: "Hot" },
  { label: "Ops", status: "Strong" },
];

const offScriptActions = [
  "Run Collections Copilot in-context",
  "Launch Market Research Agent",
  "Open Renewal Prep for Globex",
  "Trigger Margin Erosion Detector",
];

export function OverviewTab() {
  const goldenStep = useWorkspaceStore((state) => state.goldenPathStep);
  const advanceGoldenPath = useWorkspaceStore((state) => state.advanceGoldenPath);
  const buyerPain = useWorkspaceStore((state) => state.buyerPain);
  const selectPain = useWorkspaceStore((state) => state.selectPain);
  const baselineMode = useWorkspaceStore((state) => state.baselineMode);
  const toggleBaseline = useWorkspaceStore((state) => state.toggleBaseline);
  const accountId = useWorkspaceStore((state) => state.accountId);
  const setTab = useWorkspaceStore((state) => state.setTab);
  const account = accountMap[accountId];
  const selectedPain = buyerPain ? buyerPains.find((pain) => pain.id === buyerPain) : null;

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-8 rounded-3xl border border-border bg-background/70 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Golden Path</p>
              <h2 className="text-2xl font-semibold">Help Globex expand to Europe</h2>
            </div>
            <Badge variant="secondary" className="rounded-full">
              Step {goldenStep + 1} of {allGoldenSteps.length}
            </Badge>
          </div>
          <div className="mt-6 space-y-4">
            {allGoldenSteps.map((step, index) => {
              const isActive = index === goldenStep;
              const isComplete = index < goldenStep;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => advanceGoldenPath(index)}
                  className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left transition ${
                    isActive
                      ? "border-primary bg-primary/10"
                      : isComplete
                        ? "border-primary/40 bg-primary/5"
                        : "border-border hover:border-primary/40 hover:bg-primary/5"
                  }`}
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-primary/10">
                      {isComplete ? <Check className="h-5 w-5 text-primary" /> : <Info className="h-5 w-5 text-primary" />}
                    </div>
                  <div>
                    <p className="text-sm font-semibold">{step.label}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                  <span className="ml-auto text-xs font-semibold text-primary">{step.output}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm text-primary/80">
            <p className="font-semibold">Buyer participation hook</p>
            <p className="mt-1 text-primary/80">&ldquo;What&apos;s your biggest pain right now?&rdquo; Choose a branch to tailor the narrative.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {buyerPains.map((pain) => (
                <Button
                  key={pain.id}
                  variant={buyerPain === pain.id ? "default" : "outline"}
                  onClick={() => selectPain(pain.id)}
                  className="rounded-full"
                  size="sm"
                >
                  {pain.label}
                </Button>
              ))}
            </div>
            {selectedPain && (
              <div className="mt-3 rounded-xl border border-primary/20 bg-primary/10 p-3 text-xs">
                <p className="font-semibold text-primary">{selectedPain.question}</p>
                <p className="text-primary/80">{selectedPain.quantifiedImpact}</p>
              </div>
            )}
          </div>
        </Card>
        <Card className="lg:col-span-4 flex flex-col justify-between rounded-3xl border border-border bg-background/60 p-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Exec summary preview</p>
            <h3 className="mt-2 text-lg font-semibold">Beacon identified $240K leakage</h3>
            <p className="text-sm text-muted-foreground">
              27% faster cycles and a blended SOW with 3 products + 2 CS specialists queued for approval.
            </p>
          </div>
          <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" /> {account.deliverables.join(", ")}
              </div>
              <div className="flex items-center gap-2">
                <Table className="h-4 w-4 text-primary" /> ROI baseline: {baselineMode === "industry" ? "Industry benchmark" : "Client-specific"}
              </div>
          </div>
          <Button className="mt-6 rounded-xl" variant="default">
            Scope a pilot
          </Button>
          <Button className="mt-2 rounded-xl" variant="outline">
            Email me this pack
          </Button>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7 rounded-3xl border border-border bg-background/70 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Business impact translation</h3>
            <Button size="sm" variant="outline" className="rounded-full" onClick={toggleBaseline}>
              Baseline: {baselineMode === "industry" ? "Industry" : "Client"}
            </Button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {impactMetrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-border bg-muted/10 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{metric.label}</p>
                <div className="mt-2 flex items-end gap-4">
                  <div>
                    <p className="text-lg font-semibold text-muted-foreground">Before</p>
                    <p className="text-2xl font-bold">{metric.before}</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-primary">After</p>
                    <p className="text-2xl font-bold text-primary">{metric.after}</p>
                  </div>
                  <span className="ml-auto rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">{metric.delta}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4">
            <p className="text-xs uppercase tracking-wide text-primary">ROI credibility</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {roiBreakdown.map((roi) => (
                <div key={roi.driver} className="rounded-xl border border-primary/20 bg-background/80 p-4 text-sm">
                  <p className="text-sm font-semibold text-primary">{roi.driver}</p>
                  <p className="text-xs text-muted-foreground">Baseline: {roi.baseline}</p>
                  <p className="text-xs text-primary/80">Improved: {roi.improved}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{roi.credibility}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card className="lg:col-span-5 rounded-3xl border border-border bg-background/70 p-6">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Time-to-value</p>
          <h3 className="text-lg font-semibold">Before / After scoreboard</h3>
          <div className="mt-4 space-y-3">
            {account.timeToValue.map((milestone) => (
              <div key={milestone.milestone} className="flex items-center gap-3 rounded-2xl border border-border/80 bg-muted/10 px-4 py-3">
                <Check className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold">{milestone.milestone}</p>
                  <p className="text-xs text-muted-foreground">{milestone.timeframe}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm text-primary/80">
            <p className="font-semibold">30-60-90 Adoption Plan</p>
            <ul className="mt-2 space-y-1 text-xs">
              {adoptionPlan.map((item) => (
                <li key={item.phase} className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>
                    <span className="font-semibold text-primary">{item.phase}:</span> {item.focus}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-6 space-y-4 rounded-3xl border border-border bg-background/70 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Agent race visualization</h3>
            <Badge variant="outline" className="rounded-full">Parallel agents</Badge>
          </div>
          <div className="space-y-4">
            {agentRace.map((agent) => (
              <div key={agent.id}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-semibold text-muted-foreground">{agent.label}</span>
                  <span className="text-muted-foreground">{Math.round(agent.progress * 100)}%</span>
                </div>
                <div className="h-3 rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
                    initial={{ width: 0 }}
                    animate={{ width: `${agent.progress * 100}%` }}
                    transition={{ duration: 1.2, delay: 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Beacon orchestrates copilots in parallel while preserving governance gates before hand-offs.
          </p>
        </Card>
        <Card className="lg:col-span-6 space-y-4 rounded-3xl border border-border bg-background/70 p-6">
          <h3 className="text-lg font-semibold">Beacon radar</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {beaconRadar.map((item) => (
              <div key={item.label} className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-center">
                <p className="text-sm font-semibold text-primary">{item.label}</p>
                <p className="text-xs text-primary/80">{item.status}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            The radar lights up risk and opportunity across CRM, ERP, Finance, HR, and Market systems using the unified schema.
          </p>
          <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm text-primary/80">
            <p className="font-semibold">Explainability</p>
            <p className="mt-2 text-primary/80">{explainability.whyThis}</p>
            <ul className="mt-3 space-y-1 text-xs">
              {explainability.provenance.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-5 space-y-3 rounded-3xl border border-border bg-background/70 p-6">
          <h3 className="text-lg font-semibold">Off-script exploration</h3>
          <p className="text-sm text-muted-foreground">Jump into any agent with Globex context pre-loaded.</p>
          <ul className="space-y-2 text-sm">
            {offScriptActions.map((action) => (
              <li key={action} className="flex items-center gap-2 rounded-xl border border-border/70 bg-muted/10 px-3 py-2">
                <ArrowUpRight className="h-4 w-4 text-primary" /> {action}
              </li>
            ))}
          </ul>
          <Button variant="outline" className="mt-2 rounded-xl" onClick={() => setTab("agents")}>
            View all agents
          </Button>
        </Card>
        <Card className="lg:col-span-7 space-y-4 rounded-3xl border border-border bg-background/70 p-6">
          <h3 className="text-lg font-semibold">Enterprise credibility</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {caseStudies.map((study) => (
              <div key={study.name} className="rounded-2xl border border-border/80 bg-muted/10 p-4 text-sm">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{study.name}</p>
                <p className="mt-1 font-semibold">{study.headline}</p>
                <p className="text-xs text-muted-foreground">{study.impact}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold">Partners:</span>
            {partners.map((partner) => (
              <Badge key={partner} variant="outline" className="rounded-full border-dashed">
                {partner}
              </Badge>
            ))}
          </div>
          <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm">
            <p className="font-semibold text-primary">Extensions catalog</p>
            <ul className="mt-2 space-y-1 text-xs text-primary/80">
              {extensions.map((extension) => (
                <li key={extension.id} className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  <span>
                    <span className="font-semibold">{extension.name}</span> – {extension.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </section>
    </div>
  );
}
