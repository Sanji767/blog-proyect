// src/components/sections/home/TrustStrip.tsx
import { ShieldCheck, Landmark, Gavel, Globe } from "lucide-react";
import Container from "@/components/layout/Container";

export default function TrustStrip() {
  const signals = [
    { name: "Licencia y supervisión", icon: Landmark },
    { name: "Garantía de depósitos", icon: ShieldCheck },
    { name: "Comisiones claras", icon: Gavel },
    { name: "IBAN / SEPA", icon: Globe },
  ];

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

