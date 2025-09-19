"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  return <DropdownContext.Provider value={{ open, setOpen, triggerRef }}>{children}</DropdownContext.Provider>;
}

export function DropdownMenuTrigger({ children }: { children: React.ReactElement }) {
  const context = useContext(DropdownContext);
  if (!context) throw new Error("DropdownMenuTrigger must be used within DropdownMenu");
  return (
    <button
      ref={context.triggerRef}
      className="inline-flex items-center"
      onClick={() => context.setOpen(!context.open)}
      type="button"
    >
      {children}
    </button>
  );
}

export function DropdownMenuContent({ className = "", children }: { className?: string; children: React.ReactNode }) {
  const context = useContext(DropdownContext);
  const [container] = useState(() => (typeof document !== "undefined" ? document.body : null));
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!context?.open) return undefined;
    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current || !context.triggerRef.current) return;
      if (!menuRef.current.contains(event.target as Node) && !context.triggerRef.current.contains(event.target as Node)) {
        context.setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [context]);

  if (!context?.open || !container || !context.triggerRef.current) return null;
  const rect = context.triggerRef.current.getBoundingClientRect();
  return createPortal(
    <div
      ref={menuRef}
      className={`fixed z-50 min-w-[180px] rounded-md border border-border bg-background p-1 shadow-lg ${className}`}
      style={{ top: rect.bottom + 6, left: rect.left }}
      role="menu"
    >
      {children}
    </div>,
    container
  );
}

export function DropdownMenuItem({ className = "", children, onSelect }: { className?: string; children: React.ReactNode; onSelect?: () => void }) {
  const context = useContext(DropdownContext);
  return (
    <button
      className={`flex w-full cursor-pointer items-center rounded-sm px-3 py-2 text-sm hover:bg-muted ${className}`}
      type="button"
      onClick={() => {
        onSelect?.();
        context?.setOpen(false);
      }}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator() {
  return <div className="my-1 h-px bg-border" />;
}
