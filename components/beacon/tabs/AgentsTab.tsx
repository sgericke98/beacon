"use client";

import { agentCatalog, verticalLabels } from "@/lib/agents";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { competitorMatrix, rebuttals } from "@/lib/demo-data";
import { useWorkspaceStore } from "@/store/workspace-store";
import { Sparkles, BadgeCheck, Layers, Wrench } from "@/lib/lucide-react";

const whyWeWin = [
  { title: "Connected multi-agent workflows", detail: "Plan → Gather → Recommend → Draft with shared schema." },
  { title: "Unified data fabric", detail: "CRM + ERP + Finance + HR stitched via Beacon schema." },
  { title: "Governed deliverables", detail: "Approval gates, provenance, and export-ready outputs." },
];

export function AgentsTab() {
  const activeVertical = useWorkspaceStore((state) => state.activeVertical);
  const setVertical = useWorkspaceStore((state) => state.setVertical);

  const grouped = agentCatalog.reduce<Record<string, typeof agentCatalog>>((acc, agent) => {
    if (!acc[agent.vertical]) acc[agent.vertical] = [];
    acc[agent.vertical].push(agent);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border bg-background/70 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Agents across every revenue vertical</h3>
            <p className="text-sm text-muted-foreground">Core copilots are fully mocked. Coming-soon agents show breadth.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.keys(grouped).map((vertical) => (
              <Button
                key={vertical}
                variant={activeVertical === vertical ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setVertical(vertical as typeof activeVertical)}
              >
                {verticalLabels[vertical as keyof typeof verticalLabels] ?? vertical}
              </Button>
            ))}
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {grouped[activeVertical]?.map((agent) => (
            <Card key={agent.id} className="rounded-2xl border border-border bg-background/80 p-5">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">{agent.name}</h4>
                <Badge variant={agent.status === "core" ? "default" : "outline"} className="rounded-full text-[10px] uppercase tracking-wide">
                  {agent.status === "core" ? "Mocked" : "Soon"}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{agent.summary}</p>
              <div className="mt-3 flex flex-wrap gap-1 text-xs text-muted-foreground">
                {agent.features.slice(0, 3).map((feature) => (
                  <Badge key={feature} variant="secondary" className="rounded-full">
                    {feature}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-6 space-y-4 rounded-3xl border border-border bg-background/70 p-6">
          <h3 className="text-lg font-semibold">Why we win</h3>
          <ul className="space-y-3 text-sm">
            {whyWeWin.map((item) => (
              <li key={item.title} className="flex items-start gap-3 rounded-2xl border border-border/70 bg-muted/10 p-4">
                <Sparkles className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm text-primary/80">
            <p className="font-semibold">Entitlement flags</p>
            <p>Starter: 5 agents · Pro: Unlimited agents + analytics · Enterprise: Add platform + SDK.</p>
          </div>
        </Card>
        <Card className="lg:col-span-6 space-y-4 rounded-3xl border border-border bg-background/70 p-6">
          <h3 className="text-lg font-semibold">Competitive comparison</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Automation</TableHead>
                <TableHead>Governance</TableHead>
                <TableHead>Deliverables</TableHead>
                <TableHead>Extensibility</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitorMatrix.map((row) => (
                <TableRow key={row.vendor} className={row.vendor === "Beacon" ? "bg-primary/5" : undefined}>
                  <TableCell className="font-semibold">{row.vendor}</TableCell>
                  <TableCell>{row.automation}</TableCell>
                  <TableCell>{row.governance}</TableCell>
                  <TableCell>{row.deliverables}</TableCell>
                  <TableCell>{row.extensibility}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-6 space-y-4 rounded-3xl border border-border bg-background/70 p-6">
          <h3 className="text-lg font-semibold">Competitive rebuttals</h3>
          <div className="space-y-3">
            {rebuttals.map((item) => (
              <div key={item.objection} className="rounded-2xl border border-border/70 bg-muted/10 p-4 text-sm">
                <p className="font-semibold text-foreground">Objection: {item.objection}</p>
                <p className="mt-1 text-xs text-muted-foreground">Beacon: {item.beaconResponse}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="lg:col-span-6 space-y-4 rounded-3xl border border-border bg-background/70 p-6">
          <h3 className="text-lg font-semibold">Entitlements & governance</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/10 px-3 py-2">
              <BadgeCheck className="h-4 w-4 text-primary" /> Guided workflows map to pricing tiers.
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/10 px-3 py-2">
              <Layers className="h-4 w-4 text-primary" /> Approval gates baked into every agent draft.
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/10 px-3 py-2">
              <Wrench className="h-4 w-4 text-primary" /> Collaboration states: Draft → Review → Approved → Sent.
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/10 px-3 py-2">
              <BadgeCheck className="h-4 w-4 text-primary" /> Export-ready artifacts with provenance.
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
