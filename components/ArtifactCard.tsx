import type { RunArtifact } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { ResponsiveContainer, BarChart, Bar, XAxis } from "recharts";

interface ArtifactCardProps {
  artifact: RunArtifact;
}

export function ArtifactCard({ artifact }: ArtifactCardProps) {
  if (artifact.type === "table") {
    return (
      <Card className="h-full rounded-2xl border-border/70 bg-background/70">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">{artifact.title}</CardTitle>
          {artifact.description && <p className="text-sm text-muted-foreground">{artifact.description}</p>}
        </CardHeader>
        <CardContent>
          <DataTable columns={artifact.columns} rows={artifact.rows} />
        </CardContent>
      </Card>
    );
  }

  if (artifact.type === "list") {
    return (
      <Card className="h-full rounded-2xl border-border/70 bg-background/70">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">{artifact.title}</CardTitle>
          {artifact.description && <p className="text-sm text-muted-foreground">{artifact.description}</p>}
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-foreground">
          {artifact.items.map((item, index) => (
            <div key={index} className="rounded-xl bg-muted/40 p-3">
              <p className="font-semibold text-foreground">{item.title}</p>
              {item.caption && <p className="text-sm text-muted-foreground">{item.caption}</p>}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (artifact.type === "chart") {
    return (
      <Card className="h-full rounded-2xl border-border/70 bg-background/70">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">{artifact.title}</CardTitle>
          {artifact.description && <p className="text-sm text-muted-foreground">{artifact.description}</p>}
        </CardHeader>
        <CardContent>
          <ResponsiveContainer height={240}>
            <BarChart data={artifact.data.map((entry) => ({ label: entry.label, value: entry.value }))}>
              <Bar dataKey="value" fill="#6366f1" />
              <XAxis dataKey="label" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full rounded-2xl border-border/70 bg-background/70">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">{artifact.title}</CardTitle>
        {artifact.description && <p className="text-sm text-muted-foreground">{artifact.description}</p>}
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm leading-6 text-foreground" dangerouslySetInnerHTML={{ __html: artifact.html }} />
      </CardContent>
    </Card>
  );
}
