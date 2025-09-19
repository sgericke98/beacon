"use client";

import { Menu } from "lucide-react";
import { useUIStore } from "@/store/ui";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar } from "@/components/ui/avatar";
import { BeaconNav } from "@/components/BeaconNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, closeSidebar, openSidebar } = useUIStore();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-64 flex-col border-r border-border bg-background md:flex">
        <div className="px-6 py-6 text-lg font-semibold">Beacon</div>
        <div className="flex-1 overflow-y-auto px-3 pb-6">
          <BeaconNav />
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-4 py-4 md:px-6">
          <div className="flex items-center gap-2">
            <Sheet open={sidebarOpen} onOpenChange={(open) => (open ? openSidebar() : closeSidebar())}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" onClick={openSidebar}>
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-72">
                <SheetHeader>
                  <SheetTitle>Navigate</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <BeaconNav onNavigate={closeSidebar} />
                </div>
              </SheetContent>
            </Sheet>
            <span className="text-lg font-semibold text-foreground md:hidden">Beacon</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Avatar initials="AR" alt="Alex Rivera" />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
