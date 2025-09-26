"use client";

import { useWorkspaceStore, allGoldenSteps } from "@/store/workspace-store";
import { workflows, deliverablePack } from "@/lib/demo-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { availableAlerts } from "@/store/workspace-store";
import { BadgeCheck, Upload, Layers, Check, Table, ArrowUpRight } from "@/lib/lucide-react";

const tasks = [
  { id: "task-1", title: "Review SOW draft", assignee: "CRO", due: "Jun 18" },
  { id: "task-2", title: "Finalize ROI slides", assignee: "Finance Ops", due: "Jun 19" },
  { id: "task-3", title: "Prep NetSuite export", assignee: "ERP Lead", due: "Jun 20" },
];

export function WorkflowsTab() {
  const goldenStep = useWorkspaceStore((state) => state.goldenPathStep);
  const setTab = useWorkspaceStore((state) => state.setTab);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border bg-background/70 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Connected workflow stepper</h3>
            <p className="text-sm text-muted-foreground">Guided demo progress with governance overlays.</p>
          </div>
          <Badge variant="outline" className="rounded-full">Step {goldenStep + 1} of {allGoldenSteps.length}</Badge>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-5">
          {allGoldenSteps.map((step, index) => (
            <Card key={step.id} className={`rounded-2xl border ${index <= goldenStep ? "border-primary bg-primary/10" : "border-border bg-background/80"} p-4`}>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Step {index + 1}</p>
              <p className="text-sm font-semibold">{step.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{step.output}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7 space-y-4 rounded-3xl border border-border bg-background/70 p-6">
          <h3 className="text-lg font-semibold">Workflow catalog</h3>
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="rounded-2xl border border-border/70 bg-muted/10 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{workflow.name}</p>
                  <Badge variant="secondary" className="rounded-full text-[10px] uppercase tracking-wide">
                    Deliverable: {workflow.deliverable}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{workflow.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Agents: {workflow.agents.join(" → ")}
                </p>
                <p className="mt-1 text-xs text-primary/80">Governance: {workflow.governance}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="lg:col-span-5 space-y-4 rounded-3xl border border-border bg-background/70 p-6">
          <h3 className="text-lg font-semibold">Alerts powering workflows</h3>
          <div className="space-y-3">
            {availableAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 rounded-2xl border border-border/70 bg-muted/10 p-4 text-sm">
                <Layers className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-semibold">{alert.title}</p>
                  <p className="text-xs text-muted-foreground">{alert.description}</p>
                  <Button variant="link" className="h-auto p-0 text-xs" onClick={() => setTab(alert.targetTab)}>
                    {alert.linkLabel} →
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm text-primary/80">
            <p className="font-semibold">Fallback outputs ready</p>
            <p>Every workflow step has deterministic outputs to avoid demo dead-ends.</p>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-6 space-y-4 rounded-3xl border border-border bg-background/70 p-6">
          <h3 className="text-lg font-semibold">Task assignment & approvals</h3>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between rounded-2xl border border-border/70 bg-muted/10 px-4 py-3 text-sm">
                <div>
                  <p className="font-semibold">{task.title}</p>
                  <p className="text-xs text-muted-foreground">Assignee: {task.assignee}</p>
                </div>
                <Badge variant="outline" className="rounded-full text-xs">Due {task.due}</Badge>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-xs text-primary/80">
            <p className="font-semibold">Approval gates</p>
            <p>Draft → Review → Approved → Sent with audit log capture at every gate.</p>
          </div>
        </Card>
        <Card className="lg:col-span-6 space-y-4 rounded-3xl border border-border bg-background/70 p-6">
          <h3 className="text-lg font-semibold">Deliverable pipeline</h3>
          <div className="space-y-3">
            {deliverablePack.map((item) => (
              <div key={item.id} className="rounded-2xl border border-border/70 bg-muted/10 p-4">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>{item.title}</span>
                  <Badge variant="secondary" className="rounded-full text-[10px] uppercase tracking-wide">{item.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Owner: {item.owner} · Due {item.due}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-full" size="sm">
              <Upload className="mr-2 h-4 w-4" /> Export to Salesforce
            </Button>
            <Button variant="outline" className="rounded-full" size="sm">
              <Table className="mr-2 h-4 w-4" /> Export to NetSuite
            </Button>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-6 rounded-3xl border border-border bg-background/70 p-6">
          <h3 className="text-lg font-semibold">Workflow readiness checklist</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/10 px-3 py-2">
              <Check className="h-4 w-4 text-primary" /> Mock OAuth for Salesforce & NetSuite complete.
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/10 px-3 py-2">
              <BadgeCheck className="h-4 w-4 text-primary" /> Sync freshness indicators: CRM 2h, ERP 1h, Market 12h.
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/10 px-3 py-2">
              <Upload className="h-4 w-4 text-primary" /> Share links available for every deliverable.
            </div>
          </div>
        </Card>
        <Card className="lg:col-span-6 rounded-3xl border border-border bg-background/70 p-6">
          <h3 className="text-lg font-semibold">Workflow analytics snapshot</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/10 px-3 py-2">
              <Progress value={(goldenStep / (allGoldenSteps.length - 1)) * 100} className="h-2 flex-1" />
              <span className="text-xs text-muted-foreground">Golden Path completion</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/10 px-3 py-2">
              <Layers className="h-4 w-4 text-primary" /> Average hand-off latency: 3m 12s
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/10 px-3 py-2">
              <ArrowUpRight className="h-4 w-4 text-primary" /> Off-script agent launches this week: 54
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
