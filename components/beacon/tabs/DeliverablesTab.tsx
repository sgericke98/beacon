"use client";

import { deliverablePack, adoptionPlan } from "@/lib/demo-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Download, ArrowUpRight, Upload } from "@/lib/lucide-react";

export function DeliverablesTab() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border bg-background/70 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Client-ready deliverable pack</h3>
            <p className="text-sm text-muted-foreground">Every artifact references linked entities and approval state.</p>
          </div>
          <Badge variant="outline" className="rounded-full">Governed</Badge>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {deliverablePack.map((item) => (
            <Card key={item.id} className="rounded-2xl border border-border bg-background/80 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{item.title}</p>
                <Badge variant="secondary" className="rounded-full text-[10px] uppercase tracking-wide">{item.status}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Owner: {item.owner} · Due {item.due}</p>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7 space-y-4 rounded-3xl border border-border bg-background/70 p-6">
          <h3 className="text-lg font-semibold">Executive summary</h3>
          <p className="text-sm text-muted-foreground">
            Beacon identified $240K leakage, accelerated cycles by 27%, and drafted a blended team SOW covering 3 products + 2 CS specialists.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-primary/40 bg-primary/10 p-4">
              <p className="text-xs uppercase tracking-wide text-primary">ROI headline</p>
              <p className="text-2xl font-semibold text-primary">$240K recovered</p>
              <p className="text-xs text-primary/80">Guardrails prevented leakage across invoices + pricing.</p>
            </div>
            <div className="rounded-2xl border border-primary/40 bg-primary/10 p-4">
              <p className="text-xs uppercase tracking-wide text-primary">Time-to-value</p>
              <p className="text-2xl font-semibold text-primary">27% faster cycles</p>
              <p className="text-xs text-primary/80">Golden Path compresses legal + finance approvals.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button className="rounded-full">
              <ArrowUpRight className="mr-2 h-4 w-4" /> Scope a pilot
            </Button>
            <Button variant="outline" className="rounded-full">
              <Download className="mr-2 h-4 w-4" /> Email me this pack
            </Button>
            <Button variant="outline" className="rounded-full">
              <Upload className="mr-2 h-4 w-4" /> Share link
            </Button>
          </div>
        </Card>
        <Card className="lg:col-span-5 space-y-4 rounded-3xl border border-border bg-background/70 p-6">
          <h3 className="text-lg font-semibold">Adoption & change plan</h3>
          <p className="text-sm text-muted-foreground">Learning center resources keep every team on track.</p>
          <div className="space-y-3">
            {adoptionPlan.map((item) => (
              <div key={item.phase} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/10 px-4 py-3">
                <Check className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-semibold">{item.phase}</p>
                  <p className="text-xs text-muted-foreground">{item.focus}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-xs text-primary/80">
            <p className="font-semibold">Learning center</p>
            <p>Checklist, videos, and knowledge base links are pre-seeded for offline demo.</p>
          </div>
        </Card>
      </section>

      <section className="rounded-3xl border border-border bg-background/70 p-6">
        <h3 className="text-lg font-semibold">Next steps</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-muted/10 p-4 text-sm">
            <p className="font-semibold">Pilot scope</p>
            <p className="text-xs text-muted-foreground">4-week pilot with SOW, integrity report, adoption plan.</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-muted/10 p-4 text-sm">
            <p className="font-semibold">Exec alignment</p>
            <p className="text-xs text-muted-foreground">CFO, CRO, CIO ready with persona dashboards.</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-muted/10 p-4 text-sm">
            <p className="font-semibold">Sign-off</p>
            <p className="text-xs text-muted-foreground">Approvals captured with audit logs + export options.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
