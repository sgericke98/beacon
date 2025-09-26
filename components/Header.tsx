"use client";

import { Bell, Menu, Search, Sparkles, Rows, ArrowDownRight, ArrowUpRight, Download, BadgeCheck, Wrench } from "@/lib/lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AccountId, PersonaId } from "@/lib/demo-data";
import { personaProfiles, accountContexts, topTabs } from "@/lib/demo-data";
import { useWorkspaceStore } from "@/store/workspace-store";

interface HeaderProps {
  onOpenSidebar?: () => void;
}

export function Header({ onOpenSidebar }: HeaderProps) {
  const personaId = useWorkspaceStore((state) => state.personaId);
  const accountId = useWorkspaceStore((state) => state.accountId);
  const activeTab = useWorkspaceStore((state) => state.activeTab);
  const notifications = useWorkspaceStore((state) => state.notifications);
  const markNotification = useWorkspaceStore((state) => state.markNotification);
  const setPersona = useWorkspaceStore((state) => state.setPersona);
  const setAccount = useWorkspaceStore((state) => state.setAccount);
  const resetDemo = useWorkspaceStore((state) => state.resetDemo);
  const demoGuided = useWorkspaceStore((state) => state.demoGuided);
  const toggleGuided = useWorkspaceStore((state) => state.toggleGuided);
  const fastForward = useWorkspaceStore((state) => state.fastForward);
  const toggleFastForward = useWorkspaceStore((state) => state.toggleFastForward);
  const fallbackMode = useWorkspaceStore((state) => state.fallbackMode);
  const toggleFallback = useWorkspaceStore((state) => state.toggleFallback);
  const latency = useWorkspaceStore((state) => state.latency);
  const cycleLatency = useWorkspaceStore((state) => state.cycleLatency);
  const developerMode = useWorkspaceStore((state) => state.developerMode);
  const toggleDeveloperMode = useWorkspaceStore((state) => state.toggleDeveloperMode);

  const unreadCount = notifications.filter((entry) => !entry.read).length;
  const activeTabLabel = topTabs.find((tab) => tab.id === activeTab)?.label ?? "Overview";

  return (
    <header className="sticky top-0 z-40 flex flex-wrap items-center gap-4 border-b border-border bg-background/85 px-4 py-4 backdrop-blur lg:px-8">
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
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>Beacon</span>
        </div>
        <span className="hidden text-xs uppercase tracking-wide text-muted-foreground sm:inline">{activeTabLabel}</span>
        {developerMode && (
          <Badge variant="outline" className="hidden border-primary/50 text-[10px] uppercase tracking-wide text-primary sm:inline-flex">
            Dev mode
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] sm:min-w-[260px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-11 rounded-xl bg-muted/40 pl-9"
            placeholder="Search entities, agents, workflows, artifacts"
            aria-label="Global search"
          />
        </div>
        <Select value={personaId} onValueChange={(value) => setPersona(value as PersonaId)}>
          <SelectTrigger className="h-11 w-[150px] rounded-xl border-muted/50 bg-background/50">
            <SelectValue placeholder="Persona" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {personaProfiles.map((persona) => (
              <SelectItem key={persona.id} value={persona.id}>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-semibold">{persona.label}</span>
                  <span className="text-xs text-muted-foreground">{persona.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={accountId} onValueChange={(value) => setAccount(value as AccountId)}>
          <SelectTrigger className="h-11 w-[160px] rounded-xl border-muted/50 bg-background/50">
            <SelectValue placeholder="Account" />
          </SelectTrigger>
          <SelectContent>
            {accountContexts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-semibold">{account.name}</span>
                  <span className="text-xs text-muted-foreground">{account.industry}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative h-11 w-11 rounded-xl">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-semibold text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80">
            <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Alerts</div>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start gap-1 ${notification.read ? "opacity-70" : ""}`}
                onClick={() => markNotification(notification.id, true)}
              >
                <div className="flex w-full items-center justify-between text-sm font-semibold">
                  <span>{notification.title}</span>
                  <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                </div>
                <p className="text-sm text-muted-foreground">{notification.description}</p>
                <span className="text-xs text-primary">{notification.linkLabel}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-11 rounded-xl px-3 font-semibold">
              <Rows className="mr-2 h-4 w-4" /> Demo toolbar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64">
            <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Demo toolbar</div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={resetDemo} className="gap-2">
              <ArrowDownRight className="h-4 w-4" /> Reset demo
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={toggleGuided} className="gap-2">
              <BadgeCheck className="h-4 w-4" /> Guided overlay {demoGuided ? "on" : "off"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleFastForward} className="gap-2">
              <ArrowUpRight className="h-4 w-4" /> Fast-forward {fastForward ? "on" : "off"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleFallback} className="gap-2">
              <Download className="h-4 w-4" /> Fallback {fallbackMode ? "active" : "off"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleDeveloperMode} className="gap-2">
              <Wrench className="h-4 w-4" /> Developer mode {developerMode ? "on" : "off"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={cycleLatency} className="gap-2">
              <span className="flex items-center gap-2">
                <Rows className="h-4 w-4" /> Latency: {latency}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ThemeToggle />
      </div>
    </header>
  );
}
