"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWorkspaceStore } from "@/store/workspace-store";
import { Sparkles, Layers } from "@/lib/lucide-react";

const roadmapItems = [
  { quarter: "Q3", focus: "Slack connector", detail: "Push approvals, alerts, and deliverable links into Slack." },
  { quarter: "Q3", focus: "KPI alerts", detail: "Real-time guardrails on leakage, margin, and DSO." },
  { quarter: "Q4", focus: "Multilingual", detail: "Spanish localization for workflows + deliverables." },
];

const innovationItems = [
  { title: "Agent marketplace", detail: "Bring-your-own MCP agents into Beacon catalog." },
  { title: "Streaming provenance", detail: "Live tracecards per step with downloadables." },
  { title: "Adaptive governance", detail: "Auto-adjust approval gates based on risk." },
];

export function RoadmapTab() {
  const language = useWorkspaceStore((state) => state.language);
  const setLanguage = useWorkspaceStore((state) => state.setLanguage);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border bg-background/70 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Roadmap & future-proofing</h3>
            <p className="text-sm text-muted-foreground">Beacon continues to compound value with extensibility.</p>
          </div>
          <Badge variant="outline" className="rounded-full">Forward-looking</Badge>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {roadmapItems.map((item) => (
            <Card key={`${item.quarter}-${item.focus}`} className="rounded-2xl border border-border bg-background/80 p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.quarter}</p>
              <p className="mt-1 text-sm font-semibold">{item.focus}</p>
              <p className="text-xs text-muted-foreground">{item.detail}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7 space-y-4 rounded-3xl border border-border bg-background/70 p-6">
          <h3 className="text-lg font-semibold">Innovation themes</h3>
          <div className="space-y-3">
            {innovationItems.map((item) => (
              <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-border/70 bg-muted/10 p-4 text-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="lg:col-span-5 space-y-4 rounded-3xl border border-border bg-background/70 p-6">
          <h3 className="text-lg font-semibold">Language toggle</h3>
          <p className="text-sm text-muted-foreground">Switch between English and Spanish copy instantly.</p>
          <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/10 px-4 py-3 text-sm">
            <Layers className="h-4 w-4 text-primary" />
            <span>Current: {language === "en" ? "English" : "Español"}</span>
            <div className="ml-auto flex gap-2">
              <Button size="sm" variant={language === "en" ? "default" : "outline"} className="rounded-full" onClick={() => setLanguage("en")}>
                EN
              </Button>
              <Button size="sm" variant={language === "es" ? "default" : "outline"} className="rounded-full" onClick={() => setLanguage("es")}>
                ES
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-xs text-primary/80">
            <p className="font-semibold">Slack & KPI pilots</p>
            <p>Slack connector + KPI alerts enter beta with select partners next quarter.</p>
          </div>
        </Card>
      </section>
    </div>
  );
}
