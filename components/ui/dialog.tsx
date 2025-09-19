"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return <DialogContext.Provider value={{ open, onOpenChange }}>{children}</DialogContext.Provider>;
}

export function DialogTrigger({ children }: { children: React.ReactElement }) {
  const context = useContext(DialogContext);
  if (!context) throw new Error("DialogTrigger must be used within Dialog");
  return (
    <span
      onClick={() => context.onOpenChange(true)}
      className="inline-flex"
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

export function DialogContent({ className = "", children }: { className?: string; children: React.ReactNode }) {
  const context = useContext(DialogContext);
  const overlayRef = useRef<HTMLDivElement | null>(null);
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
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(event) => {
        if (event.target === overlayRef.current) {
          context.onOpenChange(false);
        }
      }}
    >
      <div className={`w-full max-w-2xl rounded-lg bg-background shadow-xl ${className}`}>{children}</div>
    </div>,
    document.body
  );
}

export function DialogHeader({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`flex flex-col space-y-1.5 border-b border-border p-6 ${className}`}>{children}</div>;
}

export function DialogTitle({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
}

export function DialogDescription({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>;
}

export function DialogFooter({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`flex items-center justify-end gap-2 border-t border-border p-6 ${className}`}>{children}</div>;
}

export function DialogClose({ children }: { children: React.ReactElement }) {
  const context = useContext(DialogContext);
  if (!context) throw new Error("DialogClose must be used within Dialog");
  return (
    <span
      onClick={() => context.onOpenChange(false)}
      className="inline-flex"
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          context.onOpenChange(false);
        }
      }}
    >
      {children}
    </span>
  );
}
