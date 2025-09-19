"use client";

import { createContext, useContext, useState } from "react";

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ defaultValue, value, onValueChange, children, className = "" }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const current = value ?? internalValue;
  const setValue = (next: string) => {
    setInternalValue(next);
    onValueChange?.(next);
  };
  return (
    <TabsContext.Provider value={{ value: current, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`inline-flex h-10 items-center rounded-md border border-border bg-muted p-1 text-muted-foreground ${className}`}>{children}</div>;
}

export function TabsTrigger({ value, className = "", children }: { value: string; className?: string; children: React.ReactNode }) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabsTrigger must be used within Tabs");
  }
  const active = context.value === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => context.setValue(value)}
      className={`inline-flex min-w-[120px] items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        active ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className = "", children }: { value: string; className?: string; children: React.ReactNode }) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabsContent must be used within Tabs");
  }
  if (context.value !== value) return null;
  return (
    <div role="tabpanel" className={`mt-4 ${className}`}>
      {children}
    </div>
  );
}
