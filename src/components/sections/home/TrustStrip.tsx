// src/components/sections/home/TrustStrip.tsx
import { ShieldCheck, Landmark, Gavel, Globe } from "lucide-react";
import Container from "@/components/layout/Container";

export default function TrustStrip() {
  const authorities = [
    { name: "Banco de España", icon: Landmark },
    { name: "FGD Europeo", icon: ShieldCheck },
    { name: "Regulación CNMV", icon: Gavel },
    { name: "Pasaporte UE", icon: Globe },
  ];

  return (
    <div className="border-y border-border bg-muted/20 py-6">
      <Container>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {authorities.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-bold tracking-tighter uppercase">{item.name}</span>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}