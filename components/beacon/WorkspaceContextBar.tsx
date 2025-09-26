"use client";

import { useMemo } from "react";
import { ArrowUpRight, BadgeCheck, Info } from "@/lib/lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useWorkspaceStore, personaMap, accountMap, painMap, allGoldenSteps } from "@/store/workspace-store";

export function WorkspaceContextBar() {
  const personaId = useWorkspaceStore((state) => state.personaId);
  const accountId = useWorkspaceStore((state) => state.accountId);
  const buyerPain = useWorkspaceStore((state) => state.buyerPain);
  const goldenStep = useWorkspaceStore((state) => state.goldenPathStep);
  const persona = personaMap[personaId];
  const account = accountMap[accountId];
  const pain = buyerPain ? painMap[buyerPain] : null;
  const step = useMemo(() => allGoldenSteps[goldenStep], [goldenStep]);

  return (
    <div className="grid gap-4 rounded-3xl border border-border bg-muted/10 p-6 shadow-sm lg:grid-cols-12 lg:items-center">
      <div className="lg:col-span-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          <Badge variant="outline" className="rounded-full">Active account</Badge>
          <span>{account.region} · {account.industry}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
            {account.logoText}
          </span>
          <div>
            <h2 className="text-xl font-semibold">{account.name}</h2>
            <p className="text-sm text-muted-foreground">{account.summary}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground sm:grid-cols-4">
          <div>
            <p className="font-semibold text-foreground">Budget</p>
            <p>{account.constraints.budget}</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Timeline</p>
            <p>{account.constraints.timeline}</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Staffing</p>
            <p>{account.constraints.staffing}</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Risk tolerance</p>
            <p>{account.constraints.riskTolerance}</p>
          </div>
        </div>
      </div>
      <Card className="lg:col-span-4 h-full rounded-2xl border-border bg-background/60 p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Persona focus</p>
            <h3 className="text-lg font-semibold">{persona.label}</h3>
            <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: persona.headline }} />
          </div>
          <Badge variant="secondary" className="rounded-full">{persona.title}</Badge>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {persona.heroStats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-dashed border-primary/20 bg-primary/5 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
              <p className="text-lg font-semibold text-primary">{stat.value}</p>
              <span className="text-xs text-primary/70">{stat.delta}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Quick actions</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {persona.quickActions.map((action) => (
              <li key={action.label} className="flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-primary" />
                <span>
                  <span className="font-medium text-foreground">{action.label}.</span> {action.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
      <Card className="lg:col-span-4 h-full rounded-2xl border-dashed border-primary/30 bg-primary/5 p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-primary">Guided golden path</p>
          <Badge variant="outline" className="rounded-full border-primary/60 text-xs text-primary">
            Step {goldenStep + 1} of {allGoldenSteps.length}
          </Badge>
        </div>
        <h3 className="mt-2 text-lg font-semibold text-primary">{step.label}</h3>
        <p className="text-sm text-primary/80">{step.description}</p>
          <div className="mt-4 grid gap-2 text-sm text-primary/80">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4" /> Impact: {step.impact}
            </div>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4" /> Output: {step.output}
            </div>
          {pain && (
            <div className="rounded-xl border border-primary/20 bg-primary/10 p-3 text-xs">
              <p className="font-semibold text-primary">Buyer pain: {pain.label}</p>
              <p className="text-primary/80">{pain.relief}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
