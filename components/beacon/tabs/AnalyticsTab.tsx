"use client";

import { adoptionStats, multiTenantSample, systemHealth, learningCenterResources } from "@/lib/demo-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis } from "@/lib/recharts";
import { ResponsiveContainer } from "@/lib/recharts";
import { Activity, Info, BadgeCheck } from "@/lib/lucide-react";

const usageTrend = [
  { week: "W1", runs: 120 },
  { week: "W2", runs: 186 },
  { week: "W3", runs: 260 },
  { week: "W4", runs: 318 },
  { week: "W5", runs: 404 },
];

const roleUsage = [
  { role: "Sales", runs: 210 },
  { role: "Finance", runs: 198 },
  { role: "CS", runs: 164 },
  { role: "Ops", runs: 140 },
];

export function AnalyticsTab() {
  return (
    <div className="space-y-8">
      <section className="grid gap-4 rounded-3xl border border-border bg-background/70 p-6 lg:grid-cols-4">
        {adoptionStats.map((stat) => (
          <Card key={stat.label} className="rounded-2xl border border-border bg-background/80 p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
            {stat.sublabel && <p className="text-xs text-muted-foreground">{stat.sublabel}</p>}
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7 rounded-3xl border border-border bg-background/70 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Usage trend</h3>
            <Badge variant="outline" className="rounded-full">Monthly view</Badge>
          </div>
          <ResponsiveContainer height={220}>
            <BarChart data={usageTrend}>
              <Bar dataKey="runs" fill="var(--primary)" />
              <XAxis dataKey="week" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="lg:col-span-5 rounded-3xl border border-border bg-background/70 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Usage by role</h3>
            <Badge variant="outline" className="rounded-full">Top teams</Badge>
          </div>
          <ResponsiveContainer height={220}>
            <BarChart data={roleUsage}>
              <Bar dataKey="runs" fill="var(--primary)" />
              <XAxis dataKey="role" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-6 rounded-3xl border border-border bg-background/70 p-6">
          <h3 className="text-lg font-semibold">System health</h3>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-muted/10 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Uptime</p>
              <p className="text-xl font-semibold">{systemHealth.uptime}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/10 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Concurrent runs</p>
              <p className="text-xl font-semibold">{systemHealth.concurrentRuns}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/10 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Error rate</p>
              <p className="text-xl font-semibold">{systemHealth.errorRate}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/10 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Tenants</p>
              <p className="text-xl font-semibold">{systemHealth.tenants}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/10 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Last incident</p>
              <p className="text-xl font-semibold">{systemHealth.lastIncident}</p>
            </div>
          </div>
        </Card>
        <Card className="lg:col-span-6 rounded-3xl border border-border bg-background/70 p-6">
          <h3 className="text-lg font-semibold">Multi-tenant activity</h3>
          <Table className="mt-3">
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Runs today</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {multiTenantSample.map((row) => (
                <TableRow key={row.account}>
                  <TableCell className="font-semibold">{row.account}</TableCell>
                  <TableCell>{row.runsToday}</TableCell>
                  <TableCell>{row.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7 rounded-3xl border border-border bg-background/70 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Adoption toolkit</h3>
            <Badge variant="outline" className="rounded-full">Learning center</Badge>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {learningCenterResources.map((resource) => (
              <div key={resource.title} className="rounded-2xl border border-border/70 bg-muted/10 p-4">
                <p className="text-sm font-semibold">{resource.title}</p>
                <p className="text-xs text-muted-foreground">{resource.type} · {resource.duration}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="lg:col-span-5 space-y-4 rounded-3xl border border-border bg-background/70 p-6">
          <h3 className="text-lg font-semibold">Admin actions</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/10 px-3 py-2">
              <BadgeCheck className="h-4 w-4 text-primary" /> Invite new team
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/10 px-3 py-2">
              <Activity className="h-4 w-4 text-primary" /> Download usage CSV
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/10 px-3 py-2">
              <Info className="h-4 w-4 text-primary" /> Trigger guided tour overlay
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
