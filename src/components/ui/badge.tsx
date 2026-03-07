// src/components/ui/badge.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const base =
  "inline-flex items-center rounded-full border-2 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]";

const variants: Record<BadgeVariant, string> = {
  default: "border-secondary bg-secondary text-secondary-foreground",
  secondary: "border-secondary bg-accent text-accent-foreground",
  destructive: "border-secondary bg-destructive text-destructive-foreground",
  outline: "border-secondary/25 bg-transparent text-foreground",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return <span className={cn(base, variants[variant], className)} {...props} />;
}

