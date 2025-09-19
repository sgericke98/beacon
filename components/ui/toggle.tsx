"use client";

import { forwardRef } from "react";

type ToggleProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  pressed?: boolean;
};

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(({ className = "", pressed = false, ...props }, ref) => (
  <button
    ref={ref}
    data-state={pressed ? "on" : "off"}
    className={`inline-flex h-9 items-center justify-center rounded-md border border-border px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=on]:bg-foreground data-[state=on]:text-background ${className}`}
    aria-pressed={pressed}
    {...props}
  />
));

Toggle.displayName = "Toggle";
