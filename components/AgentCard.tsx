import Link from "next/link";
import type { AgentDefinition } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

interface AgentCardProps {
  agent: AgentDefinition;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Card className="relative flex h-full flex-col overflow-hidden border-border/60 bg-background/80 shadow-sm ring-1 ring-foreground/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg font-semibold text-foreground">{agent.name}</CardTitle>
          <Badge variant={agent.status === "core" ? "default" : "secondary"}>
            {agent.status === "core" ? "Live demo" : "Coming soon"}
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground">{agent.summary}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {agent.features.slice(0, 3).map((feature) => (
            <span key={feature} className="rounded-full bg-muted px-2 py-1">
              {feature}
            </span>
          ))}
        </div>
        {agent.status === "core" ? (
          <Link
            href={`/agents/${agent.id}`}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
          >
            Open agent
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground/70">Mock coming soon</p>
        )}
      </CardContent>
    </Card>
  );
}
