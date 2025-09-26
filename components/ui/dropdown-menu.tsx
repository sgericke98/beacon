"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
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

export function DropdownMenuTrigger({ children, asChild }: { children: React.ReactElement; asChild?: boolean }) {
  const context = useContext(DropdownContext);
  if (!context) throw new Error("DropdownMenuTrigger must be used within DropdownMenu");
  
  if (asChild) {
    return React.cloneElement(children, {
      ref: context.triggerRef,
      onClick: () => context.setOpen(!context.open),
    });
  }
  
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

export function DropdownMenuContent({ className = "", children, align = "start" }: { className?: string; children: React.ReactNode; align?: "start" | "center" | "end" }) {
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
  
  const getAlignment = () => {
    switch (align) {
      case "end":
        return { left: rect.right - 200, top: rect.bottom + 6 };
      case "center":
        return { left: rect.left + (rect.width / 2) - 100, top: rect.bottom + 6 };
      default:
        return { left: rect.left, top: rect.bottom + 6 };
    }
  };

  const position = getAlignment();

  return createPortal(
    <div
      ref={menuRef}
      className={`fixed z-50 min-w-[180px] rounded-lg border border-border/50 bg-background shadow-xl animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 ${className}`}
      style={{ top: position.top, left: position.left }}
      role="menu"
    >
      {children}
    </div>,
    container
  );
}

export function DropdownMenuItem({ className = "", children, onSelect, onClick }: { className?: string; children: React.ReactNode; onSelect?: () => void; onClick?: () => void }) {
  const context = useContext(DropdownContext);
  return (
    <button
      className={`flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-muted/50 focus:bg-muted/50 transition-colors duration-150 ${className}`}
      type="button"
      onClick={() => {
        onSelect?.();
        onClick?.();
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
