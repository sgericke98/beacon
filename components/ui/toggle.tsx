"use client";

import { forwardRef } from "react";

type ToggleProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  pressed?: boolean;
};

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(({ className = "", pressed = false, ...props }, ref) => (
  <button
    ref={ref}
    data-state={pressed ? "on" : "off"}
    className={`inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm ${className}`}
    aria-pressed={pressed}
    {...props}
  />
));

Toggle.displayName = "Toggle";
