// src/components/sections/home/TrustStrip.tsx
import { ShieldCheck, Landmark, Gavel, Globe } from "lucide-react";
import Container from "@/components/layout/Container";
import type { Locale } from "@/lib/i18n";

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

export default function TrustStrip({ locale = "es" }: { locale?: Locale }) {
  const signals = SIGNALS_BY_LOCALE[locale];

  return (
    <div className="border-y-2 border-border bg-muted py-6">
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
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
