// src/components/ui/logo.tsx
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  showText?: boolean;
  tone?: "default" | "inverse";
};

export default function Logo({
  className,
  showText = true,
  tone = "default",
}: LogoProps) {
  const isInverse = tone === "inverse";

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="relative">
        <div className="h-10 w-10 md:h-11 md:w-11 rounded-lg border-2 border-secondary bg-accent shadow-offset-accent" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="font-display text-lg font-black tracking-tight text-secondary">
            F
          </span>
        </div>
      </div>

      {showText ? (
        <div className="flex flex-col leading-none">
          <p
            className={cn(
              "font-display text-lg font-bold tracking-tight",
              isInverse ? "text-secondary-foreground" : "text-foreground"
            )}
          >
            Finanzas<span className="text-primary">EU</span>
          </p>
          <p
            className={cn(
              "mt-1 text-[10px] font-semibold uppercase tracking-[0.22em]",
              isInverse ? "text-primary/90" : "text-muted-foreground"
            )}
          >
            Bancos · Europa · IBAN
          </p>
        </div>
      ) : null}
    </div>
  );
}
