// src/components/ui/card.tsx
import * as React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: CardProps) {
  const base = "rounded-xl border bg-background text-foreground shadow-sm";
  return <div className={`${base} ${className}`} {...props} />;
}

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export function CardHeader({ className = "", ...props }: CardHeaderProps) {
  const base = "flex flex-col space-y-1.5 p-6";
  return <div className={`${base} ${className}`} {...props} />;
}

type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

export function CardContent({ className = "", ...props }: CardContentProps) {
  const base = "p-6 pt-0";
  return <div className={`${base} ${className}`} {...props} />;
}

type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export function CardDescription({
  className = "",
  ...props
}: CardDescriptionProps) {
  const base = "text-sm text-muted-foreground";
  return <p className={`${base} ${className}`} {...props} />;
}
