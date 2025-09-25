"use client";

import { forwardRef, type HTMLAttributes } from "react";

type ScrollAreaProps = HTMLAttributes<HTMLDivElement>;

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { className = "", children, ...props },
  ref
) {
  return (
    <div ref={ref} className={`overflow-y-auto ${className}`} {...props}>
      {children}
    </div>
  );
});
