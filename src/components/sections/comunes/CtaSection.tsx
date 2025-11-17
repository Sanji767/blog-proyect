// src/components/sections/comunes/CtaSection.tsx
import Link from "next/link";
import Container from "@/components/layout/Container";

export default function CtaSection() {
  return (
    <section className="border-t border-border bg-hero-background/70 py-12 md:py-16">
      <Container className="space-y-4 text-center">
        <h2 className="text-2xl font-bold md:text-3xl">
          ¿No sabes qué banco encaja mejor contigo?
        </h2>
        <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
          Puedes empezar comparando los bancos más usados por viajeros, remotos
          y gente que trabaja con varias divisas. Si sigues con dudas, escríbeme
          y te recomiendo algo más ajustado a tu caso.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/bancos"
            className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-2.5 text-sm font-semibold text-black shadow-soft hover:brightness-105"
          >
            Ver bancos recomendados →
          </Link>
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center rounded-full border border-border px-7 py-2.5 text-sm font-semibold text-foreground hover:bg-background/70"
          >
            Preguntarme directamente
          </Link>
        </div>
      </Container>
    </section>
  );
}
