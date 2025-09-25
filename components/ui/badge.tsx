import type { HTMLAttributes } from "react";

type BadgeVariant = "default" | "secondary" | "outline" | "success" | "warning" | "destructive";

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  outline: "border border-border text-foreground",
  success: "bg-green-500/15 text-green-600 dark:bg-green-500/20 dark:text-green-400",
  warning: "bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  destructive: "bg-destructive/15 text-destructive dark:bg-destructive/20 dark:text-destructive-foreground",
};

export function Badge({ className = "", variant = "default", ...props }: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
