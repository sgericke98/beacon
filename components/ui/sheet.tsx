"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface SheetContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SheetContext = createContext<SheetContextValue | null>(null);

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  return <SheetContext.Provider value={{ open, onOpenChange }}>{children}</SheetContext.Provider>;
}

export function SheetTrigger({ children }: { children: React.ReactElement }) {
  const context = useContext(SheetContext);
  if (!context) throw new Error("SheetTrigger must be used within Sheet");
  return (
    <span
      className="inline-flex"
      onClick={() => context.onOpenChange(true)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          context.onOpenChange(true);
        }
      }}
    >
      {children}
    </span>
  );
}

export function SheetContent({ className = "", children }: { className?: string; children: React.ReactNode }) {
  const context = useContext(SheetContext);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (context?.open) {
      const handler = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          context.onOpenChange(false);
        }
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }
    return undefined;
  }, [context]);

  if (!context?.open) return null;
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40"
      onClick={(event) => {
        if (event.target === containerRef.current) {
          context.onOpenChange(false);
        }
      }}
    >
      <div ref={containerRef} className={`h-full w-80 max-w-full bg-background shadow-lg ${className}`}>
        {children}
      </div>
    </div>,
    document.body
  );
}

export function SheetHeader({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`flex items-center justify-between border-b border-border p-4 ${className}`}>{children}</div>;
}

export function SheetTitle({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <h2 className={`text-base font-semibold ${className}`}>{children}</h2>;
}

export function SheetDescription({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>;
}
