"use client";

import { createContext, useContext, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface TooltipContextValue {
  content: string;
  open: boolean;
  targetRect: DOMRect | null;
  setOpen: (open: boolean) => void;
  setTargetRect: (rect: DOMRect | null) => void;
  setContent: (value: string) => void;
}

const TooltipContext = createContext<TooltipContextValue | null>(null);

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const value: TooltipContextValue = {
    content,
    open,
    targetRect,
    setOpen,
    setTargetRect,
    setContent,
  };
  return <TooltipContext.Provider value={value}>{children}</TooltipContext.Provider>;
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function TooltipTrigger({ children, content }: { children: React.ReactElement; content: string }) {
  const context = useContext(TooltipContext);
  const ref = useRef<HTMLElement | null>(null);

  if (!context) {
    throw new Error("TooltipTrigger must be used within TooltipProvider");
  }

  return (
    <span
      ref={(node) => {
        ref.current = node as HTMLElement;
      }}
      onFocus={() => {
        if (ref.current) {
          context.setTargetRect(ref.current.getBoundingClientRect());
        }
        context.setContent(content);
        context.setOpen(true);
      }}
      onBlur={() => context.setOpen(false)}
      onMouseEnter={() => {
        if (ref.current) {
          context.setTargetRect(ref.current.getBoundingClientRect());
        }
        context.setContent(content);
        context.setOpen(true);
      }}
      onMouseLeave={() => context.setOpen(false)}
      className="inline-flex"
      aria-describedby={context.open ? "tooltip" : undefined}
    >
      {children}
      {null}
    </span>
  );
}

export function TooltipContent() {
  const context = useContext(TooltipContext);
  const [container] = useState(() => (typeof document !== "undefined" ? document.body : null));
  if (!context || !container || !context.open || !context.targetRect) return null;
  return createPortal(
    <div
      role="tooltip"
      id="tooltip"
      className="pointer-events-none fixed z-50 rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-lg"
      style={{
        top: context.targetRect.bottom + 6,
        left: context.targetRect.left + context.targetRect.width / 2,
        transform: "translateX(-50%)",
      }}
    >
      {context.content}
    </div>,
    container
  );
}
