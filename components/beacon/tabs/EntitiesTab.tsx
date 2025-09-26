"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { artifacts, workspaceInsights } from "@/lib/demo-data";
import { agentCatalog } from "@/lib/agents";
import { useWorkspaceStore, accountMap } from "@/store/workspace-store";
import { ArrowUpRight, Table as TableIcon, Info, Wrench, Upload, BadgeCheck } from "@/lib/lucide-react";

const projects = [
  { id: "PRJ-101", name: "EU Launch Readiness", owner: "CS Ops", status: "Active", due: "Aug 15" },
  { id: "PRJ-102", name: "Finance Guardrails", owner: "Finance Ops", status: "Active", due: "Jul 30" },
  { id: "PRJ-103", name: "ERP Harmonization", owner: "IT", status: "Planning", due: "Sep 12" },
];

const comments = [
  {
    id: "c1",
    author: "Amelia (CRO)",
    timestamp: "2h ago",
    text: "Locking in the SOW scope. Need CRO approval by EOD.",
  },
  {
    id: "c2",
    author: "Nikhil (Finance Ops)",
    timestamp: "3h ago",
    text: "Collections Copilot outreach ready – waiting on compliance check.",
  },
];

const governanceStages = [
  { stage: "Draft", owner: "Deal Desk", status: "Complete" },
  { stage: "Review", owner: "CRO", status: "Pending" },
  { stage: "Approved", owner: "Finance", status: "Queued" },
  { stage: "Sent", owner: "Exec", status: "Scheduled" },
];

export function EntitiesTab() {
  const accountId = useWorkspaceStore((state) => state.accountId);
  const account = accountMap[accountId];
  const relevantAgents = agentCatalog.filter((agent) => agent.status === "core").slice(0, 6);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 rounded-3xl border border-border bg-background/70 p-6 lg:grid-cols-3">
        <Card className="rounded-2xl border border-border p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Accounts</p>
          <h3 className="text-2xl font-semibold">{workspaceInsights.accounts.length}</h3>
          <p className="text-sm text-muted-foreground">Unified hierarchy from CRM + ERP with PII redacted by default.</p>
        </Card>
        <Card className="rounded-2xl border border-border p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Opportunities</p>
          <h3 className="text-2xl font-semibold">{workspaceInsights.opportunities.length}</h3>
          <p className="text-sm text-muted-foreground">Stage duration telemetry identifies legal bottlenecks instantly.</p>
        </Card>
        <Card className="rounded-2xl border border-border p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Projects</p>
          <h3 className="text-2xl font-semibold">{projects.length}</h3>
          <p className="text-sm text-muted-foreground">Cross-functional initiatives tracked with deliverable governance.</p>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7 rounded-3xl border border-border bg-background/70 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Accounts directory</h3>
            <Badge variant="outline" className="rounded-full">Workspace context applied</Badge>
          </div>
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Opportunities</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workspaceInsights.accounts.slice(0, 6).map((item) => (
                <TableRow key={item.id} className={item.id.includes("A-004") ? "bg-primary/5" : undefined}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell className="font-semibold">{item.name}</TableCell>
                  <TableCell>{item.region}</TableCell>
                  <TableCell>{workspaceInsights.opportunities.filter((opp) => opp.region === item.region).length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        <Card className="lg:col-span-5 rounded-3xl border border-border bg-background/70 p-6">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Cross-system snapshot</p>
          <h3 className="text-lg font-semibold">{account.name}</h3>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-xl border border-border/80 bg-muted/10 p-3">
              <p className="font-semibold">CRM</p>
              <p className="text-xs text-muted-foreground">Pipeline health score: 88</p>
            </div>
            <div className="rounded-xl border border-border/80 bg-muted/10 p-3">
              <p className="font-semibold">ERP</p>
              <p className="text-xs text-muted-foreground">Invoice sync: Last 2h</p>
            </div>
            <div className="rounded-xl border border-border/80 bg-muted/10 p-3">
              <p className="font-semibold">Finance</p>
              <p className="text-xs text-muted-foreground">Cash leakage guardrail active</p>
            </div>
            <div className="rounded-xl border border-border/80 bg-muted/10 p-3">
              <p className="font-semibold">HR</p>
              <p className="text-xs text-muted-foreground">Enablement readiness: 92%</p>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-xs text-primary/80">
            <p className="font-semibold">Workspace constraints applied</p>
            <p>Budget cap {account.constraints.budget}, timeline {account.constraints.timeline}.</p>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7 space-y-4 rounded-3xl border border-border bg-background/70 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Timeline of runs & artifacts</h3>
            <Badge variant="secondary" className="rounded-full">Explainable</Badge>
          </div>
          <div className="space-y-3">
            {artifacts.map((artifact) => (
              <div key={artifact.id} className="flex flex-col rounded-2xl border border-border/70 bg-muted/10 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{artifact.title}</p>
                    <p className="text-xs text-muted-foreground">Linked to: {artifact.linkedEntities.join(", ")}</p>
                  </div>
                  <Badge variant="outline" className="rounded-full text-[10px] uppercase tracking-wide">
                    {artifact.lastRun}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{artifact.summary}</p>
              </div>
            ))}
          </div>
        </Card>
        <div className="lg:col-span-5 space-y-6">
          <Card className="rounded-3xl border border-border bg-background/70 p-6">
            <h3 className="text-lg font-semibold">Available agents for this entity</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {relevantAgents.map((agent) => (
                <div key={agent.id} className="rounded-2xl border border-border/80 bg-muted/10 p-3 text-sm">
                  <p className="font-semibold">{agent.name}</p>
                  <p className="text-xs text-muted-foreground">{agent.summary}</p>
                </div>
              ))}
            </div>
              <Badge variant="outline" className="mt-3 inline-flex items-center gap-1 rounded-full">
                <ArrowUpRight className="h-3 w-3" /> Off-script ready
              </Badge>
          </Card>
          <Card className="rounded-3xl border border-border bg-background/70 p-6">
            <h3 className="text-lg font-semibold">Pinned deliverables</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {artifacts.slice(0, 2).map((artifact) => (
                <li key={artifact.id} className="flex items-center gap-2 rounded-xl border border-border/80 bg-muted/10 px-3 py-2">
                  <TableIcon className="h-4 w-4 text-primary" /> {artifact.title}
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2 text-xs text-muted-foreground">
              {governanceStages.map((stage) => (
                <div key={stage.stage} className="flex items-center justify-between">
                  <span>
                    {stage.stage} → <span className="font-semibold text-foreground">{stage.owner}</span>
                  </span>
                  <Badge variant="secondary" className="rounded-full text-[10px] uppercase tracking-wide">
                    {stage.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7 space-y-4 rounded-3xl border border-border bg-background/70 p-6">
          <h3 className="text-lg font-semibold">Comments & annotations</h3>
          <div className="space-y-3">
            {comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/10 p-4">
                  <Info className="mt-1 h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-semibold">{comment.author}</p>
                  <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="lg:col-span-5 space-y-4 rounded-3xl border border-border bg-background/70 p-6">
          <h3 className="text-lg font-semibold">Collaboration shortcuts</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-muted/10 px-3 py-2">
              <Wrench className="h-4 w-4 text-primary" /> Assign task to Finance Ops
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-muted/10 px-3 py-2">
              <Upload className="h-4 w-4 text-primary" /> Share Globex EU deliverable pack
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-muted/10 px-3 py-2">
              <BadgeCheck className="h-4 w-4 text-primary" /> Export audit log (CSV)
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
