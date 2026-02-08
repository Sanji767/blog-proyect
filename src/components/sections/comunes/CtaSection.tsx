// src/components/sections/comunes/CtaSection.tsx
import Link from "next/link";
import { ArrowRight, MessageCircle, Compass } from "lucide-react";
import Container from "@/components/layout/Container";

export default function CtaSection() {
  return (
    <section className="border-t border-border bg-hero-background/70 py-14 md:py-18">
      <Container className="space-y-6 text-center">
        {/* Badge + título */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200">
            <Compass className="h-3.5 w-3.5" />
            Tu brújula para bancos en Europa
          </div>

          <h2 className="text-balance text-2xl font-bold md:text-3xl">
            ¿Aún no sabes qué banco encaja mejor contigo?
          </h2>

          <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
            Puedes empezar comparando los bancos más usados por viajeros,
            remotos y gente que cobra en varias divisas. Si sigues con dudas,
            te ayudamos a elegir 1–3 opciones claras según tu situación real.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Botón principal – degradado verde/turquesa */}
          <Link
            href="/comparativa"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-7 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-transform hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0"
          >
            Ver ranking de bancos
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>

          {/* Botón secundario */}
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center rounded-full border border-border bg-background/80 px-7 py-2.5 text-sm font-semibold text-foreground shadow-sm hover:bg-background"
          >
            <MessageCircle className="mr-1.5 h-4 w-4" />
            Escribirnos
          </Link>
        </div>

        {/* Mini beneficios debajo de los botones */}
        <div className="mx-auto mt-2 grid max-w-xl grid-cols-1 gap-2 text-[11px] text-muted-foreground sm:grid-cols-3">
          <p className="rounded-full bg-background/80 px-3 py-1">
            ✔ Transparencia: explicamos opciones
          </p>
          <p className="rounded-full bg-background/80 px-3 py-1">
            ✔ Enfoque práctico para vivir y trabajar en Europa
          </p>
          <p className="rounded-full bg-background/80 px-3 py-1">
            ✔ Web gratuita, tú decides dónde abrir cuenta
          </p>
        </div>
      </Container>
    </section>
  );
}
