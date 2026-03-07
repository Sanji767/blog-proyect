// src/components/ui/button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const base =
  "inline-flex items-center justify-center whitespace-nowrap border-2 text-sm font-semibold tracking-tight transition-transform transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:translate-y-px";

const variants: Record<ButtonVariant, string> = {
  default:
    "rounded-xl border-secondary bg-accent text-accent-foreground shadow-offset-accent hover:-translate-x-1 hover:-translate-y-1",
  secondary:
    "rounded-xl border-secondary bg-secondary text-secondary-foreground shadow-offset-accent hover:-translate-x-1 hover:-translate-y-1",
  outline:
    "rounded-xl border-secondary/25 bg-transparent text-foreground hover:border-secondary/60 hover:bg-muted",
  ghost:
    "rounded-xl border-transparent bg-transparent text-foreground hover:bg-muted",
  destructive:
    "rounded-xl border-secondary bg-destructive text-destructive-foreground shadow-offset-accent hover:-translate-x-1 hover:-translate-y-1",
  link: "border-transparent bg-transparent p-0 text-primary underline-offset-4 hover:underline",
};

const sizes: Record<ButtonSize, string> = {
  default: "h-11 px-5",
  sm: "h-10 px-4 text-sm",
  lg: "h-12 px-7 text-base",
  icon: "h-11 w-11",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
