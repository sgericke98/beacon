"use client";

import { forwardRef } from "react";

type SwitchProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  checked?: boolean;
};

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(({ className = "", checked = false, ...props }, ref) => (
  <button
    ref={ref}
    role="switch"
    aria-checked={checked}
    data-state={checked ? "checked" : "unchecked"}
    className={`inline-flex h-6 w-11 items-center rounded-full border border-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
      checked ? "bg-foreground" : "bg-muted"
    } ${className}`}
    {...props}
  >
    <span
      className={`ml-1 inline-block h-4 w-4 rounded-full bg-background transition-transform ${
        checked ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
));

Switch.displayName = "Switch";
