"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { agentCatalog, verticalLabels } from "@/lib/agents";
import type { AgentDefinition } from "@/lib/types";
import { useAgentContext } from "@/store/agent-context";
import { BadgeCheck, Sparkles } from "lucide-react";

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { selectAgent, selectedAgentId } = useAgentContext();

  const grouped = agentCatalog.reduce<Record<string, AgentDefinition[]>>((acc, agent) => {
    if (!acc[agent.vertical]) {
      acc[agent.vertical] = [];
    }
    acc[agent.vertical].push(agent);
    return acc;
  }, {});

  return (
    <div className="flex h-full flex-col gap-8 overflow-y-auto px-6 py-8 text-sm">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Sparkles className="h-5 w-5 text-primary" />
          Beacon
        </div>
        <p className="text-xs text-muted-foreground">
          Multi-agent workspace for revenue orchestration. Pick an agent to run its mock workflow.
        </p>
      </div>
      <nav className="space-y-6">
        {Object.entries(grouped).map(([vertical, agents]) => (
          <div key={vertical} className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {verticalLabels[vertical as keyof typeof verticalLabels]}
            </p>
            <div className="space-y-1">
              {agents.map((agent) => {
                const href = agent.status === "core" ? `/agents/${agent.id}` : undefined;
                const active =
                  (href && pathname.startsWith(href)) || selectedAgentId === agent.id;
                return agent.status === "core" ? (
                  <Link
                    key={agent.id}
                    href={href}
                    onClick={() => {
                      selectAgent(agent.id);
                      onNavigate?.();
                    }}
                    className={`group flex items-center justify-between rounded-xl px-3 py-2 transition-all duration-200 ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                    }`}
                  >
                    <span className="text-sm font-medium">{agent.name}</span>
                    {active && <BadgeCheck className="h-4 w-4" />}
                  </Link>
                ) : (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-muted-foreground/60"
                    title="Coming soon"
                  >
                    <span className="text-sm">{agent.name}</span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Soon
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
