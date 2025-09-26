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
    <header className="sticky top-0 z-40 flex flex-wrap items-center gap-4 border-b border-border/50 bg-background/95 px-4 py-3 backdrop-blur-md lg:px-8 shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9 hover:bg-muted/50"
          onClick={() => onOpenSidebar?.()}
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">Beacon</span>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <div className="h-4 w-px bg-border" />
            <span className="text-sm font-medium text-muted-foreground">{activeTabLabel}</span>
          </div>
        </div>
        {developerMode && (
          <Badge variant="outline" className="hidden border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-medium uppercase tracking-wide sm:inline-flex">
            Dev mode
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[280px] sm:min-w-[320px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
          <Input
            className="h-10 rounded-lg border-0 bg-muted/30 pl-10 pr-4 text-sm placeholder:text-muted-foreground/70 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            placeholder="Search entities, agents, workflows, artifacts..."
            aria-label="Global search"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={personaId} onValueChange={(value) => setPersona(value as PersonaId)}>
            <SelectTrigger className="h-10 w-[140px] rounded-lg border-muted/40 bg-background/60 hover:bg-background/80 transition-all duration-200">
              <SelectValue placeholder="Persona" />
            </SelectTrigger>
            <SelectContent className="w-64">
              {personaProfiles.map((persona) => (
                <SelectItem key={persona.id} value={persona.id} className="p-3">
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold">{persona.label}</span>
                    <span className="text-xs text-muted-foreground">{persona.title}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={accountId} onValueChange={(value) => setAccount(value as AccountId)}>
            <SelectTrigger className="h-10 w-[150px] rounded-lg border-muted/40 bg-background/60 hover:bg-background/80 transition-all duration-200">
              <SelectValue placeholder="Account" />
            </SelectTrigger>
            <SelectContent className="w-64">
              {accountContexts.map((account) => (
                <SelectItem key={account.id} value={account.id} className="p-3">
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold">{account.name}</span>
                    <span className="text-xs text-muted-foreground">{account.industry}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-lg hover:bg-muted/50">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-0">
              <div className="px-4 py-3 border-b border-border/50">
                <h3 className="text-sm font-semibold">Notifications</h3>
                <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`flex flex-col items-start gap-2 p-4 hover:bg-muted/50 ${notification.read ? "opacity-60" : ""}`}
                    onSelect={() => markNotification(notification.id, true)}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="text-sm font-medium">{notification.title}</span>
                      <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{notification.description}</p>
                    <span className="text-xs text-primary font-medium">{notification.linkLabel}</span>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 rounded-lg px-3 font-medium hover:bg-muted/50">
                <Rows className="mr-2 h-4 w-4" /> Demo
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-0">
              <div className="px-4 py-3 border-b border-border/50">
                <h3 className="text-sm font-semibold">Demo Controls</h3>
                <p className="text-xs text-muted-foreground">Manage demo settings</p>
              </div>
              <div className="p-1">
                <DropdownMenuItem onSelect={resetDemo} className="gap-3 p-3 rounded-md">
                  <ArrowDownRight className="h-4 w-4" /> 
                  <span>Reset demo</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={toggleGuided} className="gap-3 p-3 rounded-md">
                  <BadgeCheck className="h-4 w-4" /> 
                  <span>Guided overlay</span>
                  <span className="ml-auto text-xs text-muted-foreground">{demoGuided ? "on" : "off"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={toggleFastForward} className="gap-3 p-3 rounded-md">
                  <ArrowUpRight className="h-4 w-4" /> 
                  <span>Fast-forward</span>
                  <span className="ml-auto text-xs text-muted-foreground">{fastForward ? "on" : "off"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={toggleFallback} className="gap-3 p-3 rounded-md">
                  <Download className="h-4 w-4" /> 
                  <span>Fallback mode</span>
                  <span className="ml-auto text-xs text-muted-foreground">{fallbackMode ? "active" : "off"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={toggleDeveloperMode} className="gap-3 p-3 rounded-md">
                  <Wrench className="h-4 w-4" /> 
                  <span>Developer mode</span>
                  <span className="ml-auto text-xs text-muted-foreground">{developerMode ? "on" : "off"}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={cycleLatency} className="gap-3 p-3 rounded-md">
                  <Rows className="h-4 w-4" />
                  <span>Latency: {latency}</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
