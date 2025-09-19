import type { HTMLAttributes } from "react";

type BadgeVariant = "default" | "secondary" | "outline" | "success" | "warning" | "destructive";

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-foreground text-background",
  secondary: "bg-muted text-muted-foreground",
  outline: "border border-border text-foreground",
  success: "bg-green-500/15 text-green-600",
  warning: "bg-amber-500/15 text-amber-600",
  destructive: "bg-red-500/15 text-red-600",
};

export function Badge({ className = "", variant = "default", ...props }: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
