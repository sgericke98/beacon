"use client";

import { artifacts, sdkSnippet } from "@/lib/demo-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, ArrowUpRight, Upload } from "@/lib/lucide-react";

const artifactTypes = [
  { title: "Executive Summary", description: "ROI + impact narrative", channels: ["PDF", "Email"] },
  { title: "Integrity Report", description: "ERP-ready package", channels: ["NetSuite", "CSV"] },
  { title: "Market Brief", description: "Battlecard bundle", channels: ["CRM", "Slack"] },
  { title: "Adoption Plan", description: "Change mgmt milestones", channels: ["Notion", "Email"] },
];

export function ArtifactsTab() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7 space-y-4 rounded-3xl border border-border bg-background/70 p-6">
          <h3 className="text-lg font-semibold">Artifacts with provenance</h3>
          <div className="space-y-3">
            {artifacts.map((artifact) => (
              <div key={artifact.id} className="rounded-2xl border border-border/70 bg-muted/10 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{artifact.title}</p>
                  <Badge variant="outline" className="rounded-full text-[10px] uppercase tracking-wide">
                    {artifact.lastRun}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{artifact.summary}</p>
                <p className="mt-1 text-xs text-muted-foreground">Linked entities: {artifact.linkedEntities.join(" · ")}</p>
                <p className="mt-1 text-xs text-muted-foreground">Owner: {artifact.owner}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="lg:col-span-5 space-y-4 rounded-3xl border border-border bg-background/70 p-6">
          <h3 className="text-lg font-semibold">Packaging & export</h3>
          <div className="space-y-3 text-sm">
            {artifactTypes.map((artifact) => (
              <div key={artifact.title} className="flex items-center justify-between rounded-2xl border border-border/70 bg-muted/10 px-4 py-3">
                <div>
                  <p className="font-semibold">{artifact.title}</p>
                  <p className="text-xs text-muted-foreground">{artifact.description}</p>
                </div>
                <Badge variant="secondary" className="rounded-full text-[10px] uppercase tracking-wide">
                  {artifact.channels.join(" · ")}
                </Badge>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="rounded-full">
              <Download className="mr-2 h-4 w-4" /> Generate PDF
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Upload className="mr-2 h-4 w-4" /> Create share link
            </Button>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-6 rounded-3xl border border-border bg-background/70 p-6">
          <h3 className="text-lg font-semibold">Deliverables flowing back to systems</h3>
          <div className="space-y-3 text-sm">
            <div className="rounded-2xl border border-border/70 bg-muted/10 p-4">
              <p className="font-semibold">CRM update</p>
              <p className="text-xs text-muted-foreground">Next best plays and SOW status synced to Salesforce mock.</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/10 p-4">
              <p className="font-semibold">ERP payload</p>
              <p className="text-xs text-muted-foreground">Integrity report ready for NetSuite export via button.</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/10 p-4">
              <p className="font-semibold">Collaboration</p>
              <p className="text-xs text-muted-foreground">Share links + email ensures cross-functional adoption.</p>
            </div>
          </div>
        </Card>
        <Card className="lg:col-span-6 rounded-3xl border border-border bg-background/70 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">SDK snippet</h3>
            <Badge variant="outline" className="rounded-full">Add new agent in 30 minutes</Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Developers can register new agents with unified schema context.</p>
          <ScrollArea className="mt-4 h-48 rounded-2xl border border-border/60 bg-muted/10 p-4 text-xs">
            <code className="whitespace-pre-wrap text-xs text-muted-foreground">{sdkSnippet}</code>
          </ScrollArea>
          <Button variant="link" size="sm" className="mt-3 h-auto p-0 text-xs">
            <ArrowUpRight className="mr-1 h-3 w-3" /> View SDK docs (mock)
          </Button>
        </Card>
      </section>
    </div>
  );
}
