// src/app/page.tsx
import type { Metadata } from "next";

import Hero from "@/components/sections/home/Hero";
import Features from "@/components/sections/home/Features";
import Benefits from "@/components/sections/home/Benefits";
import HomeBanksPreview from "@/components/sections/home/HomeBanksPreview";
import HomeHowItWorks from "@/components/sections/home/HomeHowItWorks";
import HomeFaqPreview from "@/components/sections/home/HomeFaqPreview";
import HomeVlogsPreview from "@/components/sections/home/HomeVlogsPreview";
import CurrencyComparison from "@/components/sections/home/CurrencyComparison";

// 🚀 Nuevos Componentes Avanzados
import TrustStrip from "@/components/sections/home/TrustStrip";
import UseCases from "@/components/sections/home/UseCases";
import StickyPromo from "@/components/layout/StickyPromo";

// 🧠 NUEVA HERRAMIENTA


/* ============================
   🧠 SEO / METADATA
============================ */
export const metadata: Metadata = {
  title: "Comparador de Bancos y Validador de IBAN | Ahorra y Elige Mejor",
  description:
    "Descubre qué banco te conviene, compara comisiones y valida cualquier IBAN. Herramientas gratuitas para elegir mejor tu cuenta bancaria.",
  keywords: [
    "comparador de bancos",
    "mejor banco",
    "validar IBAN",
    "comprobador IBAN",
    "IBAN España",
    "bancos sin comisiones",
    "cuentas bancarias",
    "SEPA IBAN",
  ],
  openGraph: {
    title: "Comparador de Bancos + Validador de IBAN",
    description:
      "Compara bancos, descubre de qué país es un IBAN y valida cuentas en segundos.",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Comparador de Bancos y Validador de IBAN",
    description:
      "Elige mejor tu banco y valida cualquier IBAN en segundos.",
  },
};

export default function HomePage() {
  return (
    <>
      {/* 1. Impacto Inicial */}
      <Hero />

      {/* 2. Autoridad Inmediata */}
      <TrustStrip />

      {/* 3. Características y Segmentación */}
      <Features />
      <UseCases />

      {/* 4. 🔎 Herramienta SEO: Validador IBAN */}
      <section className="py-24 bg-muted/30">
      </section>

      {/* 5. Producto: Selección de bancos */}
      <HomeBanksPreview />

      {/* 6. Valor y Dolor */}
      <Benefits />
      <CurrencyComparison />

      {/* 7. Social Proof y Metodología */}
      <HomeHowItWorks />
      <HomeVlogsPreview />
      <HomeFaqPreview />

      {/* 8. Conversión */}
      <StickyPromo />
    </>
  );
}
