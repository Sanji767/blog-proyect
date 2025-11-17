// components/ui/badge.tsx
import * as React from "react";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

function getBadgeClasses(variant: BadgeVariant = "default", extra?: string) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  const variantClasses: Record<BadgeVariant, string> = {
    default: "border-transparent bg-primary text-primary-foreground shadow",
    secondary:
      "border-transparent bg-secondary text-secondary-foreground shadow",
    destructive:
      "border-transparent bg-destructive text-destructive-foreground shadow",
    outline: "text-foreground",
  };

  return [base, variantClasses[variant], extra].filter(Boolean).join(" ");
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span className={getBadgeClasses(variant, className)} {...props} />
  );
}
