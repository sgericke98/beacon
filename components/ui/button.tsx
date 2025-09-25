"use client";

import { forwardRef } from "react";

type ButtonVariant = "default" | "outline" | "ghost" | "secondary" | "destructive";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg" | "icon";
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background";

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95 shadow-sm",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
  ghost: "bg-transparent hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/90",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/95 shadow-sm",
};

const sizeClasses = {
  sm: "h-9 px-3",
  md: "h-10 px-4",
  lg: "h-11 px-6 text-base",
  icon: "h-10 w-10",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  )
);

Button.displayName = "Button";

export type { ButtonProps };
