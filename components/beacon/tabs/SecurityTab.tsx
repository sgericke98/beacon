"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useWorkspaceStore } from "@/store/workspace-store";
import { BadgeCheck, Table, Layers, X, Download } from "@/lib/lucide-react";

export function SecurityTab() {
  const fallbackMode = useWorkspaceStore((state) => state.fallbackMode);
  const toggleFallback = useWorkspaceStore((state) => state.toggleFallback);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border bg-background/70 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Trust & security</h3>
            <p className="text-sm text-muted-foreground">All data is mocked offline with compliance overlays.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="rounded-full">SOC2</Badge>
            <Badge variant="outline" className="rounded-full">GDPR</Badge>
            <Badge variant="outline" className="rounded-full">HIPAA</Badge>
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="rounded-2xl border border-border bg-background/80 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <BadgeCheck className="h-4 w-4 text-primary" /> Encryption
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Mocked AES-256 at rest · TLS 1.3 in transit.</p>
          </Card>
          <Card className="rounded-2xl border border-border bg-background/80 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <BadgeCheck className="h-4 w-4 text-primary" /> OAuth posture
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Salesforce & NetSuite OAuth simulated with scoped tokens.</p>
          </Card>
          <Card className="rounded-2xl border border-border bg-background/80 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Table className="h-4 w-4 text-primary" /> Sync freshness
            </div>
            <p className="mt-2 text-xs text-muted-foreground">CRM 2h · ERP 1h · Market 12h since last refresh.</p>
          </Card>
          <Card className="rounded-2xl border border-border bg-background/80 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Layers className="h-4 w-4 text-primary" /> Data residency
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Region locked to EU for Globex mock workspace.</p>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-6 space-y-4 rounded-3xl border border-border bg-background/70 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Privacy controls</h3>
            <Badge variant="outline" className="rounded-full">In-demo toggle</Badge>
          </div>
            <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-muted/10 px-4 py-3 text-sm">
            <div className="flex items-center gap-2">
              <X className="h-4 w-4 text-primary" /> PII redaction
            </div>
            <Switch checked={fallbackMode} onCheckedChange={toggleFallback} />
          </div>
          <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-xs text-primary/80">
            <p className="font-semibold">Explainability</p>
            <p>Every recommendation cites provenance sources to satisfy governance.</p>
          </div>
        </Card>
        <Card className="lg:col-span-6 space-y-4 rounded-3xl border border-border bg-background/70 p-6">
          <h3 className="text-lg font-semibold">Audit readiness</h3>
          <p className="text-sm text-muted-foreground">Downloadable CSV with step-by-step trace of the golden path.</p>
          <Button variant="outline" className="rounded-full self-start">
            <Download className="mr-2 h-4 w-4" /> Export audit log (CSV)
          </Button>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-muted/10 p-4">
              <p className="font-semibold">Access controls</p>
              <p className="text-xs text-muted-foreground">Role-based: CFO, CRO, CIO, Finance Ops, CS, Exec.</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/10 p-4">
              <p className="font-semibold">Versioning</p>
              <p className="text-xs text-muted-foreground">Deliverables track Draft → Review → Approved → Sent.</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="rounded-3xl border border-border bg-background/70 p-6">
        <h3 className="text-lg font-semibold">Integrations in mock mode</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-muted/10 p-4 text-sm">
            <p className="font-semibold">Salesforce OAuth</p>
            <p className="text-xs text-muted-foreground">Guided flow shows scope + consent screen.</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-muted/10 p-4 text-sm">
            <p className="font-semibold">NetSuite OAuth</p>
            <p className="text-xs text-muted-foreground">Mock token exchange & sync plan.</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-muted/10 p-4 text-sm">
            <p className="font-semibold">API vault</p>
            <p className="text-xs text-muted-foreground">Secrets stored in offline vault for demo reliability.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
