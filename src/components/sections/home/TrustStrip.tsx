// src/components/sections/home/TrustStrip.tsx
// Homepage trust bar: real, counted numbers (banks in the dataset, free
// tools, guides & articles) with animated counters, plus the editorial
// trust signals. All numbers come from the repo/data — never invented.
import { ShieldCheck, Landmark, Gavel, Globe } from "lucide-react";
import Container from "@/components/layout/Container";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import type { Locale } from "@/lib/i18n";

export type TrustStats = {
  /** Banks in src/lib/banks.ts. */
  banks: number;
  /** Free tools in src/lib/tools.ts. */
  tools: number;
  /** Guides & articles, rounded down to the decade (shown with a "+" suffix). */
  articlesBase: number;
};

const SIGNALS_BY_LOCALE = {
  es: [
    { name: "Licencia y supervisión", icon: Landmark },
    { name: "Garantía de depósitos", icon: ShieldCheck },
    { name: "Comisiones claras", icon: Gavel },
    { name: "IBAN / SEPA", icon: Globe },
  ],
  en: [
    { name: "License & regulation", icon: Landmark },
    { name: "Deposit protection", icon: ShieldCheck },
    { name: "Clear fees", icon: Gavel },
    { name: "IBAN / SEPA", icon: Globe },
  ],
} as const;

const STATS_COPY = {
  es: {
    banks: "Bancos comparados",
    tools: "Herramientas gratuitas",
    articles: "Guías y artículos",
  },
  en: {
    banks: "Banks compared",
    tools: "Free tools",
    articles: "Guides & articles",
  },
} as const;

export default function TrustStrip({
  locale = "es",
  stats,
}: {
  locale?: Locale;
  stats: TrustStats;
}) {
  const signals = SIGNALS_BY_LOCALE[locale];
  const labels = STATS_COPY[locale];

  const items = [
    { value: stats.banks, suffix: "", label: labels.banks },
    { value: stats.tools, suffix: "", label: labels.tools },
    { value: stats.articlesBase, suffix: "+", label: labels.articles },
  ];

  return (
    <div className="border-y-2 border-border bg-muted py-10">
      <Container>
        <div className="grid gap-8 text-center sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.label}>
              <p className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                <AnimatedCounter value={item.value} suffix={item.suffix} />
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 border-t border-border/60 pt-8">
          {signals.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <item.icon className="h-5 w-5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
