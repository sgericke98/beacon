"use client";

import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@/components/ui/toast";
import { AgentProvider } from "@/store/agent-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <ToastProvider>
        <AgentProvider>{children}</AgentProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
