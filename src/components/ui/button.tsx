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
  "inline-flex items-center justify-center whitespace-nowrap border text-sm font-semibold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  default:
    "rounded-full border-transparent bg-primary text-primary-foreground hover:bg-primary-accent",
  secondary:
    "rounded-full border-transparent bg-primary/10 text-primary hover:bg-primary/20",
  outline:
    "rounded-full border-input bg-transparent text-foreground hover:bg-muted",
  ghost:
    "rounded-full border-transparent bg-transparent text-foreground hover:bg-muted",
  destructive:
    "rounded-full border-transparent bg-destructive text-destructive-foreground",
  link: "border-transparent bg-transparent p-0 text-primary-text underline-offset-4 hover:underline",
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
