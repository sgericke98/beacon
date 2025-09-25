"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAgentContext } from "@/store/agent-context";
import { getAgentById } from "@/lib/agents";

interface HeaderProps {
  onOpenSidebar?: () => void;
}

export function Header({ onOpenSidebar }: HeaderProps) {
  const pathname = usePathname();
  const { runHistory } = useAgentContext();
  const lastRun = runHistory[0];
  const agentId = pathname.startsWith("/agents/") ? pathname.split("/agents/")[1]?.split("/")[0] : null;
  const agent = agentId ? getAgentById(agentId) : null;

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/80 px-4 py-4 backdrop-blur lg:px-8">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          onClick={() => onOpenSidebar?.()}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Beacon demo</p>
          <h1 className="text-lg font-semibold text-foreground">
            {agent ? agent.name : "Agentic control center"}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-6 text-right">
        <div className="hidden text-sm text-muted-foreground sm:block">
          <p className="text-xs uppercase tracking-wide">Last run</p>
          <p className="text-sm text-foreground">
            {lastRun ? `${lastRun.summary} • ${new Date(lastRun.completedAt).toLocaleTimeString()}` : "No runs yet"}
          </p>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
