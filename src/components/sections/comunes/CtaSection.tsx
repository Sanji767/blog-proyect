// src/components/sections/comunes/CtaSection.tsx
import Link from "next/link";
import { ArrowRight, Compass, MessageCircle } from "lucide-react";

import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { withLocale, type Locale } from "@/lib/i18n";

const COPY = {
  es: {
    kicker: "Tu brújula para bancos en Europa",
    title: "¿Aún no sabes qué banco encaja contigo?",
    desc: "Empieza por la comparativa y quédate con 1–3 opciones claras según tu situación real: viajes, remoto, nómina o empresa.",
    ctaPrimary: "Ver ranking de bancos",
    ctaSecondary: "Escribirnos",
    bullets: [
      "✔ Transparencia: explicamos opciones",
      "✔ Enfoque práctico para vivir y trabajar en Europa",
      "✔ Web gratuita: tú decides dónde abrir cuenta",
    ],
  },
  en: {
    kicker: "Your compass for banks in Europe",
    title: "Not sure which bank fits you yet?",
    desc: "Start with the comparison and narrow it down to 1–3 clear options based on your real situation: travel, remote work, salary or business.",
    ctaPrimary: "See bank ranking",
    ctaSecondary: "Contact us",
    bullets: [
      "✔ Transparency: we explain trade-offs",
      "✔ Practical focus for living and working in Europe",
      "✔ Free website: you decide where to open an account",
    ],
  },
} as const;

export default function CtaSection({ locale = "es" }: { locale?: Locale }) {
  const copy = COPY[locale];

  return (
    <section className="border-t-2 border-secondary bg-secondary py-16 text-secondary-foreground md:py-20">
      <Container className="space-y-7 text-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-secondary bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-foreground shadow-offset-accent">
            <Compass className="h-3.5 w-3.5" />
            {copy.kicker}
          </div>

          <h2 className="text-balance text-3xl font-black tracking-tight text-accent md:text-5xl">
            {copy.title}
          </h2>

          <p className="mx-auto max-w-2xl text-pretty text-sm leading-relaxed text-secondary-foreground/80 md:text-base">
            {copy.desc}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild className="gap-2">
            <Link href={withLocale("/comparativa", locale)}>
              {copy.ctaPrimary}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-secondary-foreground/20 text-secondary-foreground hover:border-secondary-foreground/35 hover:bg-secondary-foreground/5"
          >
            <Link href={withLocale("/contacto", locale)}>
              <span className="inline-flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                {copy.ctaSecondary}
              </span>
            </Link>
          </Button>
        </div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-2 text-[11px] text-secondary-foreground/80 sm:grid-cols-3">
          {copy.bullets.map((text) => (
            <p
              key={text}
              className="rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-3 py-1"
            >
              {text}
            </p>
          ))}
        </div>
      </Container>
    </section>
  );
}
