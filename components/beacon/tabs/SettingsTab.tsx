"use client";

import { useWorkspaceStore } from "@/store/workspace-store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Wrench, Sparkles, ArrowUpRight, BadgeCheck } from "@/lib/lucide-react";

const latencyMap = {
  instant: 0,
  normal: 50,
  dramatic: 90,
};

export function SettingsTab() {
  const demoGuided = useWorkspaceStore((state) => state.demoGuided);
  const fastForward = useWorkspaceStore((state) => state.fastForward);
  const fallbackMode = useWorkspaceStore((state) => state.fallbackMode);
  const latency = useWorkspaceStore((state) => state.latency);
  const toggleGuided = useWorkspaceStore((state) => state.toggleGuided);
  const toggleFastForward = useWorkspaceStore((state) => state.toggleFastForward);
  const toggleFallback = useWorkspaceStore((state) => state.toggleFallback);
  const cycleLatency = useWorkspaceStore((state) => state.cycleLatency);
  const resetDemo = useWorkspaceStore((state) => state.resetDemo);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border bg-background/70 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Demo controls</h3>
          <Badge variant="outline" className="rounded-full">Offline</Badge>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="rounded-2xl border border-border bg-background/80 p-5">
            <div className="flex items-center justify-between text-sm">
              <span>Guided mode</span>
              <Switch checked={demoGuided} onCheckedChange={toggleGuided} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Show breadcrumb overlay and scripted prompts.</p>
          </Card>
          <Card className="rounded-2xl border border-border bg-background/80 p-5">
            <div className="flex items-center justify-between text-sm">
              <span>Fast-forward</span>
              <Switch checked={fastForward} onCheckedChange={toggleFastForward} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Skip to final deliverable pack instantly.</p>
          </Card>
          <Card className="rounded-2xl border border-border bg-background/80 p-5">
            <div className="flex items-center justify-between text-sm">
              <span>Fallback outputs</span>
              <Switch checked={fallbackMode} onCheckedChange={toggleFallback} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Guarantee deterministic outputs for every agent.</p>
          </Card>
          <Card className="rounded-2xl border border-border bg-background/80 p-5">
            <div className="flex items-center justify-between text-sm">
              <span>Latency</span>
              <Badge variant="secondary" className="rounded-full text-[10px] uppercase tracking-wide">{latency}</Badge>
            </div>
            <Progress className="mt-4" value={latencyMap[latency]} />
            <Button variant="outline" size="sm" className="mt-3 rounded-full" onClick={cycleLatency}>
              Cycle latency
            </Button>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-6 space-y-4 rounded-3xl border border-border bg-background/70 p-6">
          <h3 className="text-lg font-semibold">Demo hygiene checklist</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/10 px-3 py-2">
              <Wrench className="h-4 w-4 text-primary" /> Reset workspace context
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/10 px-3 py-2">
              <ArrowUpRight className="h-4 w-4 text-primary" /> Fast-forward toggled {fastForward ? "on" : "off"}
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/10 px-3 py-2">
              <BadgeCheck className="h-4 w-4 text-primary" /> Guided overlay {demoGuided ? "enabled" : "disabled"}
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/10 px-3 py-2">
              <Sparkles className="h-4 w-4 text-primary" /> Fallback outputs {fallbackMode ? "active" : "off"}
            </div>
          </div>
          <Button variant="outline" className="rounded-full" onClick={resetDemo}>
            Reset demo
          </Button>
        </Card>
        <Card className="lg:col-span-6 rounded-3xl border border-border bg-background/70 p-6">
          <h3 className="text-lg font-semibold">Workspace diagnostics</h3>
          <div className="mt-4 grid gap-3 text-sm">
            <div className="rounded-2xl border border-border/70 bg-muted/10 p-4">
              <p className="font-semibold">Constraints applied</p>
              <p className="text-xs text-muted-foreground">Budget, timeline, staffing, risk tolerance propagate to agents.</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/10 p-4">
              <p className="font-semibold">Notifications</p>
              <p className="text-xs text-muted-foreground">Alerts push into workflows and deliverables automatically.</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/10 p-4">
              <p className="font-semibold">Wow visuals</p>
              <p className="text-xs text-muted-foreground">Agent race, Beacon radar, before/after scoreboard ready.</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
