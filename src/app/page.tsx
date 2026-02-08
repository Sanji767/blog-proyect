// src/app/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

import Hero from "@/components/sections/home/Hero";
import Features from "@/components/sections/home/Features";
import Benefits from "@/components/sections/home/Benefits";
import HomeBanksPreview from "@/components/sections/home/HomeBanksPreview";
import HomeHowItWorks from "@/components/sections/home/HomeHowItWorks";
import HomeFaqPreview from "@/components/sections/home/HomeFaqPreview";
import HomeVlogsPreview from "@/components/sections/home/HomeVlogsPreview";
import CurrencyComparison from "@/components/sections/home/CurrencyComparison";
import CtaSection from "@/components/sections/comunes/CtaSection";

// 🚀 Nuevos Componentes Avanzados
import TrustStrip from "@/components/sections/home/TrustStrip";
import UseCases from "@/components/sections/home/UseCases";
import Container from "@/components/layout/Container";


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
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-8 shadow-card md:p-12">
            <div className="pointer-events-none absolute -top-28 -right-28 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-wide text-primary">
                  <ShieldCheck className="h-4 w-4" />
                  Herramienta gratuita
                </div>

                <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                  Valida un IBAN en segundos (país, SEPA y entidad)
                </h2>

                <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                  Pega cualquier IBAN y te decimos si tiene la longitud correcta,
                  si pertenece a SEPA y, cuando aplica, el banco asociado. Ideal
                  para nóminas, transferencias internacionales y comprobar datos
                  antes de enviar dinero.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/iban"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary/80 px-7 py-3 text-sm font-black text-white shadow-lg hover:shadow-xl transition"
                  >
                    Abrir IBAN Scanner
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/bancos"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-border/60 bg-background px-7 py-3 text-sm font-black text-foreground hover:bg-muted transition"
                  >
                    Ver comparador de bancos
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl border border-border/60 bg-background/70 p-6 shadow-sm backdrop-blur">
                <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">
                  Ejemplo rápido
                </p>
                <p className="mt-3 font-mono text-sm md:text-base">
                  ES91 2100 0418 4502 0005 1332
                </p>
                <div className="mt-5 grid gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">País</span>
                    <span className="font-semibold">España</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">SEPA</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      Sí
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Longitud</span>
                    <span className="font-semibold">24</span>
                  </div>
                </div>
                <p className="mt-5 text-xs text-muted-foreground">
                  Esta herramienta no mueve dinero: solo valida y explica el
                  formato del IBAN.
                </p>
              </div>
            </div>
          </div>
        </Container>
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
      <CtaSection />
    </>
  );
}
