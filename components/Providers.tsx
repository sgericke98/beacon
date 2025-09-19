"use client";

import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@/components/ui/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
}
