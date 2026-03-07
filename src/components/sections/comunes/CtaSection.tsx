// src/components/sections/comunes/CtaSection.tsx
import Link from "next/link";
import { ArrowRight, Compass, MessageCircle } from "lucide-react";

import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section className="border-t-2 border-secondary bg-secondary py-16 text-secondary-foreground md:py-20">
      <Container className="space-y-7 text-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-secondary bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-foreground shadow-offset-accent">
            <Compass className="h-3.5 w-3.5" />
            Tu brújula para bancos en Europa
          </div>

          <h2 className="text-balance text-3xl font-black tracking-tight text-accent md:text-5xl">
            ¿Aún no sabes qué banco encaja contigo?
          </h2>

          <p className="mx-auto max-w-2xl text-pretty text-sm leading-relaxed text-secondary-foreground/80 md:text-base">
            Empieza por la comparativa y quédate con 1–3 opciones claras según
            tu situación real: viajes, remoto, nómina o empresa.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild className="gap-2">
            <Link href="/comparativa">
              Ver ranking de bancos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-secondary-foreground/20 text-secondary-foreground hover:border-secondary-foreground/35 hover:bg-secondary-foreground/5"
          >
            <Link href="/contacto">
              <span className="inline-flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Escribirnos
              </span>
            </Link>
          </Button>
        </div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-2 text-[11px] text-secondary-foreground/80 sm:grid-cols-3">
          <p className="rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-3 py-1">
            ✔ Transparencia: explicamos opciones
          </p>
          <p className="rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-3 py-1">
            ✔ Enfoque práctico para vivir y trabajar en Europa
          </p>
          <p className="rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-3 py-1">
            ✔ Web gratuita: tú decides dónde abrir cuenta
          </p>
        </div>
      </Container>
    </section>
  );
}

