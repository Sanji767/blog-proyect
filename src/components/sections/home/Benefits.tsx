"use client";

import { benefits } from "@/components/benefits/data/benefits"; // ← CORREGIDO
import BenefitSection from "@/components/benefits/BenefitSection";
import Container from "@/components/layout/Container";

export default function Benefits() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/30">
      <Container>
        {/* Título principal */}
        <div className="mb-14 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold md:text-4xl">
            Beneficios de usar{" "}
            <span className="text-primary">Bancos Europa</span>
          </h2>
          <p className="mt-3 text-muted-foreground text-sm md:text-base">
            Compara, entiende y elige el banco perfecto para tu vida en Europa:
            freelancers, expatriados, expatriados, viajeros o empresas.
          </p>
        </div>

        {/* Render dinámico de secciones */}
        <div className="space-y-24 md:space-y-32">
          {benefits.map((section, index) => (
            <BenefitSection key={section.id} benefit={section} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}