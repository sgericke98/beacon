"use client";

import { ArrowUpRight, BadgeCheck, Sparkles, Layers } from "@/lib/lucide-react";
import { agentCatalog } from "@/lib/agents";
import { verticals, buyerPains } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWorkspaceStore, availableAlerts } from "@/store/workspace-store";
import type { VerticalId } from "@/lib/demo-data";

interface SidebarProps {
  onNavigate?: () => void;
}

const verticalCounts: Record<VerticalId, number> = agentCatalog.reduce((acc, agent) => {
  const key = agent.vertical as VerticalId;
  acc[key] = (acc[key] ?? 0) + 1;
  return acc;
}, {} as Record<VerticalId, number>);

export function Sidebar({ onNavigate }: SidebarProps) {
  const activeVertical = useWorkspaceStore((state) => state.activeVertical);
  const setVertical = useWorkspaceStore((state) => state.setVertical);
  const setTab = useWorkspaceStore((state) => state.setTab);
  const selectPain = useWorkspaceStore((state) => state.selectPain);

  return (
    <div className="flex h-full flex-col justify-between overflow-y-auto px-6 py-8">
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <Sparkles className="h-5 w-5 text-primary" />
            Beacon Control Center
          </div>
          <p className="text-sm text-muted-foreground">
            Multi-agent workspace stitched across CRM, ERP, Finance, CS. Everything here runs offline with deterministic mock data.
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Verticals</p>
          <div className="space-y-2">
            {verticals.map((vertical) => {
              const isActive = vertical.id === activeVertical;
              const count = verticalCounts[vertical.id as VerticalId] ?? 0;
              return (
                <button
                  key={vertical.id}
                  type="button"
                  onClick={() => {
                    setVertical(vertical.id as VerticalId);
                    setTab("agents");
                    onNavigate?.();
                  }}
                  className={`flex w-full items-start justify-between rounded-2xl border px-4 py-3 text-left transition hover:border-primary hover:bg-primary/5 ${
                    isActive ? "border-primary/60 bg-primary/10" : "border-border"
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold">{vertical.label}</p>
                    <p className="text-xs text-muted-foreground">{vertical.description}</p>
                  </div>
                  <Badge variant={isActive ? "default" : "secondary"} className="rounded-full">
                    {count} agents
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span>Alerts</span>
            <Button variant="link" className="h-auto p-0 text-xs" onClick={() => setTab("workflows")}>View all</Button>
          </div>
          <div className="space-y-2">
            {availableAlerts.map((alert) => (
              <button
                key={alert.id}
                type="button"
                onClick={() => {
                  setTab(alert.targetTab);
                  onNavigate?.();
                }}
                className="group flex w-full flex-col rounded-2xl border border-border/70 bg-muted/10 px-4 py-3 text-left transition hover:border-primary hover:bg-primary/5"
              >
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>{alert.title}</span>
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{alert.description}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3 rounded-2xl border border-border bg-muted/10 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Layers className="h-4 w-4 text-primary" /> Golden Path hook
          </div>
          <p className="text-xs text-muted-foreground">Ask the buyer what hurts most to branch the guided narrative.</p>
          <div className="flex flex-col gap-2">
            {buyerPains.map((pain) => (
                <Button
                  key={pain.id}
                  variant="outline"
                  size="sm"
                  className="justify-between rounded-xl"
                  onClick={() => selectPain(pain.id)}
                >
                  <span>{pain.label}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              ))}
          </div>
        </div>
      </div>
      <div className="space-y-3 border-t border-border/70 pt-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-primary" /> SOC2 | GDPR | HIPAA ready mock
        </div>
        <p>Unified schema: Account, Opportunity, Contact, Product, Employee, Project, Invoice, Payment, MarketSignal, Survey.</p>
        <p>Deliverables link back to entities via linkedEntities ensuring provenance and governance.</p>
      </div>
    </div>
  );
}
